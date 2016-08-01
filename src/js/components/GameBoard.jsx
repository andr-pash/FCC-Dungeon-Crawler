import React from 'react'
import Cell from './Cell.jsx'


const euclidDistance = (a, b) => {
    return (
        Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
    )
}

class GameBoard extends React.Component {

	constructor(props){
		super(props)
	}


	

	render(){
		
		let player = this.props.player
		let sight = this.props.player.sight
		let plPos = player.position
		let vPort = this.props.viewport
		let gameMap = this.props.gameMap
            .map( (outerEl, outerInd) => outerEl.map( (innerEl, innerInd) => {
              let newEl = innerEl;
              let a = Math.abs(plPos[0] - innerInd)
              let b = Math.abs(plPos[1] - outerInd)
              if(euclidDistance(a, b) > sight){
                newEl = innerEl + ' darken'
              }
              return newEl
            }))

		// let gameMap = _.cloneDeep(this.props.gameMap)


		let startRow = Math.max(0, plPos[1] - (vPort.rows / 2))
		let endRow = Math.min(gameMap.length, plPos[1] + (vPort.rows / 2))

		let startCol = Math.max(0, plPos[0] - (vPort.columns /2))
		let endCol = Math.min(gameMap[0].length, plPos[0] + (vPort.columns / 2))
		

		// relative Player position to viewport
		let relPlPosX = plPos[0] - startCol
		let relPlPosY = plPos[1] - startRow


		// only cut out relevent part of map
		// position player on top of map	

		gameMap[plPos[1]][plPos[0]] = 'player'

		let cellsRows = []
		let j = 0

		while(j < vPort.rows){
			let innerArr = []
			let i = 0

			while(i < vPort.columns){
				let el = gameMap[startRow + j][startCol + i]
				innerArr.push(el?el:'wall')
				i++
			}

			cellsRows.push(innerArr)
			j++
		}

		console.log(cellsRows)

		cellsRows = cellsRows.map( (outerArr, outerIndex) => {

			let cells = outerArr.map( (element, innerIndex) => {

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






		// let cellsRows = gameMap.map( (outerArr, outerIndex) => {

		// 	let cells = outerArr.map( (element, innerIndex) => {

		// 		if(outerIndex === plPos[1] && innerIndex === plPos[0]) {
		// 			element = 'player'
		// 		}

		// 		return(
		// 			<Cell 
		// 				value={element} 
		// 				key={innerIndex}
		// 				innerIndex={innerIndex}
		// 				outerIndex={outerIndex} />
		// 			)
		// 	})
		// 	return(
		// 		<tr key={outerIndex}>
		// 			{cells}
		// 		</tr>
		// 		)
		// })

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