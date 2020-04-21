import { AsyncStorage } from 'react-native'

const versaoBanco = '0001'
const CHAVE_USUARIO = 'cvaluno:usuario' + versaoBanco

let apiMaster = 'https://www.circuitodavisaonovo.com.br'
const headers = {
	'Content-Type': 'application/json'
}

export const sincronizarNaAPI = (dados) => executar('sincronizarAluno', dados)

export const executar = (url, dados = {}, method = 'POST') =>
  fetch(
    `${apiMaster}/${url}`,
    {
      headers,
      method,
      body: method === 'POST' ? JSON.stringify(dados) : null,
    }
  )
	.then(retorno => retorno.json())
	.then(json => json)

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
