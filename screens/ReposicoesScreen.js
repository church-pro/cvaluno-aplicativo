import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { SafeAreaView, FlatList, ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MonoText } from '../components/StyledText';
import { alterarUsuarioNoAsyncStorage, } from '../actions'
import { sincronizarNaAPI, } from '../helpers/api'
import { connect } from 'react-redux'
import Loading from '../components/Loading';
import { WebView } from 'react-native-webview';
import NetInfo from "@react-native-community/netinfo"
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

function ReposicoesScreen(props) {
	const [carregando, setCarregando] = React.useState(false)

	const {
		usuario,
	} = props

	const [sincronizando, setSincronizando] = React.useState(false)

	React.useEffect(() => {
		async function loadResourcesAndDataAsync() {
			try {
				setSincronizando(true)
				if(
					usuario === null || 
					usuario === undefined ||
					usuario.matricula === null || 
					usuario.matricula === undefined
				){
					props.navigation.navigate('Login')
				}
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
					if(usuario && usuario.matricula){
						const dados = {
							matricula: usuario.matricula,
						}
						const retorno = await sincronizarNaAPI(dados)
						if (retorno.ok) {
							await props.alterarUsuarioNoAsyncStorage(retorno.usuario)
						}
					}
				}
			} catch (e) {
				console.warn(e);
			} finally {
				setSincronizando(false)
			}
		}
		loadResourcesAndDataAsync()
	}, [])

	return (
		<View style={styles.container}>

			{
				carregando &&
					<Loading title={'Processando'} />
			}

			{
				sincronizando &&
					<View style={{
						flex: 0.1,
						flexDirection: 'row',
						alignItems: 'center',
						alignSelf: 'center',
						paddingVertical: 5,
					}}>
						<ActivityIndicator 
							color="#2D84C3"
						/>
						<Text style={{ marginLeft: 5, color: '#000000' }}>
							Sincronizando ...
						</Text>
					</View>
			}

			{
				!carregando &&
					usuario &&
					<View style={{flex: 1}}>
						<View
							style={styles.viewTitulo}>
							<Text style={styles.viewTituloTexto}>
								Reposições
							</Text>
						</View>

						{
							usuario &&
								usuario.faltas &&
								usuario.faltas.length > 0 &&
								<SafeAreaView style={{flex: 1}}>
									<FlatList
										data={usuario.faltas}
										renderItem={({ item }) => <Item item={item} onPress={() => props.navigation.navigate('Reposicao', {falta: item})} />}
										keyExtractor={item => `aula${item.id}`}
									/>
								</SafeAreaView>
						}

						{
							usuario &&
								usuario.faltas &&
								usuario.faltas.length === 0 &&
								<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
									<Text style={{fontSize:20, padding: 5, margin: 20}}>
										Sem aulas para serem Repostas!
									</Text>
								</View>
						}

					</View>
			}

		</View>
	);
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

export default connect(mapStateToProps, mapDispatchToProps)(ReposicoesScreen)

function Item({ item, onPress }) {
	return (
		<TouchableOpacity
			style={styles.item}
			onPress={onPress}>
			<Text style={styles.itemTitle}>Aula {item.posicao}</Text>
			<Ionicons
				name={'md-send'}
				size={24}
				color={Colors.white}
				style={{ marginTop: 5}} />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	conteudo: {
		padding: 10,
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
	item: {
		backgroundColor: 'skyblue',
		padding: 10,
		marginVertical: 8,
		marginHorizontal: 16,
		borderRadius: 6,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	itemTitle: {
		fontSize: 24,
		color: Colors.white,
	},
});
