import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import GameBoard from "./GameBoard.jsx"
import Display from "./Display.jsx"
import Modal from "./Modal.jsx"
import MapGen from "../mapGenClass.js"
import { Player } from "../dungeonstuff.js"
// import { generateArray, addRooms, createRooms, intRange } from '../mapgenerator.js'
//import inventory from '../dungeonstuff.js'
//console.log(inventory)

function intRange(a, b) {
        return Math.floor(Math.random() * ((b + 1) - a)) + a
    }


export default class Layout extends React.Component {
    constructor() {
        super();

        this.state = {
            viewport: {
                rows: 25,
                columns: 50
            },
            mapSize: {
                rows: 100,
                columns: 100,
            },
            player: new Player(),
            map: [[]],
            darkness: true,
            currentEnemy: {},
            gameStatus: 'start', // running lost won

            bannerMsg: ''



        }

        this.handleMovement = this.handleMovement.bind(this)
        this.init = this.init.bind(this)
        this.move = this.move.bind(this)
        this.setBannerMsg = this.setBannerMsg.bind(this)

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
        let player = new Player()
        let playerPos = mapGen.playerPos
        player.position = playerPos

        console.log('init!')
        this.setState({ map,  player, gameStatus: 'start', currentEnemy: {} })
        // this.setState({ player })
        // this.setState({ gameOver: false })

    }

    setTile(map, position, type){
        map[position[1]][position[0]] = type
    }


    setBannerMsg(msg){
        this.setState({ bannerMsg: msg })
        setTimeout( () => this.setState({ bannerMsg: '' }), 1500)
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
                this.setBannerMsg('Gold Digger!')
                break

            case 'weapon':

                if(player.level < nextTile.reqLevel) break

                if(nextTile.damage > player.weapon.damage){
                    player.weapon = nextTile
                }   
                this.setTile(this.state.map, newPos, { type: 'room' })
                break

            case 'torch':
                if(nextTile.sight > player.sight){
                    player.sight = nextTile.sight
                }
                this.setTile(this.state.map, newPos, { type: 'room' })
                this.setBannerMsg('There shall be light!')
                break


            case 'boss':

            case 'monster':
                let monster = nextTile


                monster = player.attack(monster)
                if(monster.health <= 0){
                    player.xp += monster.xp
                    this.checkLevelUp()
                    monster = {}
                    this.setState({ currentEnemy: monster })
                    this.setTile(this.state.map, newPos, { type: 'room' })    
                    break
                }


                player = monster.attack(player)
                if(player.health <= 0){
                    player.lives = player.lives - 1
                    player.health = 100
                    if ( player.lives < 0){
                        player.health = 0
                        player.lives = 0
                        this.setState({ gameStatus: 'lost' })
                    }
                }
                this.setState({ currentEnemy: monster })
                return


            case 'potion':
                if(player.health < 100){
                    player.health += nextTile.strength
                    if(player.health > 100) player.health = 100
                    this.setTile(this.state.map, newPos, { type: 'room' })
                }
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
            <div className="app-shell">
                <h1>FCC Roguelike Dungeon Crawler</h1>
                <GameBoard 
                  gameMap={ this.state.map }
                  player={ this.state.player }
                  viewport={ this.state.viewport } 
                  dark={ this.state.darkness }
                  enemy={ this.state.currentEnemy }
                  bannerMsg={ this.state.bannerMsg }
                >  
                </GameBoard>

                <Modal 
                    gameStatus={this.state.gameStatus}
                    retry={this.init}
                />

            </div>
        );
    }
}
