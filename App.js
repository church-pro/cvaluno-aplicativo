import * as React from 'react';
import { Vibration, Text, Image, Platform, StatusBar, StyleSheet, View } from 'react-native';
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
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { pegarTokenNoAsyncStorage, alterarTokenNoAsyncStorage } from './actions'

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
import TutorialScreen from './screens/TutorialScreen';

const Stack = createStackNavigator();

export default function App(props) {
	const [isLoadingComplete, setLoadingComplete] = React.useState(false);
	const [initialNavigationState, setInitialNavigationState] = React.useState();
	const containerRef = React.useRef();
	const { getInitialState } = useLinking(containerRef);

	const registerForPushNotificationsAsync = async () => {
		if (Constants.isDevice) {
			const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
			let finalStatus = existingStatus;
			if (existingStatus !== 'granted') {
				const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
				finalStatus = status;
			}
			if (finalStatus !== 'granted') {
				alert('Failed to get push token for push notification!');
				return;
			}
			const tokenNaAsyncStorage = await store.dispatch(pegarTokenNoAsyncStorage())
			if(tokenNaAsyncStorage === ''){
				const token = await Notifications.getExpoPushTokenAsync();
				await store.dispatch(alterarTokenNoAsyncStorage(token))
			}
		} else {
			//alert('Must use physical device for Push Notifications');
		}

		if (Platform.OS === 'android') {
			Notifications.createChannelAndroidAsync('default', {
				name: 'default',
				sound: true,
				priority: 'max',
				vibrate: [0, 250, 250, 250],
			});
		}
	};

	const _handleNotification = notification => { Vibration.vibrate(); };

	// Load any resources or data that we need prior to rendering the app
	React.useEffect(() => {
		async function loadResourcesAndDataAsync() {
			try {
				SplashScreen.preventAutoHide();

				// Load our initial navigation state
				//setInitialNavigationState(await getInitialState());

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
		registerForPushNotificationsAsync()
		Notifications.addListener(_handleNotification);	
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
								name="Inicio" 
								component={StackLogin} 
								options={{
									header: () => null,
								}} 
							/>
							<Stack.Screen 
								name="Principal" 
								component={BottomTabNavigator} 
								options={{
									header: () => null,
								}} 
							/>
						</Stack.Navigator>
					</NavigationContainer>
				</Provider>
			</View>
		);
	}
}

const StackLogin = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen 
				name="Login" 
				component={LoginScreen} 
				options={{
					header: () => null,
				}} 
			/>
			<Stack.Screen 
				name="Tutorial" 
				component={TutorialScreen} 
				options={{
					header: () => null,
				}} 
			/>
		</Stack.Navigator>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});
