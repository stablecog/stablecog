<script lang="ts">
	import Slider from '$components/audioPlayer/Slider.svelte';
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import IconPause from './IconPause.svelte';
	import IconPlay from './IconPlay.svelte';

	export let src: string;

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

<div class="w-full bg-c-bg-secondary pl-2 pr-4 py-2 flex flex-col rounded-xl">
	<p
		class="pl-2 text-c-on-bg/75 py-1 max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis"
	>
		Benim Türk milletine pek de bir saygım falan da yoktur onu da söyliyim.
	</p>
	<div class="w-full flex items-center justify-center">
		<audio
			{src}
			bind:currentTime
			bind:duration
			bind:this={audioFile}
			on:playing={() => (isPlaying = true)}
			on:pause={() => (isPlaying = false)}
		/>
		<button on:click={togglePlay} class="relative rounded-full group w-10 h-10">
			<ButtonHoverEffect size="sm" noPadding color="primary" />
			<div class="p-2">
				{#if isPlaying}
					<IconPause
						class="w-full h-full transition text-c-on-bg not-touch:group-hover:text-c-primary"
					/>
				{:else}
					<IconPlay
						class="w-full h-full transition text-c-on-bg not-touch:group-hover:text-c-primary"
					/>
				{/if}
			</div>
		</button>
		<div class="flex-1 self-stretch pl-2 pr-4">
			<div class="w-full h-full flex items-center relative">
				<Slider min={0} max={100} name="Audio Player" bind:value={sliderValue} step={1} />
			</div>
		</div>
		<p class="text-sm text-c-on-bg/75">
			{currentTime ? currentTimestamp : '00:00'} <span class="text-c-on-bg/50">/</span>
			{duration ? totalTimestamp : '00:00'}
		</p>
	</div>
</div>
