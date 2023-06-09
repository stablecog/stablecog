<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import {
		audioToArray,
		convertSecondsToTimestamp,
		drawWaveform,
		toggleMute,
		togglePlay
	} from '$components/voiceover/audioPlayer/helpers';
	import SliderForWaveform from '$components/voiceover/audioPlayer/SliderForWaveform.svelte';
	import PlayPauseButton from '$components/voiceover/audioPlayer/PlayPauseButton.svelte';
	import MuteButton from '$components/voiceover/audioPlayer/MuteButton.svelte';
	import { allAudioPlayers } from '$ts/stores/allPlayers';
	import { browser } from '$app/environment';
	import {
		voiceoverSpeakerIdToDisplayName,
		type TVoiceoverSpeakerId
	} from '$ts/constants/voiceover/models';
	import IconSpeaker from '$components/icons/IconSpeaker.svelte';
	import type { TVoiceoverStatus } from '$ts/stores/user/voiceovers';
	import AudioPlayerWithWaveformPlaceholder from '$components/voiceover/audioPlayer/AudioPlayerWithWaveformPlaceholder.svelte';
	import { tick } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export let src: string | undefined;
	export let title: string | undefined = undefined;
	export let label: string;
	export let status: TVoiceoverStatus | undefined = undefined;
	export let speakerId: TVoiceoverSpeakerId;
	export { classes as class };
	let classes = '';

	const barWidth = 20;
	let currentTime = 0;
	let duration: number;
	let sliderValue = 0;
	let audioElement: HTMLAudioElement;
	let isPlaying = false;
	let audioArray: number[] | undefined = undefined;
	let isMuted = false;

	let waveformContainer: HTMLDivElement;
	let waveformContainerWidth: number | undefined;
	let waveformContainerHeight: number | undefined;

	let playButton: HTMLButtonElement;
	let muteButton: HTMLButtonElement;

	let sliderContainerWidth: number;
	let sliderContainerHeight: number;

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
		showPlaceholder
	],
		drawWaveformWithCheck();

	$: pointCount = waveformContainerWidth
		? Math.floor(waveformContainerWidth / barWidth)
		: undefined;

	function onCurrentTimeChanged() {
		sliderValue = progressPercentage;
	}

	function onSliderValueChanged() {
		const toBeTime = (sliderValue / 100) * duration;
		currentTime = toBeTime;
	}

	let audioStatus: 'being-created' | 'created' | 'idle';
	$: audioStatus =
		status === 'to-be-submitted' || status === 'server-received' || status === 'server-processing'
			? 'being-created'
			: status === 'succeeded'
			? 'created'
			: 'idle';

	$: showPlaceholder = audioStatus !== 'created';

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

	async function setAudioArray() {
		if (!browser) return;
		if (!pointCount) return;
		if (!src) return;
		audioArray = await audioToArray(src, pointCount);
	}

	onMount(async () => {
		$allAudioPlayers.add(audioElement);
	});

	onDestroy(() => {
		$allAudioPlayers.delete(audioElement);
	});
</script>

<audio
	{src}
	aria-label={label}
	bind:currentTime
	bind:duration
	bind:this={audioElement}
	on:playing={() => (isPlaying = true)}
	on:pause={() => (isPlaying = false)}
	bind:muted={isMuted}
/>
<div
	on:keydown={(e) => {
		if (e.target === playButton || e.target === muteButton) return;
		if (e.key === ' ') {
			togglePlay(audioElement);
		}
	}}
	class="w-full h-full bg-c-bg-secondary flex flex-col rounded-xl overflow-hidden relative z-0
		shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] {classes}"
>
	{#if showPlaceholder}
		<div
			transition:scale={{ duration: 300, easing: cubicOut, start: 0.9 }}
			class="w-full h-full absolute left-0 top-0 bg-c-bg-secondary"
		>
			<AudioPlayerWithWaveformPlaceholder {speakerId} />
		</div>
	{:else}
		<div
			transition:scale={{ duration: 300, easing: cubicOut, start: 1.1 }}
			class="w-full h-full flex flex-col bg-c-bg-secondary z-10"
		>
			<div
				class="w-full flex flex-col px-5 {showPlaceholder
					? 'opacity-0 pointer-events-none'
					: 'opacity-100'}"
			>
				<p
					class="text-c-on-bg pt-4 pb-2 max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis"
				>
					{title}
				</p>
				<div class="w-full flex items-center justify-center">
					<div class="flex items-center -ml-3">
						<PlayPauseButton
							bind:element={playButton}
							onClick={() => togglePlay(audioElement)}
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
							<div class="w-full h-0" bind:this={waveformContainer} />
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
		</div>
	{/if}
</div>
