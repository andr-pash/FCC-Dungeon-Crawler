import React from 'react'
import ReactCSSTransitionGroup from "react-addons-css-transition-group"

export default class Modal extends React.Component {

	constructor(props){
		super(props)
		this.state = {modal: []}
	}

	render(){
		let modal = []
		if(this.props.gameStatus === 'lost'){
			modal = [
				<div className={'gameover-modal'} key={1}>
					<div className="gameover-modal__inner">
						<h2>You Loose!</h2>
						<div className="btn btn-retry" onClick={this.props.retry}>Retry!</div>
					</div>
				</div>
			]
		}

		return(
        	<ReactCSSTransitionGroup
        		transitionName="slideDown"
				transitionAppear={true} 
				transitionAppearTimeout={250}
				transitionEnterTimeout={250}
				transitionLeaveTimeout={300}
        	>
        		{modal}
        	</ReactCSSTransitionGroup>
			)
	}
}