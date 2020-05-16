import { Sprite } from 'pixi.js'
import Matter from 'matter-js'
import { tileSize, shift, ratio } from './World.js'

const options = {
	inertia: Infinity,
	mass: 1,
	isStatic: true
}

class Wall {
	constructor(x, y, { texture, breakable }, space, stage) {
		this.position = { x: x, y: y }
		this.canvasPosition = { x: x*tileSize, y: y*tileSize }
		this.texture = texture
		this.breakable = breakable
		this.initView(stage)
		this.initPhysics(space)
	}
	initView(stage) {
		let sprite = Sprite.from(this.texture)
		sprite.anchor.set(shift/(tileSize * ratio))
		sprite.width = tileSize * ratio
		sprite.height = tileSize * ratio
		stage.addChild(sprite)
		this.sprite = sprite
	}
	
	initPhysics(space) {
		let body = Matter.Bodies.rectangle(this.position.x, this.position.y, 1, 1, options)
		Matter.World.add(space, body)
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
		Matter.World.remove(this._space, this.body)
		this._stage.removeChild(this.sprite)
	}
}

export default Wall