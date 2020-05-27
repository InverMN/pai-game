import { Body, Vector } from 'matter-js'
import { placeTNT } from './World.js';

class Controller {
	target = null
	axis = Vector.create(0, 0)
	pressedKeys = []
	controls = {}
	speed = 0.05
	reload = 3000
	ready = 0

	updateMovement() {
		this.axis = Vector.create(0, 0)

		if(this.pressedKeys[this.controls.up]) this.axis.y -= this.speed

		if(this.pressedKeys[this.controls.down]) this.axis.y += this.speed

		if(this.pressedKeys[this.controls.right]) this.axis.x += this.speed

		if(this.pressedKeys[this.controls.left]) this.axis.x -= this.speed

		Body.setVelocity(this.target.body, this.axis)
	}

	placeTNT() {
		if(new Date().getTime() >= this.ready) {
			placeTNT(this.target.position.x, this.target.position.y)
			this.ready = new Date().getTime() + this.reload
		}
	}

	constructor(controls) {
		this.controls = controls

		window.onkeydown = event => {
			this.pressedKeys[event.key] = true
			if(event.key == this.controls.place) this.placeTNT()
			event.preventDefault()
		} 
		window.onkeyup = event => this.pressedKeys[event.key] = false

		setInterval(() => this.updateMovement(), 50)
	}

}

export default Controller