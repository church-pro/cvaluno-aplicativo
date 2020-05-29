import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { 
	ActivityIndicator, 
	Platform, 
	StyleSheet, 
	Text, 
	TouchableOpacity, 
	View, 
	FlatList, 
	SafeAreaView,
} from 'react-native';
import { connect } from 'react-redux'
import Loading from '../components/Loading';
import NetInfo from "@react-native-community/netinfo"
import Colors from '../constants/Colors';
import Postagem from '../components/Postagem';
import { sincronizarNaAPI, pegarItemsNaAPI, salvarTokenNaAPI, alterarTokenNaAPI, consultarTokenNaAPI } from '../helpers/api'
import {
	alterarUsuarioNoAsyncStorage,
	alterarItemsNoAsyncStorage,
	pegarItemsNoAsyncStorage,
	pegarTokenNoAsyncStorage
} from '../actions'
import { Ionicons } from '@expo/vector-icons';

function PostagensScreen(props) {
	const { usuario } = props
	let { items } = props
	const [carregando, setCarregando] = React.useState(false)
	const [sincronizando, setSincronizando] = React.useState(false)

	const buscarItemsDoCelular = async () => {
		setCarregando(true)
		await props.pegarItemsNoAsyncStorage()
		setCarregando(false)
	}

	const buscarItemsNaAPI = async () => {
		try{
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
				if(
					usuario 
					&& usuario.grupos 
				){
					setSincronizando(true)
					let grupos = []
					usuario.grupos.forEach(grupo => {
						if(!grupos.includes(grupo)){
							grupos.push(grupo)
						}
					})
					const dados = { grupos }
					pegarItemsNaAPI(dados)
						.then(retorno => {
							if(retorno.ok){
								setSincronizando(false)
								props.alterarItemsNoAsyncStorage(retorno.resultado.items)
							}else{
								setSincronizando(false)
							}
						})
				}else{
					buscarGrupos()
				}
			}else{
				setSincronizando(false)
			}
		} catch (e) {
			console.warn(e);
			setSincronizando(false)
		}
	}

	const buscarGrupos = async () => {
		const token = await props.pegarTokenNoAsyncStorage()
		const {matricula} = usuario
		const dados = {
			matricula,
		}
		await sincronizarNaAPI(dados)
			.then(dadosCV => {
				if (dadosCV.ok) {
					props.alterarUsuarioNoAsyncStorage(dadosCV.usuario)
						.then(() => {
							const {
								pessoa_id,
							} = usuario
							let grupos = []
							dadosCV.usuario.grupos.forEach(grupo => {
								if(!grupos.includes(grupo)){
									grupos.push(grupo)
								}
							})
							const dados = {
								token,
								grupos,
								pessoa_id,
								tipo: 2,
							}
							consultarTokenNaAPI({pessoa_id})
								.then(dadosAPI => {
									const dadosParaItens = {
										tipo: 2,
										grupos,
									}
									let funcao = salvarTokenNaAPI
									if(dadosAPI.ok){
										funcao = alterarTokenNaAPI
									}
									funcao(dados)
										.then(retorno => {
											if (retorno.ok) {
												pegarItemsNaAPI(dadosParaItens)
													.then(retorno => {
														if(retorno.ok){
															setSincronizando(false)
															props.alterarItemsNoAsyncStorage(retorno.resultado.items)
														}
													})
											}
										})
								})
						})
				}
			})
	}

	React.useEffect(() => {
		buscarItemsDoCelular()
		buscarItemsNaAPI()
	}, [])

	if(items.length > 0){
		items = items.filter(item => item.tipo === 2) // alunos
		items.sort((a, b) => (a.data_criacao < b.data_criacao) ? 1 : -1)
		items.sort((a, b) => (a.hora_criacao < b.hora_criacao) ? 1 : -1)
	}

	return (
		<View style={styles.container}>
			<View style={styles.viewTitulo}>
				<Text style={styles.viewTituloTexto}>
					Linha do Tempo
				</Text>
			</View>
			{
				(sincronizando || carregando) &&
					<View style={{
						flex: 0.1,
						flexDirection: 'row',
						alignItems: 'center',
						alignSelf: 'center',
					}}>
						<ActivityIndicator color={Colors.dark}/>
						<Text style={{ marginLeft: 5, color: Colors.dark }}>
							{sincronizando ? 'Sincronizando' : 'Carregando'} ...
						</Text>
					</View>
			}
			{ 
				items &&
					items.length > 0 &&
					<SafeAreaView style={{flex: 1}}>
						<FlatList
							refreshing={sincronizando}
							onRefresh={() => buscarItemsNaAPI()}
							data={items}
							renderItem={({ item }) => <Postagem item={item} navigation={props.navigation} />}
							keyExtractor={item => `postagem${item._id}`}
						/>
					</SafeAreaView>
			}
			{ 
				items &&
					items.length === 0 &&
					<View style={styles.viewTituloSecondary}>
						<TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => buscarItemsNaAPI()}>
							<Text style={styles.viewTituloTexto}>
								Sem Postagens
							</Text>
							<Ionicons size={24} name='md-refresh' style={{color: Colors.white, marginLeft: 10, marginTop: 5}} />
						</TouchableOpacity>
					</View>
			}
		</View>
	);
}

const mapStateToProps = ({usuario, items}) => {
	return { 
		usuario,
		items,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		alterarItemsNoAsyncStorage: (items) => dispatch(alterarItemsNoAsyncStorage(items)),
		pegarItemsNoAsyncStorage: () => dispatch(pegarItemsNoAsyncStorage()),
		alterarUsuarioNoAsyncStorage: (usuario) => dispatch(alterarUsuarioNoAsyncStorage(usuario)),
		pegarTokenNoAsyncStorage: () => dispatch(pegarTokenNoAsyncStorage()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PostagensScreen)

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
	viewTituloSecondary: {
		backgroundColor: Colors.secondary,
		alignItems: 'center',
		borderRadius: 6,
		padding: 10,
		margin: 10,
	},
	viewTituloTexto: {
		fontSize: 24,
		color: Colors.white,
	},
	textoDados: {
		fontSize: 16,
		color: Colors.dark,
		marginLeft: 15,
		marginRight: 15,
	},
	textoDadosLabel: {
		fontSize: 12,
		color: Colors.primary,
		marginLeft: 10,
		marginRight: 10,
	},
});
