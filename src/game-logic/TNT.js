import Entity from './Entity.js'

class TNT extends Entity {
	constructor(x, y, space, stage, world) {
		super({ x: Math.floor(x), y: Math.floor(y), texture: 'http://localhost:8080/ball.png' }, space, stage)
		setTimeout(() => {
			world.explosion(Math.floor(x), Math.floor(y), 10)
			// this.sprite = null
		}, 2000)
	}
}

export default TNT