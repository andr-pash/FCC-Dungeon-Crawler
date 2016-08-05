import React from 'react'

class HealthBar extends React.Component {

	render(){
		let width = this.props.val

		return(
			<div>
			<span>Health:</span> <br/>
			<svg width="200" height="10">
				<g>
					<rect 
						width={width} 
						height='5' 
						x='0' 
						y='0' 
						style={{ 
							fill: 'green',
							rx: 5,
							ry: 5

					}} 
					/>
				</g>
			</svg>
			</div>
			)
	}
}

export default HealthBar