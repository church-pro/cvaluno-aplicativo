import { combineReducers } from 'redux'
import { 
	PEGAR_USUARIO,
	ALTERAR_USUARIO,
	PEGAR_ITEMS,
	ALTERAR_ITEMS,
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

function items(state = [], action){
	switch(action.type){
		case PEGAR_ITEMS:
			return action.items
		case ALTERAR_ITEMS:
			return action.items
		default:
			return state
	}
}

export default combineReducers({
	usuario,
	items,
})
