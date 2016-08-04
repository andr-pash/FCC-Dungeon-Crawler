import React from 'react'

class DisplayCell extends React.Component{

	render(){
		return(
			<div className="disp-cell">
				{this.props.title}: {this.props.value}
			</div>
			)
	}
}

export default DisplayCell