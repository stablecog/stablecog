<script lang="ts">
	import MuteButton from '$components/voiceover/audioPlayer/MuteButton.svelte';
	import PlayPauseButton from '$components/voiceover/audioPlayer/PlayPauseButton.svelte';
	import Slider from '$components/voiceover/audioPlayer/Slider.svelte';
	import {
		areValuesCloseEnough,
		convertSecondsToTimestamp,
		toggleMute,
		togglePlay
	} from '$components/voiceover/audioPlayer/helpers';
	import { allAudioPlayers } from '$ts/stores/allPlayers';
	import { onDestroy, onMount } from 'svelte';

	export let src: string;
	export let title: string | undefined = undefined;
	export let label: string;
	export let hasMute = false;

	let playButton: HTMLButtonElement;
	let muteButton: HTMLButtonElement;

	let currentTime = 0;
	let duration: number;
	let sliderValue = 0;
	let audioElement: HTMLAudioElement;
	let isPlaying = false;
	let isMuted = false;

	$: progress =
		(duration === 0 || duration) && (currentTime === 0 || currentTime) ? currentTime / duration : 0;
	$: progressPercentage = progress * 100;
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

	onMount(() => {
		$allAudioPlayers.add(audioElement);
	});

	onDestroy(() => {
		$allAudioPlayers.delete(audioElement);
	});
</script>

<div
	on:keydown={(e) => {
		if (e.target === playButton || e.target === muteButton) return;
		if (e.key === ' ') {
			togglePlay(audioElement);
		}
	}}
	class="w-full bg-c-bg-secondary px-4 py-2 flex flex-col rounded-xl
	shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]"
>
	{#if title}
		<p
			class="text-sm text-c-on-bg/75 py-1 max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis"
		>
			{title}
		</p>
	{/if}
	<div class="w-full flex items-center justify-center">
		<audio
			{src}
			aria-label={label}
			bind:currentTime
			bind:duration
			bind:this={audioElement}
			bind:muted={isMuted}
			preload="metadata"
			on:playing={() => (isPlaying = true)}
			on:pause={() => (isPlaying = false)}
		/>
		<div class="flex items-center -ml-2">
			<PlayPauseButton
				bind:element={playButton}
				onClick={() => togglePlay(audioElement)}
				{isPlaying}
			/>
			{#if hasMute}
				<MuteButton bind:element={muteButton} onClick={() => toggleMute(audioElement)} {isMuted} />
			{/if}
		</div>
		<div class="flex-1 self-stretch pl-2 pr-4">
			<div class="w-full h-full flex items-center relative">
				<Slider min={0} max={100} name="Audio Player" bind:value={sliderValue} step={0.001} />
			</div>
		</div>
		<p class="text-xs text-c-on-bg/75">
			{currentTime ? currentTimestamp : '00:00'} <span class="text-c-on-bg/25">/</span>
			{duration ? totalTimestamp : '00:00'}
		</p>
	</div>
</div>
