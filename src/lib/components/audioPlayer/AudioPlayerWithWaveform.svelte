<script lang="ts">
	import { onMount } from 'svelte';
	import {
		audioToArray,
		convertSecondsToTimestamp,
		drawWaveform,
		toggleMute,
		togglePlay
	} from '$components/audioPlayer/helpers';
	import SliderForWaveform from '$components/audioPlayer/SliderForWaveform.svelte';
	import PlayPauseButton from '$components/audioPlayer/PlayPauseButton.svelte';
	import AutoSize from '$components/AutoSize.svelte';
	import MuteButton from '$components/audioPlayer/MuteButton.svelte';
	import { windowHeight, windowWidth } from '$ts/stores/window';

	export let src: string;
	export let title: string | undefined = undefined;
	export let label: string;
	export { classes as class };
	let classes = '';

	let currentTime = 0;
	let duration: number;
	let sliderValue = 0;
	let audioFile: HTMLAudioElement;
	let isPlaying = false;
	let audioArray: number[] | undefined = undefined;
	let isMuted = false;

	let waveformContainer: HTMLDivElement;
	let waveformContainerWidth: number;
	let waveformContainerHeight: number;

	let sliderContainer: HTMLDivElement;

	const pointCount = 50;
	$: progress =
		(duration === 0 || duration) && (currentTime === 0 || currentTime) ? currentTime / duration : 0;
	$: progressPercentage = progress * 100;
	$: currentTimestamp =
		currentTime !== undefined
			? convertSecondsToTimestamp(currentTime)
			: convertSecondsToTimestamp(0);
	$: totalTimestamp = duration ? convertSecondsToTimestamp(duration) : undefined;

	$: [currentTime], onCurrentTimeChanged();
	$: [sliderValue], onSliderValueChanged();

	$: [progress, audioArray, waveformContainerWidth, waveformContainerHeight],
		drawWaveformWithCheck();

	function onCurrentTimeChanged() {
		sliderValue = progressPercentage;
	}

	function onSliderValueChanged() {
		const toBeTime = (sliderValue / 100) * duration;
		currentTime = toBeTime;
	}

	function drawWaveformWithCheck() {
		console.log('drawCalled');
		if (!audioArray) return;
		if (progress !== 0 && !progress) return;
		drawWaveform({
			element: waveformContainer,
			progress,
			width: waveformContainerWidth,
			height: waveformContainerHeight,
			gradientStops1: [
				{
					color: 'rgba(var(--c-primary) / 1)',
					offset: '0%'
				},
				{
					color: 'rgba(var(--c-primary) /0)',
					offset: '100%'
				}
			],
			gradientStops2: [
				{
					color: 'rgba(var(--c-on-bg) / 0.2)',
					offset: '0%'
				},
				{
					color: 'rgba(var(--c-on-bg) /0)',
					offset: '100%'
				}
			],
			margin: { top: 4, left: 0, bottom: 0, right: 0 },
			values: audioArray
		});
	}

	onMount(async () => {
		audioArray = await audioToArray(src, pointCount);
	});
</script>

<div
	class="w-full bg-c-bg-secondary flex flex-col rounded-xl overflow-hidden relative z-0
	shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] {classes}"
>
	<div class="w-full flex flex-col pl-2 pr-4 py-2">
		{#if title}
			<p
				class="pl-2 text-c-on-bg/75 py-1 max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis"
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
				bind:this={audioFile}
				on:playing={() => (isPlaying = true)}
				on:pause={() => (isPlaying = false)}
				bind:muted={isMuted}
			/>
			<PlayPauseButton onClick={() => togglePlay(audioFile)} {isPlaying} size="lg" />
			<MuteButton onClick={() => toggleMute(audioFile)} {isMuted} size="lg" />
			<div class="flex-1" />
			<p class="text-c-on-bg/75 px-2">
				{currentTime ? currentTimestamp : '00:00'} <span class="text-c-on-bg/25">/</span>
				{duration ? totalTimestamp : '00:00'}
			</p>
		</div>
	</div>
	<div class="w-full flex-1 flex relative overflow-hidden">
		<div
			bind:clientWidth={waveformContainerWidth}
			bind:clientHeight={waveformContainerHeight}
			class="w-full h-full"
		>
			<div class="w-full h-full" bind:this={waveformContainer} />
		</div>
		<div class="w-full h-full flex items-center z-10 absolute left-0 top-0">
			<div bind:this={sliderContainer} class="w-full h-full flex flex-col">
				<AutoSize element={sliderContainer} let:clientHeight>
					<SliderForWaveform
						min={0}
						max={100}
						name="Audio Player"
						bind:value={sliderValue}
						step={0.001}
						height={clientHeight}
					/>
				</AutoSize>
			</div>
		</div>
	</div>
</div>
