<template>
	<div id="stage"></div>
</template>

<script>
import Game from '../game-logic/Game.js'
import { onMounted } from 'vue'

export default {
	setup() {
		onMounted(() => {
			let game = new Game()
			game.attach()
			game.server.world.start()
		})
	}
}
</script>

<style>
canvas {
	width: 100%;
	height: 100%;
}
</style>