import React from "react";
import GameBoard from "./GameBoard.jsx"
import _ from 'lodash'


// random int in range between a and b 
const intRange = (a, b) => Math.floor(Math.random() * ((b + 1) - a)) + a

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
                    rows: 30,
                    columns: 50
                },
                mapSize: {
                    rows: 100,
                    columns: 100,
                },
                player: {
                    position: [],
                    health: 100,
                    weapon: 'stick',
                    xp: 0,
                    level: 1,
                    sight: 5,
                    strength: 5,
                    armor: 0
                },
                map: [[]],
                darkness: true


            }

            this.handleMovement = this.handleMovement.bind(this)
            this.generateArray = this.generateArray.bind(this)
            this.init = this.init.bind(this)
            this.move = this.move.bind(this)

        }

        componentWillMount() {
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


        // MAP GENERATOR - tweak numbers in switch to get interesting results
        createRooms(map) {

            function Room(width, height, x, y) {
                return { x, y, width, height }
            }

            // Setup for random dungeon creation - choose location of 'seed' and number of rooms
            let roomArr = []
            let sides = ['top', 'right', 'bottom', 'left']
            let roomNum = 35 // number total rooms - 50 seems good - 60 doesn't work any more
            let startSides = 14 //
            let startX = this.state.mapSize.columns / 2 - startSides / 2
            let startY = this.state.mapSize.rows / 2 - startSides / 2

            let seedRoom = Room(startSides, startSides, startX, startY)
            roomArr.push(seedRoom)
            map = this.addRooms(map, seedRoom)


            let runCounter = 0
            let roomCounter = 0
            while (roomCounter < roomNum && runCounter < 800) {

                // choose random wall - 4 decisions: top bottom, left right

                let side = sides[intRange(0, 3)]
                let currRoom = roomArr[roomCounter]

                let corners = {
                    topLeft: [currRoom.x, currRoom.y],
                    topRight: [currRoom.x + currRoom.width, currRoom.y],
                    bottRight: [currRoom.x + currRoom.width, currRoom.y + currRoom.height],
                    bottLeft: [currRoom.x, currRoom.y + currRoom.height]
                }

                let x, y, corrX, corrY, range1, range2, width, height
                width = intRange(3, 20)
                height = intRange(3, 15)


                switch (side) {
                    case 'top':
                        x = intRange(corners.topLeft[0], corners.topRight[0])
                        y = corners.topLeft[1] - (height + 2)
                        range1 = (corners.topLeft[0] - x) < 0 ? x : corners.topLeft[0]
                        range2 = (corners.topRight[0] - (x + width)) > 0 ? (x + width) : corners.topRight[0]
                        corrX = intRange(range1, range2)
                        corrY = corners.topLeft[1] - 1
                        break

                    case 'right':
                        x = corners.topRight[0] + 2
                        y = intRange(corners.topRight[1] - (height - 1), corners.bottRight[1])
                        range1 = (corners.topRight[1] - y) < 0 ? y : corners.topRight[1]
                        range2 = (corners.bottRight[1] - (y + height)) > 0 ? (y + height) : corners.bottRight[1]
                        corrX = corners.topRight[0] + 1
                        corrY = intRange(range1, range2)
                        break

                    case 'bottom':
                        x = intRange(corners.topLeft[0], corners.topRight[0])
                        y = corners.bottRight[1] + 2
                        range1 = (corners.topLeft[0] - x) < 0 ? x : corners.topLeft[0]
                        range2 = (corners.topRight[0] - (x + width)) > 0 ? (x + width) : corners.topRight[0]
                        corrX = intRange(range1, range2)
                        corrY = corners.bottRight[1] + 1
                        break

                    default:
                        x = corners.topLeft[0] - (width + 2)
                        y = intRange(corners.topRight[1] - (height - 1), corners.bottRight[1])
                        range1 = (corners.topRight[1] - y) < 0 ? y : corners.topRight[1]
                        range2 = (corners.bottRight[1] - (y + height)) > 0 ? (y + height) : corners.bottRight[1]
                        corrX = corners.topLeft[0] - 1
                        corrY = intRange(range1, range2)

                }


                let newRoom = Room(width, height, x, y)
                let newCorr = Room(0, 0, corrX, corrY)

                // TODO: look for more elegant solution, may store in array and then reduce...
                // if room fits into map and has no overlaps with other rooms, add it to map
                let fitsVert = y > 2 && (y + height) < map.length - 3
                let fitsHorz = x > 2 && (x + width) < map[0].length - 3
                let fitsMap = fitsVert && fitsHorz

                if (fitsMap) {

                    // top left corner
                    let tl = map[newRoom.y][newRoom.x] === 'wall'
                    // top right corner
                    let tr = map[newRoom.y][newRoom.x + newRoom.width] === 'wall'
                    // bottom right corner
                    let br = map[newRoom.y + newRoom.height][newRoom.x + newRoom.width] === 'wall'
                    // bottom left corner
                    let bl = map[newRoom.y + newRoom.height][newRoom.x] === 'wall'
                    

                    // if rooms are desired to be more separated - maybe room size needs to be reduced then 
                    let tl1 = map[newRoom.y - 1][newRoom.x - 1] === 'wall'
                    let tr1 = map[newRoom.y - 1][newRoom.x + newRoom.width + 1] === 'wall'
                    let br1 = map[newRoom.y + newRoom.height + 1][newRoom.x + newRoom.width + 1] === 'wall'
                    let bl1 = map[newRoom.y + newRoom.height + 1][newRoom.x - 1] === 'wall'


                    let noOverlap = tl && tr && br && bl
                    let strictNoOverlap = tl1 && tr1 && br1 && bl1

                    if (noOverlap && strictNoOverlap) {
                        map = this.addRooms(map, newRoom)
                        map = this.addRooms(map, newCorr)
                        roomArr.push(newRoom)

                        roomCounter += 1
                    }

                }

                runCounter += 1
            }
            return map
        }



        // adds rooms to the map
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


        // builds the array the map is carved out of
        // TODO: rewrite as binary arr, because space and maybe fast
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
            let playerPos = player.position
            let newPos = []
            if (key === 38) newPos = [playerPos[0], playerPos[1] - 1]
            if (key === 40) newPos = [playerPos[0], playerPos[1] + 1]
            if (key === 37) newPos = [playerPos[0] - 1, playerPos[1]]
            if (key === 39) newPos = [playerPos[0] + 1, playerPos[1]]

            if (this.state.map[newPos[1]][newPos[0]] !== 'room') {
                return
            }

            player.position = newPos

            this.setState({ player })
        }



        handleMovement() {
            document.addEventListener("keydown", this.move, false)
        }



        render() {

                let playerPos = this.state.player.position

                // TODO: CORRECT PLAYER POSITION SO CALCS ARE WORKING AGAIN
                // darken cells that are not in players proximity
                // viewport = viewport.map( (outerEl, outerInd) => outerEl.map( (innerEl, innerInd) => {
                //   let newEl = innerEl;
                //   let a = Math.abs(playerPos[0] - innerInd)
                //   let b = Math.abs(playerPos[1] - outerInd)
                //   if(euclidDistance(a, b) > 10){
                //     newEl = innerEl + ' darken'
                //   }
                //   return newEl
                // }))

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
