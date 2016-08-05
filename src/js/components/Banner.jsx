import React from 'react'
import ReactCSSTransitionGroup from "react-addons-css-transition-group"

class Banner extends React.Component {

	render(){
		let message = []
		if(this.props.message){
			message = (
				<div className="banner-container">
					{ this.props.message }
				</div>
				)
		}

		return(
			<ReactCSSTransitionGroup
				transitionName="bannerAnimation"
				transitionAppear={true}
				transitionAppearTimeout={300}
				transitionEnterTimeout={300}
				transitionLeaveTimeout={600}
			>	
				{message}
			</ReactCSSTransitionGroup>
		)
	}
}

export default Banner