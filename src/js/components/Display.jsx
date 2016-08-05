import React from 'react'
import DisplayCell from './DisplayCell.jsx'
import HealthBar from './HealthBar.jsx'


class Display extends React.Component{
	render(){

		let dispCells = this.props.data.map( (el, i) => {


				if(el.title === 'Health'){
					return (
						<HealthBar 
							val={el.value}
						/>
						)

				}


				return (
					<DisplayCell
						title={el.title}
						value={el.value}
						key={i}
					/>
				)
		})


		return(
			<div className="display">
				<h3>{this.props.title}</h3>
				{dispCells}
			</div>
			)
	}
}

export default Display