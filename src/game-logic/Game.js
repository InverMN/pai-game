import * as Pixi from 'pixi.js'
import Server from './Server.js'

export let getGame

class Game {
	constructor() {
		this.app = new Pixi.Application({
			width: window.innerWidth,
			height: window.innerHeight,
			backgroundColor: 0x1099bb,
			resolution: window.devicePixelRatio || 1
		})	
		this.server = new Server(this.app.stage)

		getGame = () => this
	}
	attach() {
		document.querySelector('#stage').appendChild(this.app.view)
	}
	detach() {
		document.querySelector('#stage').innerHTML = ''
	}
}

export default Game