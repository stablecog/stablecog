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
	import { voiceoverSpeakerId } from '$ts/stores/voiceover/voiceoverSettings';
	import { voiceoverLocale, voiceoverSpeakerIdToDisplayName } from '$ts/constants/voiceover/models';
	import IconSpeaker from '$components/icons/IconSpeaker.svelte';
	import { languageName } from '$ts/helpers/language';
	import { locale } from '$i18n/i18n-svelte';

	export let src: string;
	export let title: string | undefined = undefined;
	export let label: string;
	export let status: 'succeeded' | 'idle' = 'idle';
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
	$: [progress, audioArray, waveformContainerWidth, waveformContainerHeight],
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

	function drawWaveformWithCheck() {
		if (!audioArray) return;
		if (progress !== 0 && !progress) return;
		if (!waveformContainerWidth) return;
		if (!waveformContainerHeight) return;
		if (!pointCount) return;
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
			margin: { top: 0, left: 0, bottom: 0, right: 0 },
			values: audioArray
		});
	}

	async function setAudioArray() {
		if (!browser) return;
		if (!pointCount) return;
		audioArray = await audioToArray(src, pointCount);
	}

	onMount(async () => {
		await setAudioArray();
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
	class="w-full h-full bg-c-bg-secondary flex flex-col rounded-xl overflow-hidden relative z-0
	shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] {classes}"
>
	<div
		class="w-full flex flex-col px-5 {status === 'idle'
			? 'opacity-0 pointer-events-none'
			: 'opacity-100'}"
	>
		{#if title}
			<p
				class="text-c-on-bg/75 pt-4 pb-2 max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis"
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
				on:playing={() => (isPlaying = true)}
				on:pause={() => (isPlaying = false)}
				bind:muted={isMuted}
			/>
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
			</div>
			<div class="flex-1" />
			<p class="text-c-on-bg/75">
				{currentTime ? currentTimestamp : '00:00'} <span class="text-c-on-bg/25">/</span>
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
					class="w-full h-full flex flex-col overflow-hidden relative {status === 'idle'
						? 'opacity-0 pointer-events-none'
						: 'opacity-100'}"
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
	<!-- Speaker -->
	<div
		class="w-full h-full absolute left-0 top-0 flex flex-col justify-start items-start p-3 {status ===
		'idle'
			? 'opacity-100'
			: 'opacity-0 pointer-events-none'}"
	>
		<div class="flex items-center gap-4 bg-c-bg-secondary p-2 rounded-xl">
			<IconSpeaker
				sizes="64px"
				class="w-16 h-16 rounded-lg shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] ring-2 ring-c-bg-tertiary"
				type={$voiceoverSpeakerId}
			/>
			<p class="text-c-on-bg/50 font-base pr-4">
				<span class="text-c-on-bg/75 font-medium"
					>{$voiceoverSpeakerIdToDisplayName[$voiceoverSpeakerId]}</span
				>
				will be speaking in
				<span class="text-c-on-bg/75 font-medium">{languageName($locale).of($voiceoverLocale)}</span
				>.<br />The voiceover will appear here.
			</p>
		</div>
	</div>
</div>
