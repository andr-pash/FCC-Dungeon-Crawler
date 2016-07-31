import React from "react";
import GameBoard from "./GameBoard.jsx"
import _ from 'lodash'


// random int in range between a and b 
let intRange = (a, b) => Math.floor(Math.random() * (b - a)) + a


export default class Layout extends React.Component {
        constructor() {
            super();

            this.state = {
                viewport: {
                    rows: 100,
                    columns: 100
                },
                mapSize: {
                    rows: 100,
                    columns: 100,
                },
                cellsArray: [],
                player: {
                    position: [25, 25],
                    health: 100,
                    weapon: 'sword'
                },
                rooms: [],
                map: []

            }

            this.handleMovement = this.handleMovement.bind(this)
            this.generateArray = this.generateArray.bind(this)
            this.init = this.init.bind(this)
            this.move = this.move.bind(this)

        }

        componentDidMount() {
            this.init()
            this.handleMovement()
        }

        init() {
            let map = this.generateArray()
            let rooms = this.createRooms(map)
            map = this.addRooms(map, rooms)
            let cellsArray = _.cloneDeep(map)


            let player = this.state.player
            let playerPos = this.findPlayerStart(map)
            let playerX = playerPos[0]
            let playerY = playerPos[1]
            player.position = playerPos
            cellsArray[playerY][playerX] = 'player'

            this.setState({ map })
            this.setState({ cellsArray })
            this.setState({ rooms })
            this.setState({ player })

        }

        // createRooms(){
        //   return [
        //     {
        //       x: 10,
        //       y: 10,
        //       width: 20,
        //       height: 20
        //     }
        //   ]
        // }

        findPlayerStart(map) {

            let newPos = () => {
                let x = intRange(1, this.state.mapSize.columns - 1)
                let y = intRange(1, this.state.mapSize.rows - 1)
                return [x, y]
            }

            let pos = newPos()


            while (map[pos[1]][pos[0]] === 'wall') {
                pos = newPos()
              }

            return pos
        }


        createRooms(map) {

            function room(width, height, x, y) {
                return {
                    x: x,
                    y: y,
                    width: width,
                    height: height
                }
            }

            function corridor(x, y){
                return {
                  x: x,
                  y: y,
                  width: 0,
                  height: 0
                }
            }

            //start with room in center of map

            let roomArr = []
            let startSides = 14
            let startX = this.state.mapSize.columns / 2 - startSides / 2
            let startY = this.state.mapSize.rows / 2 - startSides / 2

            // clockwise from the top-left

            roomArr.push(room(startSides, startSides, startX, startY))


            let roomNum = 100
            let roomCounter = 0
            while (roomCounter < roomNum) {

              // choose random wall - 4 decisions: top bottom, left right
              let sides = ['top', 'right', 'bottom', 'left']
              let side = sides[intRange(0, 4)]
              let currRoom = roomArr[roomCounter]
              let corners = [
                  [currRoom.x, currRoom.y],
                  [currRoom.x + currRoom.width, currRoom.y],
                  [currRoom.x + currRoom.width, currRoom.y + currRoom.height],
                  [currRoom.x, currRoom.y + currRoom.height]
              ]
              let width = intRange(5, 10)
              let height = intRange(3, 10)
              let x, y, corrX, corrY


              //TODO: this is a mess... clean up so it's easily readable or better refactor
              if(side === 'top')  {
                x = intRange(corners[0][0], corners[1][0]) 
                y = corners[0][1] - (height + 2)
                corrX = x
                corrY = corners[0][1] - 1
              }
              
              if(side === 'right')  {
                x = corners[1][0] + 2
                y = intRange(corners[0][1], corners[2][1])
                corrX = x - 1
                corrY = y
              }
              
              if(side === 'bottom')  {
                x = intRange(corners[0][0], corners[1][1])
                y = corners[2][1] + 2
                corrX = x
                corrY = corners[2][1] + 1                
              }
              
              if(side === 'left')  {
                x = corners[0][0] - (width + 2)
                y = intRange(corners[0][1], corners[2][1])
                corrX = corners[0][0] - 1
                corrY = y
              }

              let newRoom = room(width, height, x, y)
              let newCorr = corridor(corrX, corrY)


              // if room fits into map and has no overlaps with other rooms, add it to map
              let fitsMap = x > 0 && (x + width) <  map[0].length && y > 0 && (y + height) < map.length
              //let noOverlap = 


              if(fitsMap){
                roomArr.push(newRoom)
                roomArr.push(newCorr)
                console.log(room(width, height, x, y), corridor(corrX, corrY))
                roomCounter += 2
              }



            }

            return map
        }

        addRooms(map, rooms) {


            for (let i = 0; i < rooms.length; i++) {

                let room = rooms[i]
                map = map.map((el, row) => {
                    return el.map((e, col) => {

                        let newEl = e;

                        let inXRange = col >= room.x && col <= room.x + room.width
                        let inYRange = row >= room.y && row <= room.y + room.height

                        if (inXRange && inYRange) {
                            newEl = 'room '  + 'room' + i
                        }

                        return newEl


                    })
                })
            }

            return map

        }



        generateArray() {

            let j = 0
            let outerArr = []

            while (j < this.state.mapSize.rows) {
                let innerArr = []
                let i = 0

                while (i < this.state.mapSize.columns) {
                    innerArr.push('wall')
                    i++
                }
                outerArr.push(innerArr)
                j++
            }
            return outerArr
        }




        move(e) {
            let key = e.keyCode
            let player = this.state.player
            let newPos = _.cloneDeep(this.state.player.position)
            if (key === 38) newPos[1] = newPos[1] - 1
            if (key === 40) newPos[1] = newPos[1] + 1
            if (key === 37) newPos[0] = newPos[0] - 1
            if (key === 39) newPos[0] = newPos[0] + 1

            //collision logic
            let cellsArray = _.cloneDeep(this.state.map)
            if (cellsArray[newPos[1]][newPos[0]] !== 'room') {
                console.log(cellsArray[newPos[1]][newPos[0]])
                console.log(newPos, this.state.player.position)
                return
            }


            player.position = newPos



            cellsArray[newPos[1]][newPos[0]] = 'player'


            this.setState({ player })
            this.setState({ cellsArray })

        }



        handleMovement() {
            document.addEventListener("keydown", this.move, false)

        }

        euclidDistance(a, b) {
            return (
                Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
            )
        }

        render() {

                let playerPos = this.state.player.position
                let xView = this.state.viewport.columns / 2
                let yView = this.state.viewport.rows / 2
                let viewport = this.state.cellsArray

                // cut out cells to be displayed
                    .filter((e, i) => {
                        return i > playerPos[1] - yView && i < playerPos[1] + yView
                    })
                    .map(el => {
                        return el.filter((cell, i) => {
                            return i > playerPos[0] - xView && i < playerPos[0] + xView
                        })
                    })

                // darken cells that are not in players proximity
                // .map( (outerEl, outerInd) => outerEl.map( (innerEl, innerInd) => {
                //   let newEl = innerEl;
                //   let a = Math.abs(playerPos[0] - innerInd)
                //   let b = Math.abs(playerPos[1] - outerInd)
                //   if(this.euclidDistance(a, b) > 10){
                //     newEl = innerEl + ' darken'
                //   }
                //   return newEl
                // }))


            return ( 
                <div>

                    <h1>FCC Game of Life</h1>

                    <GameBoard 
                      cellsArray={viewport} 
                    />
                    
                </div>
            );
        }
}
