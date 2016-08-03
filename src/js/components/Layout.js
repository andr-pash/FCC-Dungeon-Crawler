import React from "react";
import GameBoard from "./GameBoard.jsx"
import { generateArray, addRooms, createRooms, intRange } from '../mapgenerator.js'
//import inventory from '../dungeonstuff.js'
//console.log(inventory)

function Treasure(gold, position){
    this.type = 'treasure'
    this.gold = gold
    this.position = position
}

export default class Layout extends React.Component {
        constructor() {
            super();

            this.state = {
                viewport: {
                    rows: 40,
                    columns: 60
                },
                mapSize: {
                    rows: 100,
                    columns: 100,
                },
                player: {
                    position: [],
                    health: 100,
                    weapon: { 
                        type: 'Bare Hands',
                        damage: 2,
                        chance: .5
                     },
                    xp: 0,
                    level: 1,
                    sight: 5,
                    strength: 5,
                    armor: 0,
                    gold: 0
                },
                map: [[]],
                darkness: false



            }

            this.handleMovement = this.handleMovement.bind(this)
            this.init = this.init.bind(this)
            this.move = this.move.bind(this)

        }

        componentWillMount() {
            this.init()

        }

        componentDidMount() {
            this.handleMovement()
        }

        init() {
            let map = generateArray(this.state.mapSize.columns, this.state.mapSize.rows)
            map = createRooms(map, this.state.mapSize.columns, this.state.mapSize.rows)

            //player setup
            let player = this.state.player
            let playerPos = this.findFreeTile(map)
            player.position = playerPos

            //rest of the dungeon setup
            let treasures = []
            let i = 0
            while(i < 10){
                let newPos = this.findFreeTile(map)
                let treasure = new Treasure(5, newPos)
                treasures.push( treasure )
                this.setTile(map, newPos, treasure)
                i++
            }
            console.log(treasures)

            this.setState({ map })
            this.setState({ player })

        }

        findFreeTile(map) {

            let newPos = () => {
                let x = intRange(1, this.state.mapSize.columns - 1)
                let y = intRange(1, this.state.mapSize.rows - 1)
                return [x, y]
            }

            let pos = newPos()

            while (map[pos[1]][pos[0]].type !== 'room') {
                pos = newPos()
              }
            return pos
        }

        setTile(map, position, type){
            map[position[1]][position[0]] = type
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

            let nextTile = this.state.map[newPos[1]][newPos[0]]
            
            switch(nextTile.type){
                case 'treasure':
                    player.gold += nextTile.gold 
                    this.setTile(this.state.map, newPos, { type: 'room' })
                    break

                case 'weapon':
                    player.weapon = nextTile
                    console.log(player.weapon)
                    this.setTile(this.state.map, newPos, { type: 'room' })
                    break

                case 'wall':
                    return
                default:
            }

            player.position = newPos
            this.setState({ player })

        }



        handleMovement() {

            let lastMove = 0
            document.addEventListener("keydown", function(e){

                // don't know if this is really needed
                if(new Date() - lastMove > 50){
                    lastMove = new Date()
                    this.move(e)
                }


            }.bind(this), false)
        }

        render() {

            return ( 
                <div>

                    <h1>FCC Rogue Dungeon Crawler</h1>

                    <GameBoard 
                      gameMap={ this.state.map }
                      player={ this.state.player }
                      viewport={ this.state.viewport } 
                      dark={ this.state.darkness }
                    />
                    
                </div>
            );
        }
}
