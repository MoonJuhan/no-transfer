<script>
	import axios from 'axios'

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
</script>

<section>
	<button on:click={roll}>Button</button>
</section>
