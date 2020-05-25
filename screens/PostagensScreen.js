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
import { pegarItemsNaAPI, } from '../helpers/api'

function PostagensScreen(props) {
	const { usuario } = props
	const [items, setItems] = React.useState([])
	const [sincronizando, setSincronizando] = React.useState(false)
	const [mostrarSemInternet, setMostrarSemInternet] = React.useState(false)

	const loadResourcesAndDataAsync = async () => {
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
					const dados = {
						tipo: 2,
						grupos,
					}
					pegarItemsNaAPI(dados)
						.then(retorno => {
							if(retorno.ok){
								setSincronizando(false)
								setItems(retorno.resultado.items)
							}
						})
				}
			}else{
				setSincronizando(false)
				setMostrarSemInternet(true)
			}
		} catch (e) {
			console.warn(e);
			setSincronizando(false)
		}
	}

	React.useEffect(() => {
		if(
			usuario.items
			&& usuario.items.length > 0 
		){
			setItems(usuario.items)
		}

		loadResourcesAndDataAsync()
	}, [])

	if(items.length > 0){
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
				mostrarSemInternet &&
					<View style={styles.viewTitulo}>
						<Text style={styles.viewTituloTexto}>
							Verifique sua Internet e tente novamente							
						</Text>
					</View>
			}
			{ 
				items &&
					items.length > 0 &&
					<SafeAreaView style={{flex: 1}}>
						<FlatList
							refreshing={sincronizando}
							onRefresh={() => loadResourcesAndDataAsync()}
							data={items}
							renderItem={({ item }) => <Postagem item={item}  />}
							keyExtractor={item => `postagem${item._id}`}
						/>
					</SafeAreaView>
			}
			{ 
				items &&
					items.length === 0 &&
					<View style={styles.viewTituloSecondary}>
						<Text style={styles.viewTituloTexto}>
							Sem Postagens
						</Text>
					</View>
			}
		</View>
	);
}

const mapStateToProps = ({usuario}) => {
	return { usuario }
}

export default connect(mapStateToProps, null)(PostagensScreen)

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
