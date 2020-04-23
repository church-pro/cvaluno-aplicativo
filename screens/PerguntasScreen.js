import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Alert, ScrollView, SafeAreaView, ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import NetInfo from "@react-native-community/netinfo"
import Colors from '../constants/Colors';
import Loading from '../components/Loading';
import { Ionicons } from '@expo/vector-icons';
import { efetivarReposicaoNaAPI, } from '../helpers/api'
import { connect } from 'react-redux'
import { alterarUsuarioNoAsyncStorage, } from '../actions'

function PerguntasScreen (props) {
	const { perguntas, posicao, aula_id } = props.route.params
	const [listaDeRespostas, setListaDeRespostas] = React.useState({})
	const [carregando, setCarregando] = React.useState(false)
	let { usuario } = props

	const submitHandler = async () => {
		try{
			setCarregando(true)
			let contagemDeRespostaCertas = 0
			for (let [key, value] of Object.entries(listaDeRespostas)) {
				const perguntaSelecionada = perguntas.find(item => item.id === parseInt(key))
				if(perguntaSelecionada.certa === value){
					contagemDeRespostaCertas++
				}
			}

			const porcetagemDeAcertos = contagemDeRespostaCertas/perguntas.length*100
			let aulaReposta = false
			if(parseInt(porcetagemDeAcertos) >= 70){
				aulaReposta = true
			}

			if(!aulaReposta){
				Alert.alert('Alerta', 'Você não acertou 70% do exercícios refaça o questionário')
				setCarregando(false)
			}else{
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
						aula_id,
						matricula: usuario.matricula,
					}
					const retorno = await efetivarReposicaoNaAPI(dados)
					if (retorno.ok) {
						Alert.alert('Parabéns', 'Parabéns a aula foi reposta!')
						const faltasAlteradas = usuario.faltas.filter(falta => falta.id !== aula_id)
						usuario.faltas = faltasAlteradas
						await props.alterarUsuarioNoAsyncStorage(usuario)
						props.navigation.navigate('Reposicoes')
					}
				}else{
					setCarregando(false)
					Alert.alert('Alerta', 'Verifique sua Internet e tente novamente')
				}
			}
		} catch (e) {
			console.warn(e);
		}
	}

	return (
		<View style={styles.container}>

			{
				carregando &&
					<Loading title={'Enviando Respostas'} />
			}

			{
				!carregando &&
					<>
						<View
							style={styles.viewTitulo}>
							<Text style={styles.viewTituloTexto}>
								Questionário - Aula {posicao}
							</Text>
						</View>

						<SafeAreaView style={styles.container}>
							<ScrollView>
								{
									perguntas &&
										perguntas.length > 0 &&
										perguntas.map(pergunta => {
											return (
												<View style={{marginBottom: 20}} key={pergunta.pergunta}>
													<View style={styles.viewPergunta}>
														<Text style={styles.textoPergunta}>
															{pergunta.pergunta}
														</Text>
													</View>
													<TouchableOpacity 
														onPress={() => setListaDeRespostas({...listaDeRespostas, [pergunta.id]: 1})}
														style={styles.viewResposta}>
														<Ionicons
															name={listaDeRespostas[pergunta.id] === 1 ? 'md-radio-button-on' : 'md-radio-button-off'}
															size={24}
															style={{ 
																margin: 5,
																color: listaDeRespostas[pergunta.id] === 1 ? 'skyblue' : 'gray'
															}} />
														<Text style={styles.textoResposta}>
															{pergunta.r1}
														</Text>
													</TouchableOpacity>
													<TouchableOpacity 
														onPress={() => setListaDeRespostas({...listaDeRespostas, [pergunta.id]: 2})}
														style={styles.viewResposta}>
														<Ionicons
															name={listaDeRespostas[pergunta.id] === 2 ? 'md-radio-button-on' : 'md-radio-button-off'}
															size={24}
															style={{ 
																margin: 5,
																color: listaDeRespostas[pergunta.id] === 2 ? 'skyblue' : 'gray'
															}} />
														<Text style={styles.textoResposta}>
															{pergunta.r2}
														</Text>
													</TouchableOpacity>
													<TouchableOpacity 
														onPress={() => setListaDeRespostas({...listaDeRespostas, [pergunta.id]: 3})}
														style={styles.viewResposta}>
														<Ionicons
															name={listaDeRespostas[pergunta.id] === 3 ? 'md-radio-button-on' : 'md-radio-button-off'}
															size={24}
															style={{ 
																margin: 5,
																color: listaDeRespostas[pergunta.id] === 3 ? 'skyblue' : 'gray'
															}} />
														<Text style={styles.textoResposta}>
															{pergunta.r3}
														</Text>
													</TouchableOpacity>
													<TouchableOpacity 
														onPress={() => setListaDeRespostas({...listaDeRespostas, [pergunta.id]: 4})}
														style={styles.viewResposta}>
														<Ionicons
															name={listaDeRespostas[pergunta.id] === 4 ? 'md-radio-button-on' : 'md-radio-button-off'}
															size={24}
															style={{ 
																margin: 5,
																color: listaDeRespostas[pergunta.id] === 4 ? 'skyblue' : 'gray'
															}} />
														<Text style={styles.textoResposta}>
															{pergunta.r4}
														</Text>
													</TouchableOpacity>
												</View>
											)
										})
								}

								<TouchableOpacity
									style={styles.botao}
									onPress={() => submitHandler()}>
									<Text style={styles.textoBotao}>
										Enviar Respostas
									</Text>
									<Ionicons
										name={'md-send'}
										size={24}
										color={Colors.white}
										style={{marginTop: 5}}
									/>
								</TouchableOpacity>

							</ScrollView>
						</SafeAreaView>
					</>
			}

		</View>
	)
}

const mapStateToProps = ({usuario}) => {
	return {
		usuario,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		alterarUsuarioNoAsyncStorage: (usuario) => dispatch(alterarUsuarioNoAsyncStorage(usuario)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PerguntasScreen)



const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	viewTitulo: {
		backgroundColor: Colors.primary,
		alignItems: 'center',
		borderRadius: 6,
		padding: 10,
		margin: 10,
	},
	viewTituloTexto: {
		fontSize: 24,
		color: Colors.white,
	},
	viewPergunta: {
		backgroundColor: 'skyblue',
		alignItems: 'center',
		borderRadius: 6,
		padding: 10,
		margin: 10,
	},
	viewResposta: {
		backgroundColor: 'steelblue',
		borderRadius: 6,
		flexDirection: 'row',
		marginHorizontal: 15,
		marginVertical: 1,
	},
	textoPergunta: {
		fontSize: 12,
		color: Colors.white,
	},
	textoResposta: {
		fontSize: 12,
		color: Colors.white,
		marginTop: 9,
		marginRight: 40,
		marginBottom: 9,
	},
	botao: {
		backgroundColor: Colors.primary,
		padding: 10,
		paddingHorizontal: 55,
		marginVertical: 8,
		marginHorizontal: 16,
		borderRadius: 6,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	textoBotao: {
		fontSize: 24,
		color: Colors.white,
	},
});
