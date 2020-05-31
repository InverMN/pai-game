import { Sprite	 } from 'pixi.js'
import Matter from 'matter-js'
import { shift, tileSize, tilePixelsWidth, getSpace, getStage, getWorld } from './World.js'
import { getAssets } from './Assets.js'
import Controller from './Controller.js'
import { win } from '../components/Stage.vue'

const options = {
	inertia: Infinity,
	frictionAir: 0,
	friction: 0,
	mass: 1,
}	

class Entity {
	constructor(name, x, y) {
		let properties = getAssets().entity[name]
		
		this.position = { x: x, y: y }
		this.texture = properties.texture
		this.collide = properties.collide
		this.attract = properties.attract
		this.sensor = properties.sensor
		this.initView()
		this.initPhysics()
		
		//Add controller
		if(properties.controller) {
			this.initController(properties.controller)
		}
		
		if(properties.events) {
			if(properties.events.init) {
				this.onInit = eval(`(self, world) => { ${properties.events.init} }`)
				this.onInit(this, getWorld())
			}
		}
		
		//hard coded player dmg
		if(name == "explosion") {
			let collidedPlayers = Matter.Query.collides(this.body, getWorld().players)

			if(collidedPlayers[0] != undefined) {
				win(collidedPlayers[0].bodyA.id)
			}
		}
	}

	initView() {
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
		getStage().addChild(sprite)
		this.sprite = sprite
	}

	initPhysics(){
		let body = Matter.Bodies.rectangle(this.position.x, this.position.y, this.size.width * 1.05, this.size.height * 1.05, options)
		Matter.World.add(getSpace(), body)
		body.isSensor = this.sensor

		if(!this.collide) 
			body.collisionFilter = {
				group: -1,
				category: 2,
				mask: 0,
			}
		
		this.body = body

		setInterval(() => {
			this.update()
		}, 17)
	}

	update() {
		if(this.attract){
			Matter.Body.setPosition(this.body, {
				x: Math.floor(this.body.position.x),
				y: Math.floor(this.body.position.y)
			})
		}

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

	initController(settings) {
		this.controller = new Controller(this, settings)
	}

	remove() {
		this.sprite.parent.removeChild(this.sprite)
		Matter.World.remove(getSpace(), this.body)
	}
}

export default Entity