<script>
	let value

	async function roll() {
		const response = await fetch('/roll')
		value = await response.json()
	}
</script>

<section>
	<button on:click={roll}>Button</button>
	<p>You rolled a {value}</p>
</section>
