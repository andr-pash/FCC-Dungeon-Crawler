import React from 'react'
import ReactCSSTransitionGroup from "react-addons-css-transition-group"

export default class Modal extends React.Component {

	createModal(text, btns, modifier){ // string 2d-array --> [[text, function]] string
		
		return (
			<div className={`game-modal ${modifier}`} key={modifier}>
				<div className={`game-modal__inner ${modifier}`}>
					<h2>{text}</h2>

					{btns.map( (el, i) => {
						return (
							<div 
								className={`btn ${modifier}`} 
								onClick={ el[1] }
								key={i}>
								{ el[0] }
							</div>
						)
					})}				
				</div>
			</div>
			)
	}

	render(){
		let modal = []

		if(this.props.switch){
			modal = this.createModal( this.props.text, this.props.btns, this.props.modifier)
		}


		return(
        	<ReactCSSTransitionGroup
        		transitionName="slideDown"
				transitionAppear={true} 
				transitionAppearTimeout={250}
				transitionEnterTimeout={250}
				transitionLeaveTimeout={500}
        	>
        		{modal}
        	</ReactCSSTransitionGroup>
			)
	}
}