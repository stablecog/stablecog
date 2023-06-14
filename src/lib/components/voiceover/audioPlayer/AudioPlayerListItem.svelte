<script lang="ts">
	import IconSpeaker from '$components/icons/IconVoiceoverSpeaker.svelte';
	import IconThreeDots from '$components/icons/IconThreeDots.svelte';
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
	import ThreeDotDropdown from '$components/voiceover/audioPlayer/ThreeDotDropdown.svelte';
	import type { TVoiceoverFullOutput } from '$ts/stores/user/voiceovers';

	export let output: TVoiceoverFullOutput;
	export let hasMute = false;
	export let inHorizontal = false;
	export let container: HTMLElement | undefined = undefined;

	let playButton: HTMLButtonElement;
	let muteButton: HTMLButtonElement;

	let currentTime = 0;
	let durationLocal: number;
	let sliderValue = 0;
	let audioElement: HTMLAudioElement;
	let isPaused = true;
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
		: output.audio_duration
		? convertSecondsToTimestamp(output.audio_duration)
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

	onDestroy(async () => {
		audioElement?.pause();
		$allAudioPlayers.delete(audioElement);
	});
</script>

<div
	on:keydown={(e) => {
		if (e.target === playButton || e.target === muteButton) return;
		if (e.key === ' ') {
			togglePlay({ audioElement });
		}
	}}
	class="{inHorizontal
		? 'h-full'
		: ''} w-full bg-c-bg-secondary px-3 pt-1.5 pb-1 flex flex-col items-start rounded-xl
	shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] overflow-hidden relative z-0 group/audio-player-list-item"
>
	<div class="w-full flex justify-between items-center gap-2 pb-1">
		<div class="flex-shrink min-w-0 w-full flex justify-start items-center">
			<div
				class="rounded-md bg-c-bg-tertiary overflow-hidden
					flex items-center justify-start relative z-0 ring-2 ring-c-bg-tertiary"
			>
				<div class="w-7 h-7 flex-shrink-0 shadow-lg overflow-hidden relative z-0">
					<IconSpeaker class="w-full h-full" type={output.voiceover.speaker.id} sizes="28px" />
				</div>
				<p
					class="text-c-on-bg/75 flex-shrink min-w-0 whitespace-nowrap overflow-hidden overflow-ellipsis text-sm font-medium
					px-2.5 py-1 h-full"
				>
					{$voiceoverSpeakerIdToDisplayName[output.voiceover.speaker.id]}
				</p>
			</div>
		</div>
		<div class="-mr-1.5">
			<ThreeDotDropdown {output} {container} />
		</div>
	</div>
	<p
		class="md:hidden lg:block xl:hidden text-sm text-c-on-bg/75 py-1 max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis"
	>
		{output.voiceover.prompt.text}
	</p>
	<div class="{inHorizontal ? 'h-full' : ''} w-full flex items-center justify-center">
		<audio
			src={output.audio_file_url}
			aria-label={output.voiceover.prompt.text}
			bind:currentTime
			bind:duration={durationLocal}
			bind:this={audioElement}
			bind:muted={isMuted}
			bind:buffered
			preload="none"
			on:playing={() => {
				isPlaying = true;
			}}
			on:play={() => (isPaused = false)}
			on:pause={() => {
				isPaused = true;
				isPlaying = false;
			}}
		/>
		<div class="flex items-center -ml-2">
			<PlayPauseButton
				bind:element={playButton}
				onClick={() => {
					togglePlay({ audioElement });
				}}
				{isPaused}
				{isPlaying}
			/>
			{#if hasMute}
				<MuteButton bind:element={muteButton} onClick={() => toggleMute(audioElement)} {isMuted} />
			{/if}
		</div>
		<div class="flex-1 min-w-0 flex flex-col pl-2 pr-0.5">
			<p
				class="block lg:hidden xl:block text-sm text-c-on-bg/75 py-1 max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis"
			>
				{output.voiceover.prompt.text}
			</p>
			<div class="w-full flex items-center -mt-1">
				<div class="flex-1 self-stretch h-8">
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
				<p class="pl-3 text-xs text-c-on-bg/50 lg:hidden xl:block">
					{currentTime && currentTimestamp ? currentTimestamp : '00:00'}
					<span class="text-c-on-bg/25">/</span>
					{(durationLocal || output.audio_duration) && totalTimestamp ? totalTimestamp : '00:00'}
				</p>
			</div>
		</div>
	</div>
</div>
