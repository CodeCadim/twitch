<svelte:options customElement="waiting-page" />

<script>
	import Clock from "./clock.svelte";

	// Début du stream = Date et Heure de référence
	const ReferenceTime = new Date("2025-12-10T11:00:00").getTime();

	const RemainingPhrase = "CodeCadim démarre dans";
	const DefaultPhrase = "CodeCadim";

	var random;
	var picsum_url;
	var RemainingTimeString = ""; // pour l'heure

	// every 60 seconds, regenerate a random number
	setInterval(() => (random = Math.floor(Math.random() * 1000)), 60000);

	// put that random number in the url to regenerate image background
	$: picsum_url = `"https://picsum.photos/367/267?grayscale&blur=6&${random}"`;

	// every second, recalculate time elapse
	setInterval(() => {
		RemainingTimeString = "";

		var now = new Date().getTime();
		var delta = ReferenceTime - now;
		if (delta >= 0) {
			var hours = Math.floor(
				(delta % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			);
			var minutes = Math.floor((delta % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((delta % (1000 * 60)) / 1000);

			if (hours > 0)
				RemainingTimeString +=
					hours + " heure" + (hours > 1 ? "s" : "");
			if (minutes > 0)
				RemainingTimeString +=
					" " + minutes + " minute" + (minutes > 1 ? "s" : "");
			if (seconds >= 0)
				RemainingTimeString +=
					" " + seconds + " seconde" + (seconds > 1 ? "s" : "");
		}
	}, 1000);
</script>

<main style:background-image="url({picsum_url})">
	<div id="shadow"></div>
	<div id="clockcontainer">
		<Clock />
	</div>
	<div id="text">
		{#if RemainingTimeString}
			<h1>{RemainingPhrase}</h1>
			<div id="clocktext">{RemainingTimeString}</div>
		{:else}
			<h1>
				{DefaultPhrase}
			</h1>
		{/if}
	</div>
</main>

<style>
	main {
		min-height: 100vh;
		padding: 0 1rem;
		background-repeat: no-repeat;
		background-size: cover;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	#shadow {
		z-index: 0;
		position: absolute;
		top: 0;
		left: 0;
		min-height: 100vh;
		min-width: 100%;
		background-color: rgb(85,0,255,0.2);
	}
	#clocktext {
		z-index: 99999;
		margin-top: 1rem;
		font-kerning: none;
		font-size: 2.5em;
	}
	#clockcontainer {
		z-index: 99999;
		max-width: 250px;
	}
	#text {
		z-index: 99999;
		margin-left: 4rem;
		padding: 3rem;
		color: #55007f;
		font-weight: bolder;
		background-color: rgb(255,255,255,0.3);
	}
</style>
