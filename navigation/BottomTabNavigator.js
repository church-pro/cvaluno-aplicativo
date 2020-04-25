import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ReposicoesScreen from '../screens/ReposicoesScreen';
import ReposicaoScreen from '../screens/ReposicaoScreen';
import PerguntasScreen from '../screens/PerguntasScreen';
import AnuncioScreen from '../screens/AnuncioScreen';
import { createStackNavigator } from '@react-navigation/stack';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Reposicoes';

const Stack = createStackNavigator();
const StackReposicoes = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen 
				name="Reposicoes" 
				component={ReposicoesScreen} 
				options={{
					headerTitle: 'CVAluno',
					headerLeft: () => null,
				}} 
			/>
			<Stack.Screen 
				name="Reposicao" 
				component={ReposicaoScreen} 
				options={{
					headerTitle: 'CVAluno',
				}} 
			/>
			<Stack.Screen 
				name="Anuncio" 
				component={AnuncioScreen} 
				options={{
					headerTitle: 'CVAluno',
				}} 
			/>
			<Stack.Screen 
				name="Perguntas" 
				component={PerguntasScreen} 
				options={{
					headerTitle: 'CVAluno',
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
				name="Home"
				component={HomeScreen}
				options={{
					title: 'Perfil',
					tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-contact" />,
				}}
			/>
		</BottomTab.Navigator>
	);
}
