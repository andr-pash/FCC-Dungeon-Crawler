import React from 'react'

class DisplayCell extends React.Component{

	render(){
		return(
			<div className="disp-cell">
				{this.props.name}: {this.props.value}
			</div>
			)
	}
}

export default DisplayCell