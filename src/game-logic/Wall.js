import * as PIXI from 'pixi.js'
import Matter from 'matter-js'
import { tileSize, shift, ratio, getStage, getSpace } from './World.js'
import { getAssets } from './Assets.js'

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const options = {
	inertia: Infinity,
	mass: 1,
	isStatic: true
}

class Wall {
	constructor(name, x, y) {
		let properties = getAssets().wall[name]

		this.name = name
		this.position = { x: x, y: y }
		this.canvasPosition = { x: x*tileSize, y: y*tileSize }
		this.texture = properties.texture
		this.unbreakable = properties.unbreakable
		this.initView()
		this.initPhysics()
	}
	initView() {
		let sprite = new PIXI.Sprite(this.texture)
		sprite.anchor.set(shift/(tileSize * ratio))
		sprite.width = tileSize * ratio
		sprite.height = tileSize * ratio
		getStage().addChild(sprite)
		this.sprite = sprite
	}
	
	initPhysics() {
		let body = Matter.Bodies.rectangle(this.position.x, this.position.y, 1, 1, options)
		Matter.World.add(getSpace(), body)
		this.body = body

		setInterval(() => {
				this.update()
		}, 17)
	}

	update() {
		this.position = {
			x: this.body.position.x,
			y: this.body.position.y  
		}
		this.canvasPosition = { 
			x: this.body.position.x*tileSize + shift,
			y: this.body.position.y*tileSize + shift 
		}

		this.sprite.position = this.canvasPosition
	}

	moveBy(x, y) {
		this.body.position.x += x
		this.body.position.y += y
	}

	remove() {
		if(!this.unbreakable){
			Matter.World.remove(getSpace(), this.body)
			getStage().removeChild(this.sprite)
			return true
		} else return false
	}
}

export default Wall