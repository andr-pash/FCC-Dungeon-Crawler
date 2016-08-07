import React from 'react'


const Cell = (props) => {

		let type = props.value.type
		let direction = ''
		let isItem = type !== 'room' &&  type !== 'wall' && type !== 'boss-body'
		let image


		if(type === 'player'){
			direction +=  '-' + props.value.direction 
		}

		let darken = props.dark ? ' darken' : ''

		if(isItem){
			image = (
				<img 
					className={darken + ' item ' + type}
					src={ './img/space-' + type + direction + '.png' } 
					alt=""
				/>
				)
		}

		return(
				<td 
					className={`cell ${type} ${darken} ${direction}`}
				>
				{ isItem && !darken ? image : '' }
				</td>
			)
	}


export default Cell