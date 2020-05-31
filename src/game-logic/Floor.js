import { reactive } from 'vue'
import { Sprite, settings, SCALE_MODES } from 'pixi.js'
settings.SCALE_MODE = SCALE_MODES.NEAREST;
import { tileSize, shift, getStage } from './World'
import { getAssets } from './Assets.js'

class Floor {
	constructor(name, x, y) {
		let properties = getAssets().floor[name]

		this.position = reactive({ x: x, y: y })
		this.canvasPosition = reactive({ x: x*tileSize, y: y*tileSize })
		this.texture = properties.texture
		this.initView()
	}
	initView() {
		let sprite = Sprite.from(this.texture)
		sprite.anchor.set(0)
		sprite.x = this.canvasPosition.x + shift
		sprite.y = this.canvasPosition.y + shift
		sprite.width = tileSize
		sprite.height = tileSize
		getStage().addChild(sprite)
	}
}

export default Floor