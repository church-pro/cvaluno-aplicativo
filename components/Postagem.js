import * as React from 'react';
import { 
	Text, 
	View, 
} from 'react-native';

export default function Postagem(props){
	const {
		item
	} = props
	return 	<View style={{
		marginTop: 5, 
		backgroundColor: 'powderblue',
		padding: 10,
		marginRight: 10,
		marginLeft: 10,
		borderRadius: 6,
	}}>
		<Text style={{fontSize: 10}}>{item.entidade} - {item.nome}</Text>
		{
			item.data_criacao &&
				<Text style={{fontSize: 10}}>{item.data_criacao} - {item.hora_criacao}</Text>
		}
		<Text style={{fontSize: 20}}>{item.mensagem}</Text>
	</View>
}
