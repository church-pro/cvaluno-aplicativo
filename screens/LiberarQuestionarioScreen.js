import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Alert, TextInput, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Loading from '../components/Loading'
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { connect } from 'react-redux'

function LiberarQuestionarioScreen(props) {
	const { palavraChave } = props.route.params
	const [chave, setChave] = React.useState('')
	const { aula } = props

	const submitHandler = async () => {
		let showErrorMessage = false	
		if(chave === ''){
			showErrorMessage = true
		}
		if(showErrorMessage){
			Alert.alert('Preencha a Palavra Chave')
		}else{
			try{
				if(chave !== palavraChave){
					Alert.alert('Palavra Chave Inválida!')
					return false
				}else{
					props.navigation.navigate('Anuncio', {tipo: 'presenca', perguntas: aula.perguntas, posicao: aula.posicao, aula_id: aula.id})
				}
			} catch (e) {
				console.warn(e);
			}
		}
	}

	return (
		<View style={styles.container}>

			<View style={styles.viewTitulo}>
				<Text style={styles.viewTituloTexto}>
					Informe a Palavra Chave
				</Text>
			</View>

			<View style={styles.viewInput}>
				<TextInput
					styles={styles.input}
					autoCapitalize="none"
					placeholderTextColor="#000000"
					placeholder={'Palavra Chave'}
					selectionColor="#fff"
					keyboardType="text"
					value={chave}
					onChangeText={texto => setChave(texto)}
					returnKeyType={'go'}
					onSubmitEditing={() => submitHandler()}
				/>
			</View>

			<TouchableOpacity
				onPress={() => submitHandler()}
				style={styles.botao}>
				<Text style={styles.textoBotao}>
					Validar
				</Text>
			</TouchableOpacity>
	
		</View>
	);
}

const mapStateToProps = ({usuario}) => {
	return {
		aula: usuario.aula
	}
}

export default connect(mapStateToProps, null)(LiberarQuestionarioScreen)

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
	viewTituloTexto: {
		fontSize: 24,
		color: Colors.white,
	},
    viewInput: {
		borderRadius: 6,
		padding: 10,
		margin: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        height: 45,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6
    },
    input: {
        fontSize: 16,
        color: Colors.white,
        fontWeight: '400',
        height: 45,
        paddingHorizontal: 8
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
});
