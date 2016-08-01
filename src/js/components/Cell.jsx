import React from 'react'


const Cell = (props) => {

		return(
				<td 
					className={`cell ${props.value}`}
				>
				</td>
			)
	}


export default Cell