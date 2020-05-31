import Matter from 'matter-js'

import Assets from './Assets.js'
import Wall from './Wall.js'
import Floor from './Floor.js'
import Entity from './Entity.js'

export const tileSize = 50
export const textureWidth = 20
export const faceWidth = 17
export const ratio = textureWidth/faceWidth
export const shift = tileSize*(ratio - 1)
export const tilePixelsWidth = 16

export let getWorld
export let getStage
export let getSpace

class World {
	engine = Matter.Engine.create()
	space = this.engine.world
	runner = Matter.Runner.create()

	constructor(stage) {
		getWorld = () => this
		getStage = () => this.stage
		getSpace = () => this.space
		
		this.space.gravity.scale = 0
		this.stage = stage
	}

	loadMap(map) {		
		new Assets(map.assets)

		this.meta = map.meta

		setTimeout(() => {
			this.floor = this.placeFloor(map.floor)
			
			this.players = [this.summon('playerBlue', 1, 1).body, this.summon('playerRed', 10, 10).body]

			this.walls = this.buildWalls(map.walls)
		}, 1000)
	}

	buildWalls(walls) {
		var wallsAll = []

		walls.forEach((column, y) => {
			let wallsRow = []

			for(let x = 0; x < this.meta.size; x++)
				wallsRow.push(null)

			column.forEach((wall, x) => {
				if(wall) wallsRow[x] = new Wall(wall, x, y)
			})
			wallsAll.push(wallsRow)
		})

		return wallsAll
	}

	placeFloor(floor) {
		let floorAll = []

		if(floor) {
			floor.forEach((column, y) => {
				let floorRow = []
				column.forEach((name, x) => {
					if(name) floorRow.push(new Floor(name, x, y))
					else if(this.meta.defaultFloor) floorRow.push(floorRow.push(new Floor(this.meta.defaultFloor, x, y)))
				})
				floor.push(floorRow)
			})
		} else {
			for(let x = 0; x < this.meta.size; x++) {
				let floorRow = []
				for(let y = 0; y < this.meta.size; y++) {
					floorRow.push(new Floor(this.meta.defaultFloor, x, y))
				}
				floorAll.push(floorRow)
			}
		}

		return floorAll
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

		for(let inX = x; inX <= explosionEndpoints.left.x; inX++) {
			if(inX == explosionEndpoints.left.x) 	
				this.summon('explosion', inX, y)
			else 
				this.summon('explosion', inX, y)
		} 

		for(let inY = y+1; inY <= explosionEndpoints.down.y; inY++) {
			if(inY == explosionEndpoints.left.y) 	
				this.summon('explosion', x, inY)
			else 
				this.summon('explosion', x, inY)
		} 

		for(let inX = x-1; inX >= explosionEndpoints.right.x; inX--) {
			if(inX == explosionEndpoints.right.x) 	
				this.summon('explosion', inX, y)
			else 
				this.summon('explosion', inX, y)
		} 

		for(let inY = y-1; inY >= explosionEndpoints.up.y; inY--) {
			if(inY == explosionEndpoints.up.y) 	
				this.summon('explosion', x, inY)
			else 
				this.summon('explosion', x, inY)
		} 
	}

	getBlock(x, y) {
		return this.walls[y][x]
	}

	removeBlock(x, y) {
		let block = this.getBlock(x, y)
		if(block) {
			let result = block.remove()
			if(result) {
				this.walls.forEach((row, y) => {
					let x = row.indexOf(block)
					this.walls[y][x] = null
				})
			}
			return result
		} else return true
	}

	summon(name, x, y) {
		return new Entity(name, x, y)
	}

	start() {
		Matter.Runner.run(this.runner, this.engine)
	}
	
	stop() {
		Matter.Runner.stop(this.runner)
	}
}

export default World