import React from "react";
import GameBoard from "./GameBoard.jsx"
import Display from "./Display.jsx"
import Modal from "./Modal.jsx"
import MapGen from "../mapGenClass.js"
// import { generateArray, addRooms, createRooms, intRange } from '../mapgenerator.js'
//import inventory from '../dungeonstuff.js'
//console.log(inventory)

function intRange(a, b) {
        return Math.floor(Math.random() * ((b + 1) - a)) + a
    }

function Player() {
    this.position = []
    this.health = 100
    this.weapon = {
        type: 'Bare Hands',
        damage: 2,
        chance: .5
    }
    this.xp = 0
    this.level = 1
    this.sight = 5
    this.strength = 5
    this.armor = 0
    this.gold = 0
    this.lives = 0
    this.attack = function(target){
        let damage = this.weapon.damage * this.strength * this.level
        let chance = Math.round((Math.random() * this.weapon.chance) * damage)
        let totalDamage = damage - chance
        target.health = target.health - totalDamage
        return target
    }
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
            player: new Player(),
            map: [[]],
            darkness: true,
            currentEnemy: {},
            gameOver: false



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
        let mapGen = new MapGen(this.state.mapSize.columns, this.state.mapSize.rows)
        mapGen.createMap()
        let map = mapGen.gameMap



        //player setup
        let player = this.state.player
        let playerPos = mapGen.playerPos

        player.position = playerPos


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


    checkLevelUp(){
        if(this.state.player.xp >= 100){
            this.state.player.level = 2
        }
        if(this.state.player.xp >= 250){
            this.state.player.level = 3
        }
        if(this.state.player.xp >= 500){
            this.state.player.level = 4
        }
        if(this.state.player.xp >= 800){
            this.state.player.level = 5
        }
        console.log(this.state.player)

    }

    move(e) {
        let allowedKeys = [37, 38, 39, 40]
        let key = e.keyCode
        if(allowedKeys.indexOf(key) < 0) return

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
                if(player.gold % 25 === 0) player.xp += 25
                this.setTile(this.state.map, newPos, { type: 'room' })
                break

            case 'weapon':
                player.weapon = nextTile
                console.log(player)
                this.setTile(this.state.map, newPos, { type: 'room' })
                break

            case 'boss':
            case 'monster':
                let monster = nextTile

                monster = player.attack(monster)
                player = monster.attack(player)

                if(monster.health <= 0){
                    player.xp += monster.xp
                    this.checkLevelUp()
                    monster = {}
                    this.setTile(this.state.map, newPos, { type: 'room' })    
                    break
                }

                if(player.health <= 0){
                    player.lives = player.lives - 1
                    if ( player.lives < 0){
                        this.setState({ gameOver: true })
                    }
                }
                this.setState({ currentEnemy: monster })
                return


            case 'potion':
                player.health += nextTile.strength
                if(player.health > 100) player.health = 100
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

                <Display 
                    title={'Player Stats'}
                    health={this.state.player.health}
                    xp={this.state.player.xp}
                    level={this.state.player.level}
                    weapon={this.state.player.weapon.name}
                />

                <Display 
                    title={'Enemy Stats'}
                    health={this.state.currentEnemy.health}
                    level={this.state.currentEnemy.level}

                />


                <Modal 
                    gameover={this.state.gameOver}
                />
                
            </div>
        );
    }
}
