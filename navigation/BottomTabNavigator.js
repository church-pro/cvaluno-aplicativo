import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ReposicoesScreen from '../screens/ReposicoesScreen';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
	return (
		<BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
			<BottomTab.Screen
				name="Home"
				component={HomeScreen}
				options={{
					title: 'Perfil',
					tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-contact" />,
				}}
			/>
			<BottomTab.Screen
				name="Reposicoes"
				component={ReposicoesScreen}
				options={{
					title: 'Reposições',
					tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="logo-vimeo" />,
				}}
			/>
		</BottomTab.Navigator>
	);
}
