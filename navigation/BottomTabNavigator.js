import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ReposicoesScreen from '../screens/ReposicoesScreen';
import ReposicaoScreen from '../screens/ReposicaoScreen';
import PerguntasScreen from '../screens/PerguntasScreen';
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
					header: () => null,
				}} 
			/>
			<Stack.Screen 
				name="Reposicao" 
				component={ReposicaoScreen} 
				options={{
					header: () => null,
				}} 
			/>
			<Stack.Screen 
				name="Perguntas" 
				component={PerguntasScreen} 
				options={{
					header: () => null,
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
