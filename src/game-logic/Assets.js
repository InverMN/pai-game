import { Texture } from 'pixi.js'

export let getAssets

class Assets {
	floor = {}
	wall = {}
	entity = {}
	particle = {}

	constructor(raw) {
		this.load(raw)		
		getAssets = () => this
	}

	async loadTexture(url) {
		return Texture.from(url)
	}
	
	async addFloor(name, properties) {
		this.floor[name] = {
			texture: await this.loadTexture(properties.texture),
		}
	}

	async addWall(name, properties) {
		this.wall[name] = {
			texture: await this.loadTexture(properties.texture),
			unbreakable: properties.unbreakable || false,
		}
	}

	async addEntity(name, properties) {
		this.entity[name] = {
			texture: await this.loadTexture(properties.texture),
			collide: properties.collide || false,
			attract: properties.attract || false,
			events: properties.events || null,
			controller: properties.controller || null,
			sensor: properties.sensor || false,
		}
	}

	load(raw) {
		let debug = true
		
		const floor = raw.floor
		for(const name in floor) {
			this.addFloor(name, floor[name])
			if(debug) console.log(`Registering floor: ${name}`)
		}

		const wall = raw.wall
		for(const name in wall) {
			this.addWall(name, wall[name])
			if(debug) console.log(`Registering wall: ${name}`)
		}

		const entity = raw.entity
		for(const name in entity) {
			this.addEntity(name, entity[name])
			if(debug) console.log(`Registering entity: ${name}`)
		}
	}
}

export default Assets