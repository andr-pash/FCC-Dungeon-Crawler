import React from 'react'
import DisplayCell from './DisplayCell.jsx'


class Display extends React.Component{

	render(){
		return(
			<div className="display">
				<h3>{this.props.title}</h3>
				<DisplayCell 
					name={'Health'}
					value={this.props.health}
				/>
				<DisplayCell 
					name={'XP'}
					value={this.props.xp}
				/>
				<DisplayCell 
					name={'Level'}
					value={this.props.level}
				/>
				<DisplayCell 
					name={'Weapon'}
					value={this.props.weapon}
				/>

			</div>
			)
	}
}

export default Display