<template>
	<div>
		<div id="stage"></div>
		<h1 v-show="isEnd">{{ endMessage }}</h1>
	</div>
</template>

<script>
import Game from '../game-logic/Game.js'
import { onMounted, ref } from 'vue'

export let win

export default {
	setup() {
		let game
		onMounted(() => {
			game = new Game()
			game.attach()
			game.server.world.start()
		})

		let endMessage = ref('')
		let isEnd = ref(false)

		win = playerId => {
			if(playerId == 1) {
				endMessage.value = ('Red player wins!')
			} else {
				endMessage.value = ('Blue player wins!')
			}
			isEnd.value = true
			game.server.world.stop()
		}

		return { endMessage, isEnd }
	}
}
</script>

<style>
canvas {
	width: 100%;
	height: 100%;
}

h1 { 
	display: block;
	padding: 50px;
	background-color: black;
	border-radius: 30px;
	color: white;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	z-index: 10000;
}
</style>