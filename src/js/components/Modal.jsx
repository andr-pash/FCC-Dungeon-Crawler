import React from 'react'

export default class Modal extends React.Component {

	render(){

		let hiddenClass = ''
		if( this.props.gameover === false){
			hiddenClass = ' hidden'
		}
		console.log(hiddenClass)

		return(
			<div className={`gameover-modal ${hiddenClass}`}>
				<div className="gameover-modal__inner">
					You Loose!
				</div>
			</div>
			)
	}
}