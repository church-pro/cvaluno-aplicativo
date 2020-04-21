import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { ActivityIndicator, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
import NetInfo from "@react-native-community/netinfo"

function HomeScreen(props) {
	const [carregando, setCarregando] = React.useState(false)
	const [sincronizando, setSincronizando] = React.useState(false)

	React.useEffect(() => {
		async function loadResourcesAndDataAsync() {
			try {
				setSincronizando(true)
				const estado = NetInfo.getConnectionInfo()
				if(estado){
					const dados = {
						matricula: props.usuario.matricula,
					}
					const retorno = await sincronizarNaAPI(dados)
					if (retorno.ok) {
						await props.alterarUsuarioNoAsyncStorage(retorno.usuario)
					}
				}
			} catch (e) {
				console.warn(e);
			} finally {
				setSincronizando(false)
			}
		}
		loadResourcesAndDataAsync();
	}, [])

	const {
		usuario,
	} = props

	return (
		<View style={styles.container}>

			{
				carregando &&
					<Loading title={'Entrando'} />
			}

			{
				sincronizando &&
					<View style={{
						flex: 0.1,
						flexDirection: 'row',
						alignItems: 'center',
						alignSelf: 'center',
					}}>
						<ActivityIndicator />
						<Text style={{ marginLeft: 5, color: '#000000' }}>
							Sincronizando ...
						</Text>
					</View>
			}

			{
				!carregando &&
					<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
						<View style={styles.getStartedContainer}>
							{
								usuario &&
									<>
										<Text style={styles.getStartedText}>Espaço do Aluno</Text>
										<Text style={styles.getStartedText}>Matrícula {usuario.matricula}</Text>
										<Text style={styles.getStartedText}>{usuario.nome}</Text>
										<Text style={styles.getStartedText}>Time {usuario.time}</Text>
										<Text style={styles.getStartedText}>Turma {usuario.turma}</Text>
										<Text style={styles.getStartedText}>Situação {usuario.situacao}</Text>
									</>
							}
						</View>
					</ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	contentContainer: {
		paddingTop: 30,
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
