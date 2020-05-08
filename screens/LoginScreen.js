import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Alert, TextInput, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import NetInfo from "@react-native-community/netinfo"
import {
	alterarUsuarioNoAsyncStorage,
	pegarUsuarioNoAsyncStorage,
} from '../actions'
import { sincronizarNaAPI, } from '../helpers/api'
import { connect } from 'react-redux'
import Loading from '../components/Loading'
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const botao = (props) => {
	return (
		<TouchableOpacity>
			<Text>{props.texto}</Text>
		</TouchableOpacity>
	)
}

function LoginScreen(props) {
	const [matricula, setMatricula] = React.useState('')
	const [carregando, setCarregando] = React.useState(false)

	React.useEffect(() => {
		async function loadResourcesAndDataAsync() {
			try {
				setCarregando(true)
				//await props.alterarUsuarioNoAsyncStorage({})
				const usuario = await props.pegarUsuarioNoAsyncStorage()
				if (usuario.matricula && usuario.matricula !== '') {
					props.navigation.navigate('Principal')
				}
			} catch (e) {
				console.warn(e);
			} finally {
				setCarregando(false)
			}
		}
		loadResourcesAndDataAsync();
	}, [])

	const submitHandler = async () => {
		let showErrorMessage = false	
		if(matricula === ''){
			showErrorMessage = true
		}
		if(showErrorMessage){
			Alert.alert('Preencha a matrícula')
		}else{
			try{
				setCarregando(true)
				let estado = null
				if(Platform.OS === 'android'){
					estado = await NetInfo.fetch()
				}
				if(Platform.OS === 'web'){
					estado = await NetInfo.getConnectionInfo()
				}
				if(
					(Platform.OS === 'android' && estado.isConnected) ||
					(Platform.OS === 'web' && estado) 
				) {
					const dados = {
						matricula,
					}
					sincronizarNaAPI(dados)
						.then(retorno => {
							if (retorno.ok) {
								props.alterarUsuarioNoAsyncStorage(retorno.usuario)
									.then(() => {
										setCarregando(false)
										setMatricula('')
										props.navigation.navigate('Tutorial')
									})
							} else {
								Alert.alert('Aviso', 'Aluno inativado, matrícula inválida ou Igreja não habilitada')
								setMatricula('')
								setCarregando(false)
							}
						})
				}else{
					Alert.alert('Alerta', 'Verifique sua Internet e tente novamente')
					setCarregando(false)
				}
			} catch (e) {
				console.warn(e);
			}
		}
	}

	const listaDeBotoes = []
	for(let i = 1; i <= 3; i++){
		let item = {}
		item.linha = i
		item.botoes = []
		for(let j = 1; j <= 3; j++){
			let valorParaSomar = 0
			if(i === 2){
				valorParaSomar = 3
			}
			if(i === 3){
				valorParaSomar = 6
			}
			const botao = {
				id: `botao${j*i}`,
				texto: j+valorParaSomar,
				onPress: () => setMatricula(`${matricula}${j+valorParaSomar}`),
				corBotao: Colors.primary
			}
			item.botoes.push(botao)
		}
		listaDeBotoes.push(item)
	}

	let item = {}
	item.linha = 4
	item.botoes = []
	for(let j = 1; j <= 3; j++){
		let id = 0
		let texto = ''
		let onPress = ''
		let corBotao = ''
		switch(j){
			case 1:
				id = 'botaoApagar'
				texto = <Ionicons
					name={'md-backspace'}
					size={24}
					style={{ marginBottom: -3 }} />
					onPress = () => setMatricula(matricula.substring(0, matricula.length-1))
					corBotao = '#AAAAAA'
				break;
			case 2:
				id = 'botaoZero'
				texto = 0
				onPress = () => setMatricula(`${matricula}0`)
				corBotao = Colors.primary
				break;
			case 3:
				id = 'botaoLogar'
				texto = <Ionicons
					name={'md-send'}
					size={24}
					style={{ marginBottom: -3 }} />
					onPress = () => submitHandler()
					corBotao = Colors.primary
				break;
		}
		const botao = {
			id,
			texto,
			onPress,
			corBotao,
		}
		item.botoes.push(botao)
	}
	listaDeBotoes.push(item)

	return (
		<View style={styles.container}>
			{
				carregando &&
					<Loading title='Entrando' />
			}
			{ 
				!carregando &&
					<>
						<View style={styles.viewLogo}>
							<Image
								source={require('../assets/images/logo.png')}
								style={styles.logo}
							/>
						</View>

						<View style={styles.conteudo}>
							<View
								style={{
									height: 50,
								}}>
								<Text style={styles.texto}>Informe a Matrícula</Text>
								<Text style={styles.texto}>{matricula}</Text>
							</View>
							<View 
								style={{
									flex: 1,
									paddingHorizontal: 80,
									paddingVertical: 30,
								}}>
								{
									listaDeBotoes.map(linha => {
										const linhaParaMostrar = linha.botoes.map(item => {
											const { button } = styles
											return (
												<View key={item.id} style={styles.containerButton}>
													<TouchableOpacity
														style={{backgroundColor: item.corBotao, ...button}}
														onPress={item.onPress} >
														<Text 
															style={{ 
																...styles.texto, 
																color: Colors.white }}> 
															{item.texto} 
														</Text>
													</TouchableOpacity>
												</View>
											)
										})

										return (
											<View 
												key={linha.linha}
												style={{
													flex: 1,
													flexDirection: 'row',	
													justifyContent: 'space-between',
												}}>
												{linhaParaMostrar}
											</View>
										)
									})
								}
							</View>
						</View>

					</>
			}
		</View>
	);
}

const mapDispatchToProps = (dispatch) => {
	return {
		alterarUsuarioNoAsyncStorage: (usuario) => dispatch(alterarUsuarioNoAsyncStorage(usuario)),
		pegarUsuarioNoAsyncStorage: (usuario) => dispatch(pegarUsuarioNoAsyncStorage(usuario)),
	}
}

export default connect(null, mapDispatchToProps)(LoginScreen)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	viewLogo: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 50,
	},
	logo: {
		height: 80,
		resizeMode: 'contain',
	},
	conteudo: {
		flex: 3,
	},
	textoMatricula: {
		fontSize: 17,
		color: 'rgba(96,100,109, 1)',
		lineHeight: 24,
		textAlign: 'center',
	},
	texto: {
		fontSize: 24,
		color: 'rgba(96,100,109, 1)',
		lineHeight: 24,
		textAlign: 'center',
	},
	containerButton: {
		paddingVertical: 10,
		marginTop: 10,
	},
	button: {
		borderRadius: 60 / 2,
		height: 60,
		width: 60,
		justifyContent: 'center',
		shadowOffset: { width: 5, height: 5, },
		shadowColor: 'rgba(0,0,0,0.3)',
		shadowOpacity: 1.0,
	},
});
