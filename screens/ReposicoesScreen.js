import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { SafeAreaView, FlatList, ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MonoText } from '../components/StyledText';
import {
	alterarUsuarioNoAsyncStorage,
} from '../actions'
import {
	sincronizarNaAPI,
} from '../helpers/api'
import { connect } from 'react-redux'
import Loading from '../components/Loading';
import { WebView } from 'react-native-webview';
import NetInfo from "@react-native-community/netinfo"
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

function ReposicoesScreen(props) {
	const [carregando, setCarregando] = React.useState(false)
	const [idVimeo, setIdVimeo] = React.useState(null)

	const {
		usuario,
	} = props

	const selecionarReposicao = async (idVimeo) => {
		setIdVimeo(idVimeo)
	}

	const [sincronizando, setSincronizando] = React.useState(false)

	React.useEffect(() => {
		async function loadResourcesAndDataAsync() {
			try {
				setSincronizando(true)
				if(usuario === null || usuario === undefined){
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
					idVimeo === null &&
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
								<SafeAreaView style={{flex: 1}}>
									<FlatList
										data={usuario.faltas}
										renderItem={({ item }) => <Item posicao={item.posicao} onPress={() => setIdVimeo(item.idVimeo)} />}
										keyExtractor={item => `aula${item.id}`}
									/>
								</SafeAreaView>
						}
					</View>
			}

			{
				!carregando &&
					idVimeo !== null &&
					<Vimeo idVimeo={idVimeo} />
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

function Item({ posicao, onPress }) {
	return (
		<View style={styles.item}>
			<Text style={styles.itemTitle}>Aula {posicao}</Text>
			<TouchableOpacity
				onPress={onPress}>
				<Ionicons
					name={'md-send'}
					size={24}
					color={Colors.white}
					style={{ marginBottom: -3}} />
			</TouchableOpacity>
		</View>
	);
}

const Vimeo = (props) => {
	const [carregando, setCarregando] = React.useState(true)
	return (
		<View style={styles.container}>
			{
				carregando &&
					<View style={{
						flex: 0.1,
						flexDirection: 'row',
						alignItems: 'center',
						alignSelf: 'center',
					}}>
						<ActivityIndicator 
							color="#2D84C3"
						/>
						<Text style={{ marginLeft: 5, color: '#000000' }}>
							Carregando Aula ...
						</Text>
					</View>
			}
			<WebView
				originWhitelist={['*']}
				source={{ uri: `https://circuitodavisaonovo.com.br/vimeo/${props.idVimeo}` }}
				style={{ 
					marginTop: 20,
					flex: 1,
				}}
				onLoadEnd={syntheticEvent => {
					const { nativeEvent } = syntheticEvent
					setCarregando(nativeEvent.loading);
				}}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
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
