<script lang="ts">
	import IconSpeaker from '$components/icons/IconSpeaker.svelte';
	import MuteButton from '$components/voiceover/audioPlayer/MuteButton.svelte';
	import PlayPauseButton from '$components/voiceover/audioPlayer/PlayPauseButton.svelte';
	import Slider from '$components/voiceover/audioPlayer/Slider.svelte';
	import {
		areValuesCloseEnough,
		convertSecondsToTimestamp,
		toggleMute,
		togglePlay
	} from '$components/voiceover/audioPlayer/helpers';
	import { voiceoverSpeakerIdToDisplayName } from '$ts/constants/voiceover/models';
	import { allAudioPlayers } from '$ts/stores/allPlayers';
	import { onDestroy, onMount } from 'svelte';

	export let src: string;
	export let title: string | undefined = undefined;
	export let label: string;
	export let hasMute = false;
	export let speakerId: string | undefined = undefined;
	export let duration: number | undefined = undefined;

	let playButton: HTMLButtonElement;
	let muteButton: HTMLButtonElement;

	let currentTime = 0;
	let durationLocal: number;
	let sliderValue = 0;
	let audioElement: HTMLAudioElement;
	let isPlaying = false;
	let isMuted = false;
	let buffered: TimeRanges;

	$: progress =
		(durationLocal === 0 || durationLocal) && (currentTime === 0 || currentTime)
			? currentTime / durationLocal
			: 0;
	$: progressPercentage = progress * 100;
	$: totalTimestamp = durationLocal
		? convertSecondsToTimestamp(durationLocal)
		: duration
		? convertSecondsToTimestamp(duration)
		: undefined;
	$: currentTimestamp = currentTime ? convertSecondsToTimestamp(currentTime) : undefined;

	$: [currentTime], onCurrentTimeChanged();
	$: [sliderValue], onSliderValueChanged();

	function onCurrentTimeChanged() {
		sliderValue = progressPercentage;
	}

	function onSliderValueChanged() {
		const toBeTime = (sliderValue / 100) * durationLocal;
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
	class="w-full bg-c-bg-secondary px-3.5 py-1.5 flex flex-col items-start rounded-xl
	shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]"
>
	{#if speakerId}
		<div class="pt-1.5 pb-2.25 w-full flex justify-start items-center">
			<div
				class="rounded-md ring-2 ring-c-bg-tertiary bg-c-bg-tertiary overflow-hidden
				flex items-center justify-start relative z-0"
			>
				<div
					class="w-7 h-7 flex-shrink-0 ring-2 ring-c-bg-tertiary shadow-lg
					shadow-c-shadow/[var(--o-shadow-strong)] overflow-hidden relative z-0"
				>
					<IconSpeaker class="w-full h-full" type={speakerId} sizes="28px" />
				</div>
				<p
					class="flex-shrink min-w-0 overflow-hidden overflow-ellipsis text-sm font-medium px-3 py-1 h-full"
				>
					{$voiceoverSpeakerIdToDisplayName[speakerId]}
				</p>
			</div>
		</div>
	{/if}
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
			bind:duration={durationLocal}
			bind:this={audioElement}
			bind:muted={isMuted}
			bind:buffered
			preload="none"
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
		<div class="flex-1 self-stretch px-1">
			<div class="w-full h-full flex items-center relative">
				<Slider
					{buffered}
					duration={durationLocal}
					min={0}
					max={100}
					name="Audio Player"
					bind:value={sliderValue}
					step={0.001}
				/>
			</div>
		</div>
		<p class="pl-2 text-xs text-c-on-bg/75 lg:hidden xl:block">
			{currentTime && currentTimestamp ? currentTimestamp : '00:00'}
			<span class="text-c-on-bg/25">/</span>
			{(durationLocal || duration) && totalTimestamp ? totalTimestamp : '00:00'}
		</p>
	</div>
</div>
