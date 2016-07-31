import React from 'react'
import Cell from './Cell.jsx'


class GameBoard extends React.Component {

	render(){

		let cellsRows = this.props.cellsArray.map( (outerArr, outerIndex) => {

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