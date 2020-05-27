import { Sprite	 } from 'pixi.js'
import Matter from 'matter-js'
import { shift, tileSize, tilePixelsWidth } from './World.js'

const options = {
	inertia: Infinity,
	frictionAir: 0,
	friction: 0,
	mass: 0,
}	

class Entity {
	constructor({ x, y, texture }, space, stage) {
		this.position = { x: x, y: y }
		this.texture = texture
		this.initView(stage)
		this.initPhysics(space)
	}

	initView(stage) {
		let sprite = Sprite.from(this.texture)
		sprite.anchor.set(0.5)
		this.size = { 
			width: sprite.texture.width/tilePixelsWidth,
			height: sprite.texture.height/tilePixelsWidth
		}
		this.canvasSize = { 
			width: this.size.width*tileSize, 
			height: this.size.height*tileSize
		}
		sprite.width = this.canvasSize.width
		sprite.height = this.canvasSize.height
		stage.addChild(sprite)
		this.sprite = sprite
	}

	initPhysics(space){
		let body = Matter.Bodies.rectangle(this.position.x, this.position.y, this.size.width, this.size.height, options)
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
			x: this.body.position.x*tileSize + 4*shift,
			y: this.body.position.y*tileSize + 4*shift 
		}
		this.sprite.position = this.canvasPosition
	}	
}

export default Entity