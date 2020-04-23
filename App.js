import * as React from 'react';
import { Text, Image, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import Constants from 'expo-constants'
import Colors from './constants/Colors';

const logger = store => next => action => {
	console.group(action.type ? action.type : 'Redux-Thunk')
	console.info('DESPACHANDO ACAO: ', action)
	let resultado = next(action)
	console.log('PROXIMO STORE: ', store.getState())
	console.groupEnd(action.type ? action.type : 'Redux-Thunk')
	return resultado
}
const store = createStore(rootReducer, applyMiddleware(thunk))

function BarraDeEstado({ backgroundColor, ...props }) {
	return (
		<View style={{ backgroundColor, height: Constants.statusBarHeight }}>
			<StatusBar translucent backgroundColor={backgroundColor} {...props} />
		</View>
	)
}

import BottomTabNavigator from './navigation/BottomTabNavigator';
import useLinking from './navigation/useLinking';
import LoginScreen from './screens/LoginScreen';

const Stack = createStackNavigator();

export default function App(props) {
	const [isLoadingComplete, setLoadingComplete] = React.useState(false);
	const [initialNavigationState, setInitialNavigationState] = React.useState();
	const containerRef = React.useRef();
	const { getInitialState } = useLinking(containerRef);

	// Load any resources or data that we need prior to rendering the app
	React.useEffect(() => {
		async function loadResourcesAndDataAsync() {
			try {
				SplashScreen.preventAutoHide();

				// Load our initial navigation state
				setInitialNavigationState(await getInitialState());

				// Load fonts
				await Font.loadAsync({
					...Ionicons.font,
					'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
				});
			} catch (e) {
				// We might want to provide this error information to an error reporting service
				console.warn(e);
			} finally {
				setLoadingComplete(true);
				SplashScreen.hide();
			}
		}

		loadResourcesAndDataAsync();
	}, []);

	if (!isLoadingComplete && !props.skipLoadingScreen) {
		return null;
	} else {
		return (
			<View style={styles.container}>
				<Provider store={store}>
					{Platform.OS === 'ios' && <StatusBar barStyle="default" />}
					<NavigationContainer ref={containerRef} initialState={initialNavigationState}>
						<Stack.Navigator>
							<Stack.Screen 
								name="Login" 
								component={LoginScreen} 
								options={{
									header: () => null,
								}} 
							/>
							<Stack.Screen 
								name="Home" 
								component={BottomTabNavigator} 
								options={{
									title: 'CVAluno',
									headerLeft: () => null,
								}} 
							/>
						</Stack.Navigator>
					</NavigationContainer>
				</Provider>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});
