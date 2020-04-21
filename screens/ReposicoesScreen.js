import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { WebView, ActivityIndicator, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

function ReposicoesScreen(props) {
	const [carregando, setCarregando] = React.useState(false)
	const [reposicaoSelecionada, setReposicaoSelecionada] = React.useState(null)
	const [thumbUrl, setThumbUrl] = React.useState(null)
	const [videoUrl, setVideoUrl] = React.useState(null)
	const [video, setVideo] = React.useState(null)

	const {
		usuario,
	} = props

	const selecionarReposicao = async (aula) => {
		setCarregando(true)
		setReposicaoSelecionada(aula)
		const VIMEO_ID = aula.idVimeo;
		const retorno = await fetch(`https://player.vimeo.com/video/${VIMEO_ID}/config`)
		const json = await retorno.json()
		setThumbUrl(json.video.thumbs['640'])
		setVideoUrl(json.request.files.hls.cdns[res.request.files.hls.default_cdn].url)
		setVideo(json.video)
		setCarregando(false)
	}

	return (
		<View style={styles.container}>

			{
				carregando &&
					<Loading title={'Processando'} />
			}

			{
				!carregando &&
					reposicaoSelecionada === null &&
					<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
						<View style={styles.getStartedContainer}>
							{
								usuario &&
									<>
										<Text style={styles.getStartedText}>Reposicoes</Text>
										{
											usuario.faltas.length > 0 &&
												usuario.faltas.map(aula => {
													return <View key={`idAula${aula.id}`}>
														<Text>Aula {aula.posicao}</Text>
														<TouchableOpacity
															onPress={() => selecionarReposicao(aula)}
														>
															<Text>Selecionar</Text>
														</TouchableOpacity>
													</View>
												})
										}
									</>
							}
						</View>
					</ScrollView>
			}

			{
				!carregando &&
					reposicaoSelecionada !== null &&
					<View>

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

export default connect(mapStateToProps, null)(ReposicoesScreen)

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
