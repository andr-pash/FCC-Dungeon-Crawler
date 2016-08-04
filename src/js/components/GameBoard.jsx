import React from 'react'
import Cell from './Cell.jsx'
import Display from "./Display.jsx"


const euclidDistance = (a, b) => {
    return (
        Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
    )
}

class GameBoard extends React.Component {
	

	render(){
		
		let player = this.props.player
		let sight = this.props.player.sight
		let darkness = this.props.dark
		let plPos = player.position
		let vPort = this.props.viewport
		let gameMap = this.props.gameMap

			// let's call it fog of war 
            .map( (outerEl, outerInd) => outerEl.map( (innerEl, innerInd) => {

				let newEl = innerEl



				if(darkness === true){	
					let a = Math.abs(plPos[0] - innerInd)
					let b = Math.abs(plPos[1] - outerInd)
					if(euclidDistance(a, b) > sight){
					newEl.dark = ' darken'
					} else {
						newEl.dark = ''
					}
				}

				return newEl
            }))


		// VIEWPORT MAGIC
		let startRow = Math.max(0, plPos[1] - (vPort.rows / 2))
		let endRow = Math.min(gameMap.length, plPos[1] + (vPort.rows / 2))

		if(Math.abs(endRow - startRow) < vPort.rows){
			startRow === 0 ? endRow = vPort.rows : startRow = (endRow - vPort.rows)
		}

		let startCol = Math.max(0, plPos[0] - (vPort.columns /2))
		let endCol = Math.min(gameMap[0].length, plPos[0] + (vPort.columns / 2))

		if(Math.abs(endCol - startCol) < vPort.columns){
			startCol === 0 ? endCol = vPort.columns : startCol = (endCol - vPort.columns)
		}	
		

		gameMap[plPos[1]][plPos[0]] = { type: 'player' }

		let cellsRows = gameMap.slice(startRow, endRow)
						.map( el => el.slice(startCol, endCol))
						.map( (outerArr, outerIndex) => {

							let cells = outerArr.map( (element, innerIndex) => {

								return (
									<Cell 
										value={element}
										dark={element.dark} 
										key={innerIndex}
										innerIndex={innerIndex}
										outerIndex={outerIndex} />
									)
							})
							return (
								<tr key={outerIndex}>
									{cells}
								</tr>
								)
						})



		return(
				<div className="gameboard-container">
					

					<table className="gameboard">
						<tbody>
							{cellsRows}
						</tbody>
					</table>
					<div className='game-display'>
					 <Display
                        title={'Player Stats'}
                        health={this.props.player.health}
                        xp={this.props.player.xp}
                        level={this.props.player.level}
                        weapon={this.props.player.weapon.name}
                    />

                    <Display 
                        title={'Enemy Stats'}
                        health={this.props.enemy.health}
                        level={this.props.enemy.level}
                    />
                    </div>
				</div>					
			)
	}
}


export default GameBoard