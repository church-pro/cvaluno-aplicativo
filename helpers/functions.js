import {
	Notifications,
} from 'expo'
import { Platform, } from 'react-native';
export function criarNotificacaoLocal(notificacao) {
	return {
		title: notificacao.titulo,
		body: notificacao.corpo,
		ios: {
			sound: true,
		},
		android: {
			sound: true,
			priority: 'high',
			sticky: false,
			vibrate: true,
			icon: './assets/images/icon_notificacao.png',
			color: '#000000',
		}
	}
}

export const setarNotificacaoLocal = async (notificacao) => {
	return await Notifications.scheduleLocalNotificationAsync(
		criarNotificacaoLocal(notificacao),
		{
			time: notificacao.tempo,
		}
	)
}

export const cancelarUmaNotificacao = async (notificacao_id) => {
	return await Notifications.dismissNotificationAsync(notificacao_id)
}

export const sendNotificationImmediately = async () => {
	if (Platform !== 'ios') {
		let notificationId = await Notifications.presentLocalNotificationAsync({
			title: 'This is crazy',
			body: 'Your mind will blow after reading this',
		});
		console.log(notificationId); // can be saved in AsyncStorage or send to server
	}
}

export const scheduleNotification = async () => {
	let notificationId = Notifications.scheduleLocalNotificationAsync(
		{
			title: "teste 5 segundos",
			body: 'testando huahduhsaudhsa uashda',
		},
		{
			time: new Date().getTime() + 5000,
		},
	).then(resultado => console.log('notificacao', resultado))
}

export const cancelarTodasNotificacoes = () => {
	Notifications.cancelAllScheduledNotificationsAsync()
		.then(resultado => console.log('cancelarTodasNotificacoes: ', resultado))
}

export function pegarDataEHoraAtual(acrescimo = null) {
	let dados = []
	let dataAtual = new Date()
	if(acrescimo !== null){
		dataAtual.setDate(dataAtual.getDate() + acrescimo)
	}
	const diaParaDataDeCriacao = dataAtual.getDate().toString().padStart(2, '0')
	let mesParaDataDeCriacao = dataAtual.getMonth() + 1
	mesParaDataDeCriacao = mesParaDataDeCriacao.toString().padStart(2, '0')
	const anoParaDataDeCriacao = dataAtual.getFullYear()
	const dataDeCriacao = diaParaDataDeCriacao + '/' + mesParaDataDeCriacao + '/' + anoParaDataDeCriacao
	const horaDeCriacao = dataAtual.getHours().toString().padStart(2, '0')
		+ ':' + dataAtual.getMinutes().toString().padStart(2, '0')
		+ ':' + dataAtual.getSeconds().toString().padStart(2, '0')

	dados.push(dataDeCriacao)
	dados.push(horaDeCriacao)

	return dados
}
