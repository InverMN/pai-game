import { Body, Vector } from 'matter-js'
import { getWorld } from './World.js';

class Controller {
	target = null
	axis = Vector.create(0, 0)
	pressedKeys = []

	updateMovement() {
		this.axis = Vector.create(0, 0)

		if(this.pressedKeys[this.controls.up]) this.axis.y -= this.vars.speed

		if(this.pressedKeys[this.controls.down]) this.axis.y += this.vars.speed

		if(this.pressedKeys[this.controls.right]) this.axis.x += this.vars.speed

		if(this.pressedKeys[this.controls.left]) this.axis.x -= this.vars.speed

		Body.setVelocity(this.target.body, this.axis)
	}

	dropTNT() {
		getWorld().summon('tnt', this.target.position)
	}

	constructor(puppet, settings) {
		this.controls = { 
			up: settings.up,
			down: settings.down,
			right: settings.right,
			left: settings.left
		}
		this.target = puppet
		this.vars = settings.vars
		
		for(const property in settings.actions) {
			document.addEventListener('keydown', event => {
				if(event.key == property) {
					let action = eval(`(self, vars, world) => { ${settings.actions[property]} }`)
					action(this.target, this.vars, getWorld())
				} 
			})
		}

		document.addEventListener('keydown', event => this.pressedKeys[event.key] = true )
		document.addEventListener('keyup', event => this.pressedKeys[event.key] = false )

		setInterval(() => this.updateMovement(), 10)
	}

}

export default Controller