import Entity from "./Entity.js"
import Controller from './Controller.js'

class Player extends Entity {
	constructor(basics, controls, space, stage) {
		super(basics, space, stage)
		this.controller = new Controller(controls)
		this.controller.target = this
	}
}

export default Player