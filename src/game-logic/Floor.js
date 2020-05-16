import { reactive } from 'vue'
import { Sprite, settings, SCALE_MODES } from 'pixi.js'
settings.SCALE_MODE = SCALE_MODES.NEAREST;
import { tileSize, shift } from './World'

class Floor {
	constructor(x, y, { texture }, stage) {
		this.position = reactive({ x: x, y: y })
		this.canvasPosition = reactive({ x: x*tileSize, y: y*tileSize })
		this.texture = texture
		this.initView(stage)
	}
	initView(stage) {
		let sprite = Sprite.from(this.texture)
		sprite.anchor.set(0)
		sprite.x = this.canvasPosition.x + shift
		sprite.y = this.canvasPosition.y + shift
		sprite.width = tileSize
		sprite.height = tileSize
		stage.addChild(sprite)
	}
}

export default Floor