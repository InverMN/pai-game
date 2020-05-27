import Matter from 'matter-js'
import Wall from './Wall.js'
import Floor from './Floor.js'
import Entity from './Entity.js'
import Player from './Player.js'
import TNT from './TNT.js'

export const tileSize = 50
export const textureWidth = 20
export const faceWidth = 17
export const ratio = textureWidth/faceWidth
export const shift = tileSize*(ratio - 1)
export const tilePixelsWidth = 16

export let placeTNT = null

class World {
	engine = Matter.Engine.create()
	space = this.engine.world
	runner = Matter.Runner.create()

	constructor(stage) {
		this.space.gravity.scale = 0
		this.stage = stage

		placeTNT = (x, y) => {
			new TNT(x, y, this.space, this.stage, this)
		}
	}

	loadMap(map) {		
		this.map = map
		this.meta = map.meta
		this.materials = map.materials

		this.floor = this.placeFloor()

		const firstPlayerControls = {
			up: 'w',
			down: 's',
			right: 'd',
			left: 'a',
			place: ' '
		}

		this.entities = [new Player({ x: 1, y: 1, texture: 'point.png'}, firstPlayerControls, this.space, this.stage)]
		this.spawnEntity(1, 1)
		this.walls = this.buildWalls()
	}

	buildWalls() {

		var walls = [];

		this.map.walls.forEach((column, y) => {
			let wallsRow = []

			for(let x = 0; x < this.map.meta.size; x++)
				wallsRow.push(null)

			column.forEach((wall, x) => {
				if(wall) wallsRow[x] = (new Wall(x, y, this.materials[wall], this.space, this.stage))
			})
			walls.push(wallsRow)
		})

		return walls
	}

	placeFloor() {
		let floor = []

		if(this.map.floor) {
			this.map.floor.forEach((column, y) => {
				let floorRow = []
				column.forEach((tile, x) => {
					if(tile) floorRow.push(new Floor(x, y, this.materials[tile], this.stage))
					else if(this.map.default_floor) floorRow.push(new Floor(x, y, this.materials[this.map.default_floor], this.stage))
				})
				floor.push(floorRow)
			})
		} else {
			for(let x = 0; x < this.map.meta.size; x++) {
				let floorRow = []
				for(let y = 0; y < this.map.meta.size; y++) {
					floorRow.push(new Floor(x, y, this.materials[this.meta.default_floor], this.stage))
				}
				floor.push(floorRow)
			}
		}

		return floor
	}

	explosion(x, y, power) {

		let explosionEndpoints = {}

		for(let inX = x+1; inX < power+x; inX++) {
			if(this.getBlock(inX, y)) {
				if(this.removeBlock(inX, y))
					explosionEndpoints.left = { x: inX, y: y}
				else 
					explosionEndpoints.left = { x: inX-1, y: y}

				break
			} else if(inX == power) 
				explosionEndpoints.left = { x: inX, y: y}
		}

		for(let inY = y+1; inY < power+y; inY++) {
			if(this.getBlock(x, inY)) {
				if(this.removeBlock(x, inY))
					explosionEndpoints.down = { x: x, y: inY}
				else 
					explosionEndpoints.down = { x: x, y: inY-1 }
					
				break
			} else if(inY == power) 
				console.log('test')

				explosionEndpoints.down = { x: x, y: inY}
		}

		for(let inX = x-1; inX > -power-x; inX--) {
			if(this.getBlock(inX, y)) {
				if(this.removeBlock(inX, y))
					explosionEndpoints.right = { x: inX, y: y}
				else 
					explosionEndpoints.right = { x: inX+1, y: y}

				break
			} else if(inX == power) 
				explosionEndpoints.right = { x: inX, y: y}
		}

		for(let inY = y-1; inY > -power-y; inY--) {
			if(this.getBlock(x, inY)) {
				if(this.removeBlock(x, inY))
					explosionEndpoints.up = { x: x, y: inY}
				else 
					explosionEndpoints.up = { x: x, y: inY+1 }
					
				break
			}else if(inY == power) 
				explosionEndpoints.up = { x: x, y: inY}
		}

		for(let inX = x+1; inX <= explosionEndpoints.left.x; inX++) {
			if(inX == explosionEndpoints.left.x) 	
				this.spawnEntity(inX, y)
			else 
				this.spawnEntity(inX, y)
		} 

		for(let inY = y+1; inY <= explosionEndpoints.down.y; inY++) {
			if(inY == explosionEndpoints.left.y) 	
				this.spawnEntity(x, inY)
			else 
				this.spawnEntity(x, inY)
		} 

		for(let inX = x-1; inX >= explosionEndpoints.right.x; inX--) {
			if(inX == explosionEndpoints.right.x) 	
				this.spawnEntity(inX, y)
			else 
				this.spawnEntity(inX, y)
		} 

		for(let inY = y-1; inY >= explosionEndpoints.up.y; inY--) {
			if(inY == explosionEndpoints.up.y) 	
				this.spawnEntity(x, inY)
			else 
				this.spawnEntity(x, inY)
		} 
	}

	getBlock(x, y) {
		return this.walls[y][x]
	}

	removeBlock(x, y) {
		let block = this.getBlock(x, y)
		if(block) {
			return block.remove()
		} else return true
	}

	spawnEntity(x, y) {
		this.entities.push(new Entity({ x: x, y: y, texture: 'http://localhost:8080/ball.png' }, this.space, this.stage))
	}

	start() {
		Matter.Runner.run(this.runner, this.engine)
		setTimeout(() => {
			// this.explosion(2, 2, 10)
		}, 2000)
	}
	
	stop() {
		Matter.Runner.stop(this.runner)
	}
}

export default World