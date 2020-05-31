import World from './World.js'
import mapJSON from '../assets/map.json'

export let getServer

class Server {
	
	constructor(stage) {
		this.world = new World(stage)
		this.world.loadMap(mapJSON)

		getServer = () => this
	}
}

export default Server