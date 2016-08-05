
import { Monster, Torch, Weapon, Boss, Potion, Treasure} from './dungeonstuff.js'

// MAP GENERATOR - tweak numbers in switch to get interesting results
// TODO: allow for options to be passed for number of monsters etc


class MapGenerator {

    constructor(x, y, options){

        this.mapSizeX = x
        this.mapSizeY = y
        this.gameMap = []
        this.playerPos = []
        this.rooms = []
        this.minRoomSize =  3 
        this.maxRoomSize = 12
        this.numRooms = 45
    }

    createMap(){
        this.generateArray()
        this.createRooms()

        // type needs to be passed as anonymous function, so object is instantiated multiple times
        this.fillRooms( () => new Treasure(5), .3 )
        this.fillRooms( () => new Monster(), .6 )
        this.fillRooms( () => new Monster(2), .1 )
        this.fillRooms( () => new Potion(), .5 )
        this.fillSpecificRoom( () => new Weapon('Stick', 3, .5, 1), 4)
        this.fillSpecificRoom( () => new Weapon('Dagger', 6, .4, 2), 10)
        this.fillSpecificRoom( () => new Weapon('Small Axe', 7, .35, 3), 15)
        this.fillSpecificRoom( () => new Weapon('Sword', 8, .2, 4), 25)
        this.fillSpecificRoom( () => new Torch('Small Torch', 6), 3)
        this.fillSpecificRoom( () => new Torch('Medium Torch', 8), 15)
        this.fillSpecificRoom( () => new Torch('Giant Torch', 12), 20)
        this.fillSpecificRoom( () => new Boss(), this.rooms.length - 1 )

        this.playerPos = this.findFreeTile(this.rooms[0])



        
    }


    // use to place stuff that should be in every room, chance optional chance
    fillRooms(type, prob = 1){

        this.rooms.map( el => {

            if(Math.random() < prob){
                let pos = this.findFreeTile(el)
                this.setTile(pos, type())
            }
        })
    }



    fillSpecificRoom(type , roomNumber){

        const room = this.rooms[roomNumber]
        const pos = this.findFreeTile(room)

        // Boss needs four tiles
        if(type().type === 'boss'){

            //check if neighbors are free, else start again
            let neighbors = [
                    [ pos[0] + 1, pos[1] ],
                    [ pos[0], pos[1] + 1 ],
                    [ pos[0] + 1, pos[1] + 1 ]
            ]

            let neighborsFree = 0
            neighbors.map( el => {
                this.gameMap[el[1]][el[0]].type === 'room' ? neighborsFree += 1 : ''
                })

            if(neighborsFree === 3){
                let boss = type()
                this.setTile(pos, boss)
                boss.type = 'boss-body'
                neighbors.map( el => {
                    this.setTile(el, boss)
                })

            } else {
                console.log('recursive!')
                this.fillSpecificRoom(type, roomNumber)
                return
            }

        }

        this.setTile(pos, type())

    }


    // can find free tile on map, if room specified, then restricted to room 
    findFreeTile(room) {

        let xRange = [1, this.mapSizeX - 1]
        let yRange = [1, this.mapSizeY - 1]

        if( room ){
            xRange = [room.x, room.x + room.width]
            yRange = [room.y, room.y + room.height]
        }

        let newPos = () => {
            let x = this.intRange(xRange[0], xRange[1])
            let y = this.intRange(yRange[0], yRange[1])
            return [x, y]
        }

        let pos = newPos()

        while (this.gameMap[pos[1]][pos[0]].type !== 'room') {
            pos = newPos()
          }
        return pos
    }

    setTile(position, type){
        this.gameMap[position[1]][position[0]] = type
    }


    createRooms() {

        function Room(width, height, x, y) {
            return { x, y, width, height }
        }

        // Setup for random dungeon creation - choose location of 'seed' and number of rooms
        let map = []
        let roomArr = []
        let sides = ['top', 'right', 'bottom', 'left']
        let roomNum = this.numRooms // number total rooms - 50 seems good - 60 doesn't work any more
        let startSides = 14 //
        let startX = this.mapSizeX / 2 - startSides / 2
        let startY = this.mapSizeY / 2 - startSides / 2

        let seedRoom = Room(startSides, startSides, startX, startY)
        roomArr.push(seedRoom)
        this.addRooms(seedRoom)


        let runCounter = 0
        let roomCounter = 0
        while (roomCounter < roomNum && runCounter < 800) {

            // choose random wall - 4 decisions: top bottom, left right
            map = this.gameMap
            let side = sides[this.intRange(0, 3)]
            let currRoom = roomArr[roomCounter]

            let corners = {
                topLeft: [currRoom.x, currRoom.y],
                topRight: [currRoom.x + currRoom.width, currRoom.y],
                bottRight: [currRoom.x + currRoom.width, currRoom.y + currRoom.height],
                bottLeft: [currRoom.x, currRoom.y + currRoom.height]
            }

            let x, y, corrX, corrY, range1, range2, width, height
            width = this.intRange(this.minRoomSize, this.maxRoomSize)
            height = this.intRange(this.minRoomSize, this.maxRoomSize)


            switch (side) {
                case 'top':
                    x = this.intRange(corners.topLeft[0], corners.topRight[0])
                    y = corners.topLeft[1] - (height + 2)
                    range1 = (corners.topLeft[0] - x) < 0 ? x : corners.topLeft[0]
                    range2 = (corners.topRight[0] - (x + width)) > 0 ? (x + width) : corners.topRight[0]
                    corrX = this.intRange(range1, range2)
                    corrY = corners.topLeft[1] - 1
                    break

                case 'right':
                    x = corners.topRight[0] + 2
                    y = this.intRange(corners.topRight[1] - (height - 1), corners.bottRight[1])
                    range1 = (corners.topRight[1] - y) < 0 ? y : corners.topRight[1]
                    range2 = (corners.bottRight[1] - (y + height)) > 0 ? (y + height) : corners.bottRight[1]
                    corrX = corners.topRight[0] + 1
                    corrY = this.intRange(range1, range2)
                    break

                case 'bottom':
                    x = this.intRange(corners.topLeft[0], corners.topRight[0])
                    y = corners.bottRight[1] + 2
                    range1 = (corners.topLeft[0] - x) < 0 ? x : corners.topLeft[0]
                    range2 = (corners.topRight[0] - (x + width)) > 0 ? (x + width) : corners.topRight[0]
                    corrX = this.intRange(range1, range2)
                    corrY = corners.bottRight[1] + 1
                    break

                default:
                    x = corners.topLeft[0] - (width + 2)
                    y = this.intRange(corners.topRight[1] - (height - 1), corners.bottRight[1])
                    range1 = (corners.topRight[1] - y) < 0 ? y : corners.topRight[1]
                    range2 = (corners.bottRight[1] - (y + height)) > 0 ? (y + height) : corners.bottRight[1]
                    corrX = corners.topLeft[0] - 1
                    corrY = this.intRange(range1, range2)

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
                let tl = map[newRoom.y][newRoom.x].type === 'wall'
                    // top right corner
                let tr = map[newRoom.y][newRoom.x + newRoom.width].type === 'wall'
                    // bottom right corner
                let br = map[newRoom.y + newRoom.height][newRoom.x + newRoom.width].type === 'wall'
                    // bottom left corner
                let bl = map[newRoom.y + newRoom.height][newRoom.x].type === 'wall'


                // if rooms are desired to be more separated - maybe room size needs to be reduced then 
                let tl1 = map[newRoom.y - 1][newRoom.x - 1].type === 'wall'
                let tr1 = map[newRoom.y - 1][newRoom.x + newRoom.width + 1].type === 'wall'
                let br1 = map[newRoom.y + newRoom.height + 1][newRoom.x + newRoom.width + 1].type === 'wall'
                let bl1 = map[newRoom.y + newRoom.height + 1][newRoom.x - 1].type === 'wall'


                let noOverlap = tl && tr && br && bl
                let strictNoOverlap = tl1 && tr1 && br1 && bl1

                if (noOverlap && strictNoOverlap) {
                    this.addRooms(newRoom)
                    this.addRooms(newCorr)
                    roomArr.push(newRoom)

                    roomCounter += 1
                }

            }

            runCounter += 1
        }
        this.rooms = roomArr
    }



    // adds rooms to the map
    addRooms(room) {
        this.gameMap = this.gameMap.map((el, row) => {
            return el.map((e, col) => {

                let newEl = e;

                let inXRange = col >= room.x && col <= room.x + room.width
                let inYRange = row >= room.y && row <= room.y + room.height

                if (inXRange && inYRange) {
                    newEl = { type: 'room' }
                }

                return newEl

            })
        })
    }


    // builds the array the map is carved out of
    generateArray() {

        let j = 0
        let outerArr = []

        while (j < this.mapSizeY) {
            let innerArr = []
            let i = 0

            while (i < this.mapSizeX) {
                innerArr.push({ type: 'wall' })
                i++
            }
            outerArr.push(innerArr)
            j++
        }
        this.gameMap = outerArr
    }


    // random int in range between a and b 
    intRange(a, b) {
        return Math.floor(Math.random() * ((b + 1) - a)) + a
    }

}
export default MapGenerator
