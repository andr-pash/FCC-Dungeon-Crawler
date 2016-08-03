


// MAP GENERATOR - tweak numbers in switch to get interesting results

class MapGenerator {

    constructor(x, y){

        this.mapSizeX = x
        this.mapSizeY = y
        this.gameMap = []
    }

    createMap(){
        this.generateArray()
        this.createRooms()
        
    }

    createRooms() {

        function Room(width, height, x, y) {
            return { x, y, width, height }
        }

        // Setup for random dungeon creation - choose location of 'seed' and number of rooms
        let map = []
        let roomArr = []
        let sides = ['top', 'right', 'bottom', 'left']
        let roomNum = 35 // number total rooms - 50 seems good - 60 doesn't work any more
        let startSides = 14 //
        let startX = this.mapSizeX / 2 - startSides / 2
        let startY = this.mapSizeY / 2 - startSides / 2

        let seedRoom = Room(startSides, startSides, startX, startY)
        roomArr.push(seedRoom)
        console.log(seedRoom)
        this.addRooms(seedRoom)
        console.log('map seedroom', map)


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
            width = this.intRange(3, 20)
            height = this.intRange(3, 15)


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
        console.log(this.gameMap)
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
    // TODO: rewrite as binary arr, just because
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
        console.log(outerArr)
        this.gameMap = outerArr
    }


    // random int in range between a and b 
    intRange(a, b) {
        return Math.floor(Math.random() * ((b + 1) - a)) + a
    }

}
export default MapGenerator
