import React from 'react'


const Cell = (props) => {
		let type = props.value.type
		return(
				<td 
					className={`cell ${type}`}
				>
				</td>
			)
	}


export default Cell