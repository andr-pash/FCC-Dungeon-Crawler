import React from 'react'


class Cell extends React.Component{
	render(){

		let className = this.props.value

		return(
				<td 
					className={`cell ${className}`}
				>
				</td>
			)
	}
}

export default Cell