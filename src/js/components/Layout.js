import React from "react";
import GameBoard from "./GameBoard.jsx"
import _ from 'lodash'


// random int in range between a and b 
const intRange = (a, b) => Math.floor(Math.random() * (b - a)) + a

const euclidDistance = (a, b) => {
    return (
        Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
    )
}


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
                player: {
                    position: [],
                    health: 100,
                    weapon: 'sword'
                },
                rooms: [],
                map: [[]]

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
            map = this.createRooms(map)

            let player = this.state.player
            let playerPos = this.findPlayerStart(map)
            player.position = playerPos

            this.setState({ map })
            this.setState({ player })
            console.log('player:', player)
            console.log('initmap:', map)

        }

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



        // MAP GENERATOR - TODO: FIX THIS MESS!!!
        // doesn't reliably deliver interconnected dungeons - because me stupid
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


            let roomNum = 40
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
              let width = intRange(3, 20)
              let height = intRange(3, 15)
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

              // TODO: look for more elegant solution, may store in array and then reduce...
              // if room fits into map and has no overlaps with other rooms, add it to map
              let fitsMap = x > 0 && (x + width) <  map[0].length && y > 0 && (y + height) < map.length

              if(fitsMap){

                  // top left corner
                  let tl = map[newRoom.y][newRoom.x] === 'wall'
                  // top right corner
                  let tr = map[newRoom.y][newRoom.x + newRoom.width] === 'wall'
                  // bottom right corner
                  let br = map[newRoom.y + newRoom.height][newRoom.x + newRoom.width] === 'wall'
                  // bottom left corner
                  let bl = map[newRoom.y + newRoom.height][newRoom.x] === 'wall'

                  let noOverlap = tl === true && tr === true && br === true && bl === true


                  if(noOverlap){
                    map = this.addRooms(map, newRoom)
                    map = this.addRooms(map, newCorr)
                    roomArr.push(newCorr)
                    roomArr.push(newRoom)
                    
                    roomCounter += 2
              }

            }

            }

            return map
        }

        addRooms(map, room) {


                map = map.map((el, row) => {
                    return el.map((e, col) => {

                        let newEl = e;

                        let inXRange = col >= room.x && col <= room.x + room.width
                        let inYRange = row >= room.y && row <= room.y + room.height

                        if (inXRange && inYRange) {
                            newEl = 'room'
                        }

                        return newEl


                    })
                })

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
            // console.log(key)
            let player = this.state.player
            let playerPos = player.position
            let newPos = []
            if (key === 38) newPos = [playerPos[0], playerPos[1] - 1]
            if (key === 40) newPos = [playerPos[0], playerPos[1] + 1]
            if (key === 37) newPos = [playerPos[0] - 1, playerPos[1]]
            if (key === 39) newPos = [playerPos[0] + 1, playerPos[1]]
            // console.log('playerPos:', playerPos)
            // console.log('newPos:', newPos)
            // console.log('map:', this.state.map)

            //collision logic - expand this for treasure/enemy etc.
            // console.log(this.state.map[newPos[1]][newPos[0]])

            if (this.state.map[newPos[1]][newPos[0]] !== 'room') {
                return
            }


            player.position = newPos

            // console.log(player)

            this.setState({ player })


        }



        handleMovement() {
            document.addEventListener("keydown", this.move, false)

        }



        render() {

                let playerPos = this.state.player.position

            return ( 
                <div>

                    <h1>FCC Rogue Dungeon Crawler</h1>

                    <GameBoard 
                      gameMap={ this.state.map }
                      player={ this.state.player }
                      viewport={ this.state.viewport } 
                    />
                    
                </div>
            );
        }
}
