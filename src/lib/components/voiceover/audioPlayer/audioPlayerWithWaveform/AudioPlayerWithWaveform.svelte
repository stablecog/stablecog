<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { togglePlay } from '$components/voiceover/audioPlayer/helpers';

	import { allAudioPlayers } from '$ts/stores/allPlayers';
	import type { TVoiceoverStatus } from '$ts/stores/user/voiceovers';
	import AudioPlayerWithWaveformPlaceholder from '$components/voiceover/audioPlayer/audioPlayerWithWaveform/AudioPlayerWithWaveformPlaceholder.svelte';
	import { cubicOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import type { TVoiceoverSpeakerId } from '$ts/constants/voiceover/models';
	import AudioPlayerWithWaveformInner from '$components/voiceover/audioPlayer/audioPlayerWithWaveform/AudioPlayerWithWaveformInner.svelte';
	import type { TAudioStatus } from '$components/voiceover/audioPlayer/audioPlayerWithWaveform/types';
	import type { TVoiceoverLocale } from '$ts/constants/voiceover/locales';

	export let src: string | undefined;
	export let title: string | undefined = undefined;
	export let label: string;
	export let status: TVoiceoverStatus | undefined = undefined;
	export let speakerId: TVoiceoverSpeakerId;
	export let voiceoverLocale: TVoiceoverLocale;
	export let error: string | undefined = undefined;
	export { classes as class };
	let classes = '';

	const barWidth = 20;
	let currentTime = 0;
	let duration: number;
	let audioElement: HTMLAudioElement;
	let isPlaying = false;
	let isMuted = false;

	let playButton: HTMLButtonElement;
	let muteButton: HTMLButtonElement;

	let audioStatus: TAudioStatus;
	$: audioStatus =
		status === 'to-be-submitted' || status === 'server-received' || status === 'server-processing'
			? 'being-created'
			: status === 'succeeded'
			? 'created'
			: 'idle';

	function toggleIsPlaying(state?: boolean) {
		if (state !== undefined) {
			isPlaying = state;
			return;
		}
		isPlaying = !isPlaying;
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
	bind:muted={isMuted}
	on:playing={() => (isPlaying = true)}
	on:pause={() => (isPlaying = false)}
/>
<div
	on:keydown={(e) => {
		if (e.target === playButton || e.target === muteButton) return;
		if (e.key === ' ') {
			togglePlay({ audioElement, callback: toggleIsPlaying });
		}
	}}
	class="w-full h-full bg-c-bg-secondary flex flex-col rounded-xl overflow-hidden relative z-0
		shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] {classes}"
>
	{#if audioStatus !== 'created'}
		<div
			transition:scale|local={{ duration: 300, easing: cubicOut, start: 0.9 }}
			class="w-full h-full absolute left-0 top-0 bg-c-bg-secondary"
		>
			<AudioPlayerWithWaveformPlaceholder
				{speakerId}
				{error}
				{voiceoverLocale}
				{barWidth}
				shouldAnimate={audioStatus === 'being-created'}
			/>
		</div>
	{:else}
		<div
			transition:scale|local={{ duration: 300, easing: cubicOut, start: 1.1 }}
			class="w-full h-full flex flex-col bg-c-bg-secondary z-10"
		>
			<AudioPlayerWithWaveformInner
				bind:currentTime
				{isMuted}
				{isPlaying}
				{toggleIsPlaying}
				{audioElement}
				{duration}
				{muteButton}
				{playButton}
				{speakerId}
				{title}
				{barWidth}
				{audioStatus}
				{src}
				{status}
			/>
		</div>
	{/if}
</div>
