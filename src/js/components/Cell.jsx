import React from 'react'


const Cell = (props) => {
		let type = props.value.type
		if(type === 'player'){
			type +=  ' ' + props.value.direction 
		}

		let darken = props.dark
		return(
				<td 
					className={`cell ${type} ${darken}`}
				>
				</td>
			)
	}


export default Cell