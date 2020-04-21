import {
	recuperarUsuario,
	submeterUsuario,
} from '../helpers/api'
import{
	pegarDataEHoraAtual,
} from '../helpers/functions'

export const PEGAR_USUARIO = 'PEGAR_USUARIO'
export const ALTERAR_USUARIO = 'ALTERAR_USUARIO'

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
