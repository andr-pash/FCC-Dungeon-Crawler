function Treasure(gold){
    this.type = 'treasure'
    this.gold = gold
}

function Monster(level = 1){
    this.type = 'monster'
    this.level = level
    this.health = 100 * (level + .5)
    this.damage = 5 * level
    this.xp = 20 * level

    this.attack = function(target){
        target.health = target.health - this.damage
        return target
    }
}

function Potion(strength = 15){
    this.type = 'potion'
    this.strength = strength
}

function Boss(){
    this.type = 'boss'
    this.health = 1000
    this.damage = 20
    this.xp = 150
    this.attack = function(target){
        target.health = target.health - this.damage
        return target
    }
}

function Weapon(name, damage, chance){
    this.type = 'weapon'
    this.name = name
    this.damage = damage
    this.chance = chance
}


function Torch(name, sight){
    this.type = 'torch'
    this.name = name
    this.sight = sight
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

export { Player, Monster, Torch, Weapon, Boss, Potion, Treasure }