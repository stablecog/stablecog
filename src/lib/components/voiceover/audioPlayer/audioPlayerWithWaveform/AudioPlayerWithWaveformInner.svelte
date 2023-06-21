<script lang="ts">
	import PlayPauseButton from '../PlayPauseButton.svelte';
	import {
		areValuesTooClose,
		audioBufferToArray,
		audioToArray,
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
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { quadIn } from 'svelte/easing';
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
	export let barWidth: number;
	export let audioArray: number[] | undefined = undefined;

	let sliderValue = 0;
	let waveformContainer: HTMLDivElement;
	let waveformContainerWidth: number | undefined = undefined;
	let waveformContainerHeight: number | undefined = undefined;
	let currentTimestamp: string | undefined = undefined;
	let totalTimestamp: string | undefined = undefined;

	$: status = output.status;
	$: src = output.audio_file_url;
	$: audioStatus =
		output.status === 'to-be-submitted' ||
		output.status === 'server-received' ||
		output.status === 'server-processing'
			? 'being-created'
			: output.status === 'succeeded'
			? 'created'
			: 'idle';
	$: pointCount = waveformContainerWidth
		? Math.floor(waveformContainerWidth / barWidth)
		: undefined;

	$: progress =
		(duration === 0 || duration) && (currentTime === 0 || currentTime) ? currentTime / duration : 0;
	$: currentTimestamp =
		currentTime !== undefined
			? convertSecondsToTimestamp(currentTime)
			: convertSecondsToTimestamp(0);
	$: totalTimestamp = duration ? convertSecondsToTimestamp(duration) : undefined;

	$: [currentTime], onCurrentTimeChanged();
	$: [sliderValue], onSliderValueChanged();

	$: [output, pointCount], setAudioArray();
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

	async function setAudioArray() {
		if (!browser) return;
		if (!pointCount) return;
		if (!src) return;
		if (output?.audio_buffer) {
			audioArray = await audioBufferToArray(output.audio_buffer, pointCount);
		} else {
			audioArray = await audioToArray(src, pointCount);
		}
	}

	function onCurrentTimeChanged() {
		sliderValue = Math.floor(currentTime * 1000);
	}

	function onSliderValueChanged() {
		const toBeTime = sliderValue / 1000;
		if (areValuesTooClose(toBeTime, currentTime)) return;
		if (!audioElement.paused) {
			audioElement.pause();
		}
		currentTime = toBeTime;
		progress = currentTime / duration;
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

<div class="w-full flex flex-col px-4 md:px-5">
	<div class="w-full -ml-1 pt-3 md:pt-4 pb-1.5 md:pb-3 flex items-center gap-3 md:gap-4">
		<div
			class="flex-shrink-0 rounded-md ring-2 ring-c-bg-tertiary bg-c-bg-tertiary overflow-hidden
			flex items-center justify-start relative z-0"
		>
			<div
				class="w-9 h-9 flex-shrink-0 ring-2 ring-c-bg-tertiary shadow-lg
				shadow-c-shadow/[var(--o-shadow-strong)] overflow-hidden relative z-0"
			>
				<IconSpeaker class="w-full h-full" type={output.voiceover.speaker.id} sizes="36px" />
			</div>
			<p
				class="flex-shrink min-w-0 overflow-hidden overflow-ellipsis font-medium px-3.5 py-1 h-full"
			>
				{$voiceoverSpeakerIdToDisplayName[output.voiceover.speaker.id]}
			</p>
		</div>
		<p
			class="flex-shrink min-w-0 text-c-on-bg max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis"
		>
			{output.voiceover.prompt.text}
		</p>
	</div>
	<div class="w-full flex items-center justify-center">
		<div class="flex items-center -ml-3">
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
				class="text-c-on-bg/35 px-[0.5ch]">/</span
			>{duration ? totalTimestamp : timestampPlaceholder}
		</p>
	</div>
</div>
<div class="w-full flex-1 flex relative overflow-hidden pt-2">
	<div class="w-full h-full relative">
		<div
			bind:clientWidth={waveformContainerWidth}
			bind:clientHeight={waveformContainerHeight}
			class="w-full h-full"
		>
			{#if waveformContainerWidth && waveformContainerHeight}
				<div
					transition:fade|local={{ duration: 500, easing: quadIn }}
					class="w-full h-0"
					bind:this={waveformContainer}
				/>
			{/if}
		</div>
		<div class="w-full h-full flex items-center z-10 absolute left-0 bottom-0">
			<div class="w-full h-full flex flex-col overflow-hidden relative opacity-100">
				<SliderForWaveform
					min={0}
					max={Math.floor(duration * 1000)}
					name="Audio Player"
					bind:value={sliderValue}
					step={1}
				/>
			</div>
		</div>
	</div>
</div>
