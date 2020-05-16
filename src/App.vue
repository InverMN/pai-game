<template>
  <div id="app">
    <stage></stage>
  </div>
</template>

<script>
import Stage from './components/Stage.vue'
export default {
	components: {
		Stage
	}
}
</script>

<style>
* {
	margin: 0;
	padding: 0;
}

body { 
	height: 100%;
}
</style>