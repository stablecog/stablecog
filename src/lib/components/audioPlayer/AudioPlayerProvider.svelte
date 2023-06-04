<script lang="ts">
	export let src: string;
	export let label: string;
	export let title: string | undefined = undefined;

	let currentTime = 0;
	let duration: number;
	let sliderValue = 0;
	let audioFile: HTMLAudioElement;
	let isPlaying = false;

	$: progressPercentage = (currentTime / duration) * 100;
	$: currentTimestamp = currentTime ? convertSecondsToTimestamp(currentTime) : undefined;
	$: totalTimestamp = duration ? convertSecondsToTimestamp(duration) : undefined;

	$: [currentTime], onCurrentTimeChanged();
	$: [sliderValue], onSliderValueChanged();

	function onCurrentTimeChanged() {
		sliderValue = progressPercentage;
	}

	function onSliderValueChanged() {
		const toBeTime = (sliderValue / 100) * duration;
		if (!areValuesCloseEnough(toBeTime, currentTime)) {
			currentTime = toBeTime;
		}
	}

	function areValuesCloseEnough(a: number, b: number) {
		return Math.abs(a - b) < 0.1;
	}

	function togglePlay() {
		if (audioFile.paused) {
			audioFile.play();
		} else {
			audioFile.pause();
		}
	}

	function convertSecondsToTimestamp(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const remainingSeconds = Math.round(seconds % 60);

		const formattedMinutes = String(hours > 0 ? hours * 60 + minutes : minutes).padStart(2, '0');
		const formattedSeconds = String(remainingSeconds).padStart(2, '0');

		return hours > 0
			? `${String(hours).padStart(2, '0')}:${formattedMinutes}:${formattedSeconds}`
			: `${formattedMinutes}:${formattedSeconds}`;
	}
</script>

<slot
	{currentTimestamp}
	{progressPercentage}
	{currentTime}
	{sliderValue}
	{isPlaying}
	{src}
	{label}
	{title}
	{totalTimestamp}
	{duration}
/>
