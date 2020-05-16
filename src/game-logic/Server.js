import World from './World.js'
import mapJSON from '../assets/map.json'

class Server {
	constructor(stage) {
		this.world = new World(stage)
		this.world.loadMap(mapJSON)
	}
}

export default Server