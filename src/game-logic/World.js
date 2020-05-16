import Matter from 'matter-js'
import Wall from './Wall.js'
import Floor from './Floor.js'
import Entity from './Entity.js'

export const tileSize = 50
export const textureWidth = 20
export const faceWidth = 17
export const ratio = textureWidth/faceWidth
export const shift = tileSize*(ratio - 1)
export const tilePixelsWidth = 16

class World {
	engine = Matter.Engine.create()
	space = this.engine.world
	runner = Matter.Runner.create()

	render = Matter.Render.create({
		element: document.querySelector('#stage'), 
		engine: this.engine, 
	})

	constructor(stage) {
		this.space.gravity.scale = 0
		this.stage = stage
	}

	loadMap(map) {		
		this.map = map
		this.meta = map.meta
		this.materials = map.materials

		this.floor = this.placeFloor()
		this.entities = [new Entity({ x: 1.5, y: 1.5, texture: 'http://localhost:8080/ball.png' }, this.space, this.stage), new Entity({ x: 1.5, y: 1.5, texture: 'http://localhost:8080/point.png' }, this.space, this.stage)]
		this.walls = this.buildWalls()
	}

	buildWalls() {
		let walls = []
		this.map.walls.forEach((column, y) => {
			let wallsRow = []
			column.forEach((wall, x) => {
				if(wall) wallsRow.push(new Wall(x, y, this.materials[wall], this.space, this.stage))
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

	start() {
		Matter.Runner.run(this.runner, this.engine)
	}
	
	stop() {
		Matter.Runner.stop(this.runner)
	}

	showPhysics() {
		Matter.Render.run(this.render)
	}
}

export default World