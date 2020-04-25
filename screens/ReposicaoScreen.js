import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { ScrollView, SafeAreaView, ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import NetInfo from "@react-native-community/netinfo"
import Colors from '../constants/Colors';
import Loading from '../components/Loading';
import { Ionicons } from '@expo/vector-icons';

export default function Reposicao (props) {
	const { falta } = props.route.params
	const [mostrarVideo, setMostrarVideo] = React.useState(true)

	const navegarParaQuestionario = () => {
		setMostrarVideo(false)
		props.navigation.navigate('Anuncio', {perguntas: falta.perguntas, posicao: falta.posicao, aula_id: falta.id})
	}
	return (
		<>
			<View
				style={styles.viewTitulo}>
				<Text style={styles.viewTituloTexto}>
					Aula {falta.posicao}
				</Text>
			</View>
			{
				mostrarVideo &&
					<WebView
						source={{ uri: `https://circuitodavisaonovo.com.br/vimeo/${falta.idVimeo}` }}
						startInLoadingState={true}
						renderLoading={() => <Loading title={"Carregando Aula"} />}
					/>
			}
			{
				!mostrarVideo &&
					<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
						<TouchableOpacity
							style={styles.botao}
							onPress={() => setMostrarVideo(true)}>
							<Text style={styles.textoBotao}>
								Mostrar Aula
							</Text>
							<Ionicons
								name={'md-eye'}
								size={24}
								color={Colors.white}
								style={{marginTop: 5, marginLeft: 5}}
							/>
						</TouchableOpacity>
					</View>
			}
			<TouchableOpacity
				style={styles.botao}
				onPress={() => navegarParaQuestionario()}>
				<Text style={styles.textoBotao}>
					Acessar questionário
				</Text>
				<Ionicons
					name={'md-send'}
					size={24}
					color={Colors.white}
					style={{marginTop: 5}}
				/>
			</TouchableOpacity>
		</>
	)
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
	botao: {
		backgroundColor: Colors.primary,
		padding: 10,
		paddingHorizontal: 35,
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
