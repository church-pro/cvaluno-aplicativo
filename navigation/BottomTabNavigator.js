import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { Alert, TouchableOpacity, StyleSheet, View } from 'react-native';
import TabBarIcon from '../components/TabBarIcon';
import CarteirinhaScreen from '../screens/CarteirinhaScreen';
import ReposicoesScreen from '../screens/ReposicoesScreen';
import VideoAulaScreen from '../screens/VideoAulaScreen';
import PerguntasScreen from '../screens/PerguntasScreen';
import AnuncioScreen from '../screens/AnuncioScreen';
import LinksZoomScreen from '../screens/LinksZoomScreen';
import LiberarQuestionarioScreen from '../screens/LiberarQuestionarioScreen';
import PostagensScreen from '../screens/PostagensScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { alterarUsuarioNoAsyncStorage, alterarItemsNoAsyncStorage } from '../actions'
import { connect } from 'react-redux'

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Postagens';

const headerTitle = 'CVAluno'
const Stack = createStackNavigator();
const StackReposicoes = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen 
				name="Reposicoes" 
				component={ReposicoesScreen} 
				options={{
					headerTitle,
				}} 
			/>
			<Stack.Screen 
				name="Reposicao" 
				component={VideoAulaScreen} 
				options={{
					headerTitle,
				}} 
			/>
			<Stack.Screen 
				name="Anuncio" 
				component={AnuncioScreen} 
				options={{
					headerTitle,
				}} 
			/>
			<Stack.Screen 
				name="Perguntas" 
				component={PerguntasScreen} 
				options={{
					headerTitle,
				}} 
			/>
		</Stack.Navigator>
	)
}


const StackAulaAtual = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen 
				name="LinksZOOM" 
				component={LinksZoomScreen} 
				options={{
					headerTitle,
				}} 
			/>
			<Stack.Screen 
				name="LiberarQuestionario" 
				component={LiberarQuestionarioScreen} 
				options={{
					headerTitle,
				}} 
			/>
			<Stack.Screen 
				name="Anuncio" 
				component={AnuncioScreen} 
				options={{
					headerTitle,
				}} 
			/>
			<Stack.Screen 
				name="Perguntas" 
				component={PerguntasScreen} 
				options={{
					headerTitle,
				}} 
			/>
		</Stack.Navigator>
	)
}

const StackCarteirinha = (props) => {

	const perguntarSeQuerSair = () => {
		Alert.alert(
			'Sair',
			'Realmente deseja sair?',
			[
				{
					text: 'Não',
					style: 'cancel',
				},
				{ text: 'Sim', onPress: () => sair() },
			],
			{ cancelable: false },
		)

	}

	const sair = async () => {
		await props.alterarUsuarioNoAsyncStorage({})
		await props.alterarItemsNoAsyncStorage([])
		props.navigation.navigate('Login')
	}

	return (
		<Stack.Navigator>
			<Stack.Screen 
				name="Carteirinha" 
				component={CarteirinhaScreen} 
				options={{
					headerTitle,
					headerRight: () => (
						<TouchableOpacity
							hitSlop={{
								left: 20,
								right: 20,
								top: 20,
								bottom: 20,
							}}
							style={{
								marginRight: 10,
							}}
							onPress={() => perguntarSeQuerSair()} >
							<Ionicons
								name={'md-exit'}
								size={30}
								color={Colors.dark}
								style={{ marginTop: 5}} />
						</TouchableOpacity>
					),
				}} 
			/>
		</Stack.Navigator>
	)
}

const mapDispatchToProps = (dispatch) => {
	return {
		alterarUsuarioNoAsyncStorage: (usuario) => dispatch(alterarUsuarioNoAsyncStorage(usuario)),
		alterarItemsNoAsyncStorage: (usuario) => dispatch(alterarItemsNoAsyncStorage(usuario)),
	}
}

const StackCarteirinhaConnectado = connect(null, mapDispatchToProps)(StackCarteirinha)

const StackPostagens = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen 
				name="Postagens" 
				component={PostagensScreen} 
				options={{
					headerTitle,
				}} 
			/>
		</Stack.Navigator>
	)
}

export default function BottomTabNavigator({ navigation, route }) {
	return (
		<BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
			<BottomTab.Screen
				name="Postagens"
				component={StackPostagens}
				options={{
					title: 'Postagens',
					tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-home" />,
				}}
			/>
			<BottomTab.Screen
				name="Carteirinha"
				component={StackCarteirinhaConnectado}
				options={{
					title: 'Carteirinha',
					tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-contact" />,
				}}
			/>
			<BottomTab.Screen
				name="AulaAtual"
				component={StackAulaAtual}
				options={{
					title: 'Aula Atual',
					tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-link" />,
				}}
			/>
			<BottomTab.Screen
				name="Reposicoes"
				component={StackReposicoes}
				options={{
					title: 'Reposições',
					tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-videocam" />,
				}}
			/>
		</BottomTab.Navigator>
	);
}
