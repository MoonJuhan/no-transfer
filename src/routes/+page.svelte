<script>
	import { onMount } from 'svelte'
	import axios from 'axios'
	import mapboxgl from 'mapbox-gl'
	import 'mapbox-gl/dist/mapbox-gl.css'

	async function roll() {
		const { data } = await axios.get('/bus-stations', {
			params: {
				tmX: '127.0276476',
				tmY: '37.498025',
				radius: '500',
			},
		})

		console.log(data)
	}

	onMount(() => {
		mapboxgl.accessToken = process.env.MAPBOX_API_KEY

		new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/streets-v12',
			center: [127.0276476, 37.498025],
			zoom: 9,
			language: 'ko',
		})
	})
</script>

<div id="map" />

<!-- <button on:click={roll}>Button</button> -->

<style>
	#map {
		width: 100vw;
		height: 100vh;
	}
</style>
