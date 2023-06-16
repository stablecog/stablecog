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
	import type { TVoiceoverFullOutput } from '$ts/stores/user/voiceovers';
	import DownloadButton from '$components/voiceover/audioPlayer/DownloadButton.svelte';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconSadFaceOutline from '$components/icons/IconSadFaceOutline.svelte';
	import { quadOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	export let output: TVoiceoverFullOutput;
	export let hasMute = false;
	export let inHorizontal = false;

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

	$: isOutputLoadingOrFailed =
		output.voiceover.status === 'failed' ||
		output.voiceover.status === 'to-be-submitted' ||
		output.voiceover.status === 'server-received' ||
		output.voiceover.status === 'server-processing';

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
		<div class="flex-shrink min-w-0 w-full flex justify-start items-center py-1.5">
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
		<div class="-mr-2 flex items-center lg:hidden xl:flex">
			<DownloadButton {output} faded disabled={isOutputLoadingOrFailed} />
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
				disabled={isOutputLoadingOrFailed}
			/>
			{#if hasMute}
				<MuteButton
					bind:element={muteButton}
					onClick={() => toggleMute(audioElement)}
					{isMuted}
					disabled={isOutputLoadingOrFailed}
				/>
			{/if}
		</div>
		<div class="flex-1 min-w-0 flex flex-col pl-2 pr-0.5">
			<p
				class="block lg:hidden xl:block text-sm text-c-on-bg/75 py-1 max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis"
			>
				{output.voiceover.prompt.text}
			</p>
			<div class="w-full flex items-center -mt-1 lg:mt-0 xl:-mt-1">
				<div class="flex-1 self-stretch h-8">
					<div class="w-full h-full flex items-center relative">
						<Slider
							{buffered}
							disabled={isOutputLoadingOrFailed}
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
	<div class="w-full hidden lg:flex items-center justify-between xl:hidden pb-0.5">
		<div class="-ml-2 flex items-center">
			<DownloadButton {output} faded disabled={isOutputLoadingOrFailed} />
		</div>
		<div class="flex-shrink min-w-0 pl-3 text-xs text-c-on-bg/50 text-right">
			<p class="px-0.25 flex-shrink min-w-0 overflow-hidden overflow-ellipsis">
				{currentTime && currentTimestamp ? currentTimestamp : '00:00'}
			</p>
			<p class="px-0.25 flex-shrink min-w-0 overflow-hidden overflow-ellipsis">
				{(durationLocal || output.audio_duration) && totalTimestamp ? totalTimestamp : '00:00'}
			</p>
		</div>
	</div>
	<!-- If loading or failed -->
	{#if isOutputLoadingOrFailed}
		<div
			transition:fade|local={{ duration: 1000, easing: quadOut }}
			class="w-full h-full absolute left-0 top-0 flex items-center justify-center {output.voiceover
				.status === 'failed'
				? 'bg-c-bg-secondary'
				: 'bg-c-bg-secondary/90'}"
		>
			{#if output.voiceover.status === 'failed'}
				<IconSadFaceOutline class="w-8 h-8 text-c-on-bg/50" />
			{:else}
				<IconAnimatedSpinner class="w-8 h-8 text-c-on-bg/50" loading={true} />
			{/if}
		</div>
	{/if}
</div>