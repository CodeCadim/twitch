<svelte:options customElement="waiting-page" />

<script>
	import Clock from "./clock.svelte";

	const today = new Date();

	// wednesday at 11h
	const nextWednesdayStreamDate = getNextDayOfWeek(today, 11, 0, 0, 3); // wednesday
	console.log(nextWednesdayStreamDate);

	// thursday at 17h
	const nextThursdayStreamDate = getNextDayOfWeek(today, 17, 0, 0, 4); // thursday
	console.log(nextThursdayStreamDate);

	let nextStream;
	if (nextThursdayStreamDate > nextWednesdayStreamDate) {
		nextStream = nextWednesdayStreamDate;
	} else {
		nextStream = nextThursdayStreamDate;
	}

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
		var delta = nextStream - now; // la différence est en millisecondes

		// astuce : 36e5 représente 60*60*1000 soit 1h exprimée en millisecondes
		if (delta >= 0 && delta < 24*36e5) {
			var hours = Math.floor(
				(delta % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
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
	/**
	 * Gets the date of the next occurrence of a specific day of the week.
	 * @param {Date} startDate The date to start searching from.
	 * @param {number} dayOfWeek The target day of the week (0=Sunday, 1=Monday, ...).
	 * @returns {Date} The date of the next occurrence of that day.
	 */
	function getNextDayOfWeek(startDate, startHour, startMin, StartSec, dayOfWeek) {
		// Clone the date so we don't mutate the original
		const date = new Date(startDate.getTime());
		date.setHours(startHour,startMin,StartSec);

		const currentDay = date.getDay();
		let daysToAdd = dayOfWeek - currentDay;

		// If the day is today or has already passed this week, add 7 days
		if (daysToAdd <= 0) {
			daysToAdd += 7;
		}

		date.setDate(date.getDate() + daysToAdd);

		return date;
	}
</script>

<main style:background-image="url({picsum_url})">
	<div id="shadow"></div>
	<div id="clockcontainer">
		<Clock />
	</div>
	<div id="text">
		{DefaultPhrase}
		{#if RemainingTimeString}
			<h1>{RemainingPhrase}</h1>
			<div id="clocktext">{RemainingTimeString}</div>
		{:else}
			<h1>
				Prochain Stream<br/>
				{nextStream.toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"})}
				à
				{nextStream.toLocaleTimeString(undefined,{hour:"numeric"})}
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
		background-color: rgb(85, 0, 255, 0.2);
	}
	#clocktext {
		z-index: 99999;
		margin-top: 1rem;
		font-kerning: none;
		font-size: 2.5em;
	}
	#clockcontainer {
		z-index: 99999;
	}
	#text {
		z-index: 99999;
		margin-left: 4rem;
		padding: 3rem;
		color: #55007f;
		font-weight: bolder;
		background-color: rgb(255, 255, 255, 0.3);
	}
</style>
