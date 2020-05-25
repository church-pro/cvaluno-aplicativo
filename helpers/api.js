import { AsyncStorage } from 'react-native'

const versaoBanco = '0001'
const CHAVE_USUARIO = 'cvaluno:usuario' + versaoBanco
const CHAVE_TOKEN = 'cvaluno:token' + versaoBanco

const apiCV = 'https://www.circuitodavisaonovo.com.br'
const apiMongo = 'http://192.168.150.142:19005'
const headers = {
	'Content-Type': 'application/json'
}

export const sincronizarNaAPI = (dados) => executar('sincronizarAluno', dados)
export const efetivarReposicaoNaAPI = (dados) => executar('efetivarReposicaoAluno', dados)
export const pegarItemsNaAPI = (dados) => executar('item/pegar', dados, 2)
export const salvarTokenNaAPI = (dados) => executar('token/salvar', dados, 2)
export const consultarTokenNaAPI = (dados) => executar('token/consultar', dados, 2)
export const alterarTokenNaAPI = (dados) => executar('token/alterar', dados, 2)

export const executar = (url, dados = {}, qualAPI = 1) => {
	let apiParaUsar = apiCV
	if(qualAPI === 2){
		apiParaUsar = apiMongo
	}
	return fetch(
		`${apiParaUsar}/${url}`,
		{
			headers,
			method: 'POST',
			body: JSON.stringify(dados),
		}
	)
		.then(retorno => retorno.json())
		.then(json => json)
}

export function recuperarUsuario() {
	return AsyncStorage.getItem(CHAVE_USUARIO)
		.then(JSON.parse)
		.then((dados) => {
			if (dados === null) {
				dados = { usuario: {} }
				AsyncStorage.setItem(CHAVE_USUARIO, JSON.stringify(dados))
			}
			return dados
		})
}

export function submeterUsuario(usuario) {
	return recuperarUsuario()
		.then(dados => {
			dados.usuario = usuario
			AsyncStorage.setItem(CHAVE_USUARIO, JSON.stringify(dados))
			return usuario
		})
}

export function recuperarToken() {
	return AsyncStorage.getItem(CHAVE_TOKEN)
		.then(JSON.parse)
		.then((dados) => {
			if (dados === null) {
				dados = ''
				AsyncStorage.setItem(CHAVE_TOKEN, JSON.stringify(dados))
			}
			return dados
		})
}

export function submeterToken(token) {
	return recuperarToken()
		.then(dados => {
			dados = token
			AsyncStorage.setItem(CHAVE_TOKEN, JSON.stringify(dados))
			return token
		})
}
