import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Alert, TextInput, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import NetInfo from "@react-native-community/netinfo"
import {
	alterarUsuarioNoAsyncStorage,
	pegarUsuarioNoAsyncStorage,
} from '../actions'
import {
	sincronizarNaAPI,
} from '../helpers/api'
import { connect } from 'react-redux'
import Loading from '../components/Loading'

function LoginScreen(props) {
	const [matricula, setMatricula] = React.useState('41006')
	const [carregando, setCarregando] = React.useState(false)
	const [encaminhamento, setEncaminhamento] = React.useState('Home')

	React.useEffect(() => {
		async function loadResourcesAndDataAsync() {
			try {
				setCarregando(true)
				const usuario = await props.pegarUsuarioNoAsyncStorage()
				if (usuario.matricula && usuario.matricula !== '') {
					props.navigation.navigate(encaminhamento)
				}
			} catch (e) {
				console.warn(e);
			} finally {
				setCarregando(false)
			}
		}
		loadResourcesAndDataAsync();
	}, [])

	const submitHandler = () => {
		let showErrorMessage = false	
		if(matricula === ''){
			showErrorMessage = true
		}
		if(showErrorMessage){
			Alert.alert('Preencha a matrícula')
		}else{
			NetInfo
				.getConnectionInfo()
				.then(state => {
					setCarregando(true)
					const dados = {
						matricula,
					}
					sincronizarNaAPI(dados)
						.then(retorno => {
							if (retorno.ok) {
								props.alterarUsuarioNoAsyncStorage(retorno.usuario)
									.then(() => {
										setCarregando(false)
										props.navigation.navigate(encaminhamento)
									})
							} else {
								setCarregando(false)
								Alert.alert('Aviso', 'Usuário/Senha não conferem!')
							}
						})

				})
		}
	}

	return (
		<View style={styles.container}>
			{
				carregando &&
					<Loading title='Entrando' />
			}
			{ 
				!carregando &&
					<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

						<View style={styles.welcomeContainer}>
							<Image
								source={require('../assets/images/robot-prod.png')}
								style={styles.welcomeImage}
							/>
						</View>

						<View style={styles.getStartedContainer}>
							<Text style={styles.getStartedText}>Espaço do Aluno</Text>
							<TextInput
								value={matricula}
								onChangeText={value => setMatricula(value)}
							/>
							<TouchableOpacity
								onPress={() => submitHandler()}>
								<Text>Entrar</Text>
							</TouchableOpacity>
						</View>

					</ScrollView>
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
		backgroundColor: '#fff',
	},
	contentContainer: {
		paddingTop: 30,
	},
	welcomeContainer: {
		alignItems: 'center',
		marginTop: 10,
		marginBottom: 20,
	},
	welcomeImage: {
		width: 100,
		height: 80,
		resizeMode: 'contain',
		marginTop: 3,
		marginLeft: -10,
	},
	getStartedContainer: {
		alignItems: 'center',
		marginHorizontal: 50,
	},
	getStartedText: {
		fontSize: 17,
		color: 'rgba(96,100,109, 1)',
		lineHeight: 24,
		textAlign: 'center',
	},
});
