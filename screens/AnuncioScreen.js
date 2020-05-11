import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import { AdMobBanner, } from 'expo-ads-admob';

export default function AnuncioScreen(props) {
	const [mostrarBotoes, setMostrarBotoes] = React.useState(false)
	const { tipo, perguntas, posicao, aula_id } = props.route.params

	React.useEffect(() => {
		setTimeout(() => {
			setMostrarBotoes(true)
		}, 3000);
	}, [])

	return (
		<View style={styles.container}>
			<Text style={{ color: Colors.primary, fontWeight: 'bold', textAlign: 'center', fontSize: 22, marginVertical: 16 }}>
				Anúncio
			</Text>
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10, }}>
				<AdMobBanner
					bannerSize="mediumRectangle"
					adUnitID="ca-app-pub-6689947841260748/8985706604"
					onDidFailToReceiveAdWithError={(e) => console.log('error ', e)}>
				</AdMobBanner>
			</View>
			{
				mostrarBotoes &&
					<TouchableOpacity
						onPress={() => props.navigation.navigate('Perguntas', {tipo, perguntas, posicao, aula_id})}
						style={styles.botao}>
						<Text style={styles.textoBotao}>
							Prosseguir
						</Text>
					</TouchableOpacity>
			}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
		marginTop: 30,
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
		marginHorizontal: 8,
		borderRadius: 6,
		justifyContent: 'center',
		alignItems: 'center',
	},
	textoBotao: {
		fontSize: 24,
		color: Colors.white,
	},
	textoMensagem: {
		fontSize: 18,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 10,
	}
});
