import { combineReducers } from 'redux'
import { 
	PEGAR_USUARIO,
	ALTERAR_USUARIO,
} from '../actions'

function usuario(state = {}, action){
	switch(action.type){
		case PEGAR_USUARIO:
			return {
				...action.usuario
			}
		case ALTERAR_USUARIO:
			return {
				...action.usuario
			}
		default:
			return state
	}
}

export default combineReducers({
	usuario,
})
