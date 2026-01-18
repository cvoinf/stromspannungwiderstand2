namespace SpriteKind {
    export const elektron = SpriteKind.create()
    export const Waende = SpriteKind.create()
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (BatterieBeschleunigung == 0) {
        BatterieBeschleunigung = -200
        mySprite.sayText("Generator an", 1000, false)
    } else {
        BatterieBeschleunigung = 0
        mySprite.sayText("Generator aus", 1000, false)
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    for (let index = 0; index < 50; index++) {
        mySprite = sprites.create(img`
            7 
            `, SpriteKind.elektron)
        tiles.placeOnRandomTile(mySprite, assets.tile`transparency16`)
        mySprite.setBounceOnWall(true)
        mySprite.setVelocity(0, 0)
        list.push(mySprite)
    }
})
let l = 0
let lquadrat = 0
let dy = 0
let dx = 0
let mySprite: Sprite = null
let BatterieBeschleunigung = 0
let list: Sprite[] = []
list = []
list = sprites.allOfKind(SpriteKind.elektron)
let Reibung = 0.95
let Widerstand = 0.3
let Abprallfaktor = -1 * Reibung
let Temperatur = 1
let Ladung = 1000
BatterieBeschleunigung = -200
let Rand = 5
tiles.setCurrentTilemap(tilemap`Level1`)
// Es werden 100 Elektronen erzeugt und in einer Liste abgespeichert
for (let index = 0; index < 100; index++) {
    mySprite = sprites.create(img`
        5 
        `, SpriteKind.elektron)
    tiles.placeOnRandomTile(mySprite, assets.tile`transparency16`)
    mySprite.x += randint(-5, 5) / 1
    mySprite.y += randint(-5, 5) / 1
    mySprite.setBounceOnWall(true)
    mySprite.setVelocity(0, 0)
    list.push(mySprite)
}
mySprite.setImage(img`
    2 
    `)
controller.moveSprite(mySprite)
game.onUpdate(function () {
    for (let Wert of list) {
        if (Wert.x > scene.screenWidth() - Rand) {
            Wert.vx = Abprallfaktor * Wert.vx
            Wert.x = 2 * (scene.screenWidth() - Rand) - Wert.x
        } else if (Wert.x < 0 + Rand) {
            Wert.vx = Abprallfaktor * Wert.vx
            Wert.x = 2 * (0 + Rand) - Wert.x
        }
        if (Wert.y > scene.screenHeight() - Rand) {
            Wert.vy = Abprallfaktor * Wert.vy
            Wert.y = 2 * (scene.screenHeight() - Rand) - Wert.y
        } else if (Wert.y < Rand) {
            Wert.vy = Abprallfaktor * Wert.vy
            Wert.y = 2 * (0 + Rand) - Wert.y
        }
        Wert.vx = Reibung * Wert.vx
        Wert.vy = Reibung * Wert.vy
        Wert.vx += (randint(0, Temperatur) - Temperatur / 2) / 100
        Wert.vy += (randint(0, Temperatur) - Temperatur / 2) / 100
        if (Wert.tileKindAt(TileDirection.Center, sprites.dungeon.stairWest)) {
            Wert.vx = Widerstand * Wert.vx
            Wert.vy = Widerstand * Wert.vy
        }
    }
    // Jedes Elektron wird durch alle anderen beschleunigt, und zwar in entgegengesetzte Richtung, in Abhängigkeit vom Abstand
    for (let Wert of list) {
        Wert.ax = 0
        Wert.ay = 0
        if (BatterieBeschleunigung != 0) {
            if (Wert.tileKindAt(TileDirection.Center, sprites.dungeon.greenOuterEast0)) {
                if (Wert.vx > 0) {
                    Wert.vx = 0
                }
                Wert.ax += BatterieBeschleunigung
            }
        }
        for (let Wert2 of list) {
            if (Wert != Wert2) {
                dx = Wert.x - Wert2.x
                dy = Wert.y - Wert2.y
                lquadrat = dx * dx + dy * dy
                if (lquadrat != 0 && 25 > lquadrat) {
                    l = Math.sqrt(lquadrat)
                    Wert.ax += Ladung / lquadrat * (dx / l)
                    Wert.ay += Ladung / lquadrat * (dy / l)
                }
            }
        }
    }
})
