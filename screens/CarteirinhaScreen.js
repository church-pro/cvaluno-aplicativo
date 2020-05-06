import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { ActivityIndicator, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
	alterarUsuarioNoAsyncStorage,
} from '../actions'
import {
	sincronizarNaAPI,
} from '../helpers/api'
import { connect } from 'react-redux'
import Loading from '../components/Loading';
import NetInfo from "@react-native-community/netinfo"
import QRCode from 'react-native-qrcode-generator'
import Colors from '../constants/Colors';

function CarteirinhaScreen(props) {
	const { usuario, } = props

	return (
		<View style={styles.container}>
			<View style={styles.viewTitulo}>
				<Text style={styles.viewTituloTexto}>
					Carteirinha Digital
				</Text>
			</View>
			<View style={{alignItems: 'center'}}>
				<View style={{padding: 15, backgroundColor: Colors.white}}>
					<QRCode
						value={usuario.matricula}
						size={150}
						bgColor='black'
						fgColor='white'/>
				</View>
				{
					usuario &&
						usuario.nome &&
						<View style={{alignItems: 'center', margin: 5}}>
							<Text style={{fontSize: usuario.nome.length > 30 ? 18 : 26, color: Colors.white}}>
								{usuario.nome}
							</Text>
						</View>
				}
				<View style={{
					width: 300, 
					height: 155, 
					marginTop: 5, 
					backgroundColor: Colors.white,
					borderRadius: 6
				}}>
					<View style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
					}}>
						<View style={{
							flexDirection: 'column',
						}}>
							<Text style={styles.textoDadosLabel}> Registro </Text>
							<Text style={styles.textoDados}> {usuario.matricula} </Text>
						</View>
						<View style={{
							flexDirection: 'column',
						}}>
							<Text style={styles.textoDadosLabel}> Situação </Text>
							<Text style={styles.textoDados}> {usuario.situacao} </Text>
						</View>
					</View>

					<Text style={styles.textoDadosLabel}> Turma </Text>
					<Text style={styles.textoDados}> {usuario.turma} </Text>
					<Text style={styles.textoDadosLabel}>Time</Text>
					<Text style={styles.textoDados}> {usuario.time} </Text>
	
				</View>
			</View>
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

export default connect(mapStateToProps, mapDispatchToProps)(CarteirinhaScreen)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.primary,
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
		marginTop: 10,
	},
});
