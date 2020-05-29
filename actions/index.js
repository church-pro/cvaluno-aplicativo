import {
	recuperarUsuario,
	submeterUsuario,
	recuperarToken,
	submeterToken,
	recuperarItems,
	submeterItems,
} from '../helpers/api'
import{
	pegarDataEHoraAtual,
} from '../helpers/functions'

export const PEGAR_USUARIO = 'PEGAR_USUARIO'
export const ALTERAR_USUARIO = 'ALTERAR_USUARIO'
export const PEGAR_TOKEN = 'PEGAR_TOKEN'
export const ALTERAR_TOKEN = 'ALTERAR_TOKEN'
export const PEGAR_ITEMS = 'PEGAR_ITEMS'
export const ALTERAR_ITEMS = 'ALTERAR_ITEMS'

export function pegarUsuario(usuario){ 
	return {
		type: PEGAR_USUARIO,
		usuario,
	}
}

export function alterarUsuario(usuario){ 
	return {
		type: ALTERAR_USUARIO,
		usuario,
	}
}

export const pegarUsuarioNoAsyncStorage = () => dispatch => {
	return recuperarUsuario()
		.then(usuarioNaAsyncStorage => {
			dispatch(pegarUsuario(usuarioNaAsyncStorage.usuario))
			return usuarioNaAsyncStorage.usuario 
		})
}

export const alterarUsuarioNoAsyncStorage = (usuario) => dispatch => {
	return submeterUsuario(usuario)
		.then(usuario => { 
			dispatch(alterarUsuario(usuario))
			return true
		})
}

export function pegarToken(token){ 
	return {
		type: PEGAR_TOKEN,
		token,
	}
}

export function alterarToken(token){ 
	return {
		type: ALTERAR_TOKEN,
		token,
	}
}

export const alterarTokenNoAsyncStorage = (token) => dispatch => {
	return submeterToken(token)
		.then(token => { 
			dispatch(alterarTokenNoAsyncStorage(token))
			return true
		})
}

export const pegarTokenNoAsyncStorage = () => dispatch => {
	return recuperarToken()
		.then(token => {
			dispatch(pegarToken(token))
			return token 
		})
}

export function pegarItems(items){ 
	return {
		type: PEGAR_ITEMS,
		items,
	}
}

export function alterarItems(items){ 
	return {
		type: ALTERAR_ITEMS,
		items,
	}
}

export const pegarItemsNoAsyncStorage = () => dispatch => {
	return recuperarItems()
		.then(items => {
			dispatch(pegarItems(items))
			return items 
		})
}

export const alterarItemsNoAsyncStorage = (items) => dispatch => {
	return submeterItems(items)
		.then(items => { 
			dispatch(alterarItems(items))
			return true
		})
}
