import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import NetInfo from "@react-native-community/netinfo"
import Colors from '../constants/Colors';

export default function Reposicao (props) {
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
