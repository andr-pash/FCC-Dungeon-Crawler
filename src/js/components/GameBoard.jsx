import React from 'react'
import Cell from './Cell.jsx'


class GameBoard extends React.Component {

	constructor(props){
		super(props)
	}


	

	render(){
		
		let player = this.props.player
		let plPos = player.position
		let vPort = this.props.viewport
		// let gameMap = this.props.gameMap
		let gameMap = _.cloneDeep(this.props.gameMap)


		let startRow = Math.max(0, plPos[1] - (vPort.rows / 2))
		let endRow = Math.min(gameMap.length, plPos[1] + (vPort.rows / 2))

		let startCol = Math.max(0, plPos[0] - (vPort.columns /2))
		let endCol = Math.min(gameMap[0].length, plPos[0] + (vPort.columns / 2))
		

		// relative Player position to viewport
		let relPlPosX = plPos[0] - startCol
		let relPlPosY = plPos[1] - startRow


		// only cut out relevent part of map
		// position player on top of map	


		let cellsRows = gameMap.map( (outerArr, outerIndex) => {

			let cells = outerArr.map( (element, innerIndex) => {

				if(outerIndex === plPos[1] && innerIndex === plPos[0]) {
					element = 'player'
				}

				return(
					<Cell 
						value={element} 
						key={innerIndex}
						innerIndex={innerIndex}
						outerIndex={outerIndex} />
					)
			})
			return(
				<tr key={outerIndex}>
					{cells}
				</tr>
				)
		})

		return(
				<table className="gameboard">
					<tbody>
						{cellsRows}
					</tbody>
				</table>
			)
	}
}


export default GameBoard