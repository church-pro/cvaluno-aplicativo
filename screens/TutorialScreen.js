import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Loading from '../components/Loading'
import Colors from '../constants/Colors';

export default function TutorialScreen(props) {
	const { textoMensagem } = styles
	return (
		<View style={styles.container}>
			<View style={styles.viewTitulo}>
				<Text style={styles.viewTituloTexto}>
					Espaço do Aluno	
				</Text>
			</View>
			<View style={{flex:1, margin: 20, alignItems: 'center'}}>
				<Text style={textoMensagem}>
					Seja muito bem vindo ao Espaço do Aluno.                                                                                                                     
				</Text>
				<Text style={textoMensagem}>
					Esse espaço é destinado a reposição de aulas. 
				</Text>
				<Text style={textoMensagem}>
					É necessário que você assista a aula até o final, em seguida responda ao questionário.
				</Text>
				<Text style={textoMensagem}>
					Cada aula tem um questionário específico e é necessário que você acerte pelo menos 70% das questões para ser efetivada a sua reposição.
				</Text>
				<Text style={textoMensagem}>
					Uma vez respondido o questionário, a sua reposição será efetivada e o visto pedagógico daquela aula também.
				</Text>
				<Text style={textoMensagem}>
					Boa reposição.
				</Text>
			</View>
			<TouchableOpacity
				onPress={() => props.navigation.navigate('Principal')}
				style={styles.botao}>
				<Text style={styles.textoBotao}>
					Acessar
				</Text>
			</TouchableOpacity>
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
