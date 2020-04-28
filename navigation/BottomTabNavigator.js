import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ReposicoesScreen from '../screens/ReposicoesScreen';
import VideoAulaScreen from '../screens/VideoAulaScreen';
import PerguntasScreen from '../screens/PerguntasScreen';
import AnuncioScreen from '../screens/AnuncioScreen';
import LinksZoomScreen from '../screens/LinksZoomScreen';
import { createStackNavigator } from '@react-navigation/stack';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Reposicoes';

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
					headerLeft: () => null,
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
		</Stack.Navigator>
	)
}

export default function BottomTabNavigator({ navigation, route }) {
	return (
		<BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
			<BottomTab.Screen
				name="Reposicoes"
				component={StackReposicoes}
				options={{
					title: 'Reposições',
					tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-videocam" />,
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
				name="Home"
				component={HomeScreen}
				options={{
					title: 'Carteirinha',
					tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-contact" />,
				}}
			/>
		</BottomTab.Navigator>
	);
}
