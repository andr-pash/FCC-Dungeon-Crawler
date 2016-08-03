// MAP GENERATOR - tweak numbers in switch to get interesting results
function createRooms(map, mapSizeCol, mapSizeRow) {

    function Room(width, height, x, y) {
        return { x, y, width, height }
    }

    // Setup for random dungeon creation - choose location of 'seed' and number of rooms
    let roomArr = []
    let sides = ['top', 'right', 'bottom', 'left']
    let roomNum = 35 // number total rooms - 50 seems good - 60 doesn't work any more
    let startSides = 14 //
    let startX = mapSizeCol / 2 - startSides / 2
    let startY = mapSizeRow / 2 - startSides / 2

    let seedRoom = Room(startSides, startSides, startX, startY)
    roomArr.push(seedRoom)
    map = addRooms(map, seedRoom)


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
                map = addRooms(map, newRoom)
                map = addRooms(map, newCorr)
                roomArr.push(newRoom)

                roomCounter += 1
            }

        }

        runCounter += 1
    }
    return map
}



// adds rooms to the map
function addRooms(map, room) {

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
// TODO: rewrite as binary arr, just because
function generateArray(x, y) {

    let j = 0
    let outerArr = []

    while (j < y) {
        let innerArr = []
        let i = 0

        while (i < x) {
            innerArr.push('wall')
            i++
        }
        outerArr.push(innerArr)
        j++
    }
    return outerArr
}


// random int in range between a and b 
function intRange(a, b) {
    return Math.floor(Math.random() * ((b + 1) - a)) + a
}


export { generateArray, addRooms, createRooms, intRange }
