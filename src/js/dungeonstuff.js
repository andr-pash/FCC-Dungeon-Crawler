// TREASURES
const treasure = {
    gold: 5
}



// MONSTERS
const monster = {
    health: 100,
    damage: 5,
    chance: .6,
    xp: 20
}

// BOSS
const boss = {
    health: 250,
    damage: 10,
    chance: .85,
    xp: 150
}

// WEAPONS
const sword = {
    type: 'Sword',
    damage: 8,
    chance: .65
}

const dagger = {
    type: 'Dagger',
    damage: 6,
    chance: .75
}

const stick = {
    type: 'Stick',
    damage: 3,
    chance: .5
}

const smallAxe = {
    type: 'Small Axe'
    damage: 7,
    chance: .65
}

const weapons = { sword, dagger, stick, smallAxe }

// LIGHT

const smallTorch = {
    sight: 6
}

const mediumTorch = {
    sight: 8
}

const giantTorch = {
    sight: 12
}

const torches = { smallTorch, mediumTorch, giantTorch }


const inventory = {
    treasures: { treasure },
    monsters: { monster },
    boss: { boss },
    weapons: weapons,
    torches: torches
}
export default inventory




