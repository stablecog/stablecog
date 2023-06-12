<script lang="ts">
	import PlayPauseButton from '../PlayPauseButton.svelte';
	import {
		areValuesCloseEnough,
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
	import type { TVoiceoverOutput, TVoiceoverStatus } from '$ts/stores/user/voiceovers';
	import { browser } from '$app/environment';
	import type { TAudioStatus } from '$components/voiceover/audioPlayer/audioPlayerWithWaveform/types';
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { quadIn } from 'svelte/easing';

	export let title: string | undefined;
	export let audioElement: HTMLAudioElement;
	export let isMuted: boolean;
	export let isPaused: boolean;
	export let isPlaying: boolean;
	export let playButton: HTMLButtonElement;
	export let muteButton: HTMLButtonElement;
	export let currentTime: number;
	export let duration: number;
	export let speakerId: string;
	export let barWidth: number;
	export let status: TVoiceoverStatus | undefined;
	export let src: string | undefined;
	export let output: TVoiceoverOutput | undefined = undefined;
	export let audioStatus: TAudioStatus;
	export let audioArray: number[] | undefined = undefined;

	let sliderValue = 0;
	let sliderContainerWidth: number;
	let sliderContainerHeight: number;
	let waveformContainer: HTMLDivElement;
	let waveformContainerWidth: number | undefined = undefined;
	let waveformContainerHeight: number | undefined = undefined;
	let currentTimestamp: string | undefined = undefined;
	let totalTimestamp: string | undefined = undefined;

	$: pointCount = waveformContainerWidth
		? Math.floor(waveformContainerWidth / barWidth)
		: undefined;

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

	$: [src, pointCount], setAudioArray();
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
		sliderValue = progressPercentage;
	}

	function onSliderValueChanged() {
		const toBeTime = (sliderValue / 100) * duration;
		if (!areValuesCloseEnough(toBeTime, currentTime)) {
			currentTime = toBeTime;
		}
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
		audioArray = undefined;
		currentTime = 0;
	});
</script>

<div class="w-full flex flex-col px-5">
	<p class="text-c-on-bg pt-4 pb-2 max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis">
		{title}
	</p>
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
			<div class="px-3">
				<div
					class="rounded-md ring-2 ring-c-bg-tertiary bg-c-bg-tertiary overflow-hidden
								flex items-center justify-start relative z-0"
				>
					<div
						class="w-9 h-9 flex-shrink-0 ring-2 ring-c-bg-tertiary shadow-lg
								shadow-c-shadow/[var(--o-shadow-strong)] overflow-hidden relative z-0"
					>
						<IconSpeaker class="w-full h-full" type={speakerId} sizes="36px" />
					</div>
					<p
						class="flex-shrink min-w-0 overflow-hidden overflow-ellipsis font-medium px-3.5 py-1 h-full"
					>
						{$voiceoverSpeakerIdToDisplayName[speakerId]}
					</p>
				</div>
			</div>
		</div>
		<div class="flex-1" />
		<p class="text-c-on-bg/75">
			{currentTime ? currentTimestamp : '00:00'} <span class="text-c-on-bg/35">/</span>
			{duration ? totalTimestamp : '00:00'}
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
			<div
				bind:clientWidth={sliderContainerWidth}
				bind:clientHeight={sliderContainerHeight}
				class="w-full h-full flex flex-col overflow-hidden relative opacity-100"
			>
				{#if sliderContainerWidth && sliderContainerHeight}
					<SliderForWaveform
						min={0}
						max={100}
						name="Audio Player"
						bind:value={sliderValue}
						step={0.00001}
						height={sliderContainerHeight}
					/>
				{/if}
			</div>
		</div>
	</div>
</div>
