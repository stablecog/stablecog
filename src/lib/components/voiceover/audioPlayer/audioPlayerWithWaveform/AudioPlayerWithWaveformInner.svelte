<script lang="ts">
	import PlayPauseButton from '../PlayPauseButton.svelte';
	import {
		areValuesTooClose,
		convertSecondsToTimestamp,
		drawWaveform,
		toggleMute,
		togglePlay
	} from '$components/voiceover/audioPlayer/helpers';
	import MuteButton from '$components/voiceover/audioPlayer/MuteButton.svelte';
	import IconSpeaker from '$components/icons/IconVoiceoverSpeaker.svelte';
	import { voiceoverSpeakerIdToDisplayName } from '$ts/constants/voiceover/models';
	import SliderForWaveform from '$components/voiceover/audioPlayer/SliderForWaveform.svelte';
	import type { TVoiceoverFullOutput } from '$ts/stores/user/voiceovers';
	import { onDestroy } from 'svelte';
	import DownloadButton from '$components/voiceover/audioPlayer/DownloadButton.svelte';
	import { timestampPlaceholder } from '$components/voiceover/audioPlayer/constants';

	export let output: TVoiceoverFullOutput;
	export let audioElement: HTMLAudioElement;
	export let isMuted: boolean;
	export let isPaused: boolean;
	export let isPlaying: boolean;
	export let playButton: HTMLButtonElement;
	export let muteButton: HTMLButtonElement;
	export let currentTime: number;
	export let duration: number;
	export let pointCount: number | undefined;
	export let audioArray: number[] | undefined;

	let sliderValue = 0;
	let waveformContainer: HTMLDivElement;
	let waveformContainerWidth: number | undefined = undefined;
	let waveformContainerHeight: number | undefined = undefined;
	let currentTimestamp: string | undefined = undefined;
	let totalTimestamp: string | undefined = undefined;

	$: status = output.status;
	$: audioStatus =
		output.status === 'to-be-submitted' ||
		output.status === 'server-received' ||
		output.status === 'server-processing'
			? 'being-created'
			: output.status === 'succeeded'
				? 'created'
				: 'idle';

	$: progress =
		(duration === 0 || duration) && (currentTime === 0 || currentTime) ? currentTime / duration : 0;
	$: currentTimestamp =
		currentTime !== undefined
			? convertSecondsToTimestamp(currentTime)
			: convertSecondsToTimestamp(0);
	$: totalTimestamp = duration ? convertSecondsToTimestamp(duration) : undefined;

	$: [currentTime], onCurrentTimeChanged();
	$: [sliderValue], onSliderValueChanged();

	$: [
		progress,
		audioArray,
		waveformContainer,
		waveformContainerWidth,
		waveformContainerHeight,
		status,
		audioStatus !== 'created'
	],
		drawWaveformWithCheck();

	function onCurrentTimeChanged() {
		sliderValue = Math.floor(currentTime * 1000);
	}

	let sliderStoppedAudio = false;
	function onSliderValueChanged() {
		const toBeTime = sliderValue / 1000;
		if (areValuesTooClose(toBeTime, currentTime)) return;
		if (!audioElement.paused) {
			audioElement.pause();
			sliderStoppedAudio = true;
		}
		currentTime = toBeTime;
		progress = currentTime / duration;
	}

	function sliderOnPointerUp() {
		if (sliderStoppedAudio && audioElement.paused) {
			audioElement.play();
		}
		sliderStoppedAudio = false;
	}

	async function drawWaveformWithCheck() {
		if (progress !== 0 && !progress) return;
		if (!waveformContainer) return;
		if (!waveformContainerWidth) return;
		if (!waveformContainerHeight) return;
		if (!pointCount) return;
		if (!audioArray) return;
		drawWaveform({
			element: waveformContainer,
			width: waveformContainerWidth,
			height: waveformContainerHeight,
			margin: { top: 0, left: 0, bottom: 0, right: 0 },
			progress,
			gradientStops1: [
				{
					color: 'rgba(var(--c-primary) / 1)',
					offset: '0%'
				},
				{
					color: 'rgba(var(--c-primary) / 0)',
					offset: '100%'
				}
			],
			gradientStops2: [
				{
					color: 'rgba(var(--c-on-bg) / 0.2)',
					offset: '0%'
				},
				{
					color: 'rgba(var(--c-on-bg) / 0)',
					offset: '100%'
				}
			],
			values: audioArray
		});
	}

	onDestroy(() => {
		audioElement?.pause();
		isPlaying = false;
		isPaused = true;
		audioArray = undefined;
		currentTime = 0;
	});
</script>

<div class="flex w-full flex-col px-4 md:px-5">
	<div class="-ml-1 flex w-full items-center gap-3 pb-1.5 pt-3 md:gap-4 md:pb-3 md:pt-4">
		<div
			class="relative z-0 flex flex-shrink-0 items-center justify-start
			overflow-hidden rounded-md bg-c-bg-tertiary ring-2 ring-c-bg-tertiary"
		>
			<div
				class="relative z-0 h-8 w-8 flex-shrink-0 overflow-hidden shadow-lg shadow-c-shadow/[var(--o-shadow-strong)]
				ring-2 ring-c-bg-tertiary md:h-9 md:w-9"
			>
				<IconSpeaker
					class="h-full w-full"
					type={output.voiceover.speaker.id}
					sizes="(min-width: 768px) 36px, 32px"
				/>
			</div>
			<p
				class="h-full min-w-0 flex-shrink overflow-hidden overflow-ellipsis px-2.5 py-0.5 font-medium md:px-3.5 md:py-1"
			>
				{$voiceoverSpeakerIdToDisplayName[output.voiceover.speaker.id]}
			</p>
		</div>
		<p
			class="min-w-0 max-w-full flex-shrink overflow-hidden overflow-ellipsis whitespace-nowrap text-c-on-bg"
		>
			{output.voiceover.prompt.text}
		</p>
	</div>
	<div class="flex w-full items-center justify-center">
		<div class="-ml-3 flex items-center">
			<PlayPauseButton
				bind:element={playButton}
				onClick={() => togglePlay({ audioElement })}
				{isPaused}
				{isPlaying}
				size="lg"
			/>
			<MuteButton
				bind:element={muteButton}
				onClick={() => toggleMute(audioElement)}
				{isMuted}
				size="lg"
			/>
			{#if output}
				<DownloadButton size="lg" {output} />
			{/if}
		</div>
		<div class="flex-1" />
		<p class="text-c-on-bg/75">
			{currentTime ? currentTimestamp : timestampPlaceholder}<span
				class="px-[0.5ch] text-c-on-bg/35">/</span
			>{duration ? totalTimestamp : timestampPlaceholder}
		</p>
	</div>
</div>
<div class="relative flex w-full flex-1 overflow-hidden pt-2">
	<div class="relative h-full w-full">
		<div
			bind:clientWidth={waveformContainerWidth}
			bind:clientHeight={waveformContainerHeight}
			class="h-full w-full"
		>
			{#if waveformContainerWidth && waveformContainerHeight}
				<div class="h-0 w-full" bind:this={waveformContainer} />
			{/if}
		</div>
		<div class="absolute bottom-0 left-0 z-10 flex h-full w-full items-center">
			<div class="relative flex h-full w-full flex-col overflow-hidden opacity-100">
				<SliderForWaveform
					min={0}
					max={Math.floor(duration * 1000)}
					name="Audio Player"
					bind:value={sliderValue}
					step={1}
					onPointerUp={sliderOnPointerUp}
				/>
			</div>
		</div>
	</div>
</div>
