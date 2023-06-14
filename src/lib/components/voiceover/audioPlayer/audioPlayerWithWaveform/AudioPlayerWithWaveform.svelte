<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { togglePlay } from '$components/voiceover/audioPlayer/helpers';

	import { allAudioPlayers } from '$ts/stores/allPlayers';
	import type { TVoiceoverFullOutput } from '$ts/stores/user/voiceovers';
	import AudioPlayerWithWaveformPlaceholder from '$components/voiceover/audioPlayer/audioPlayerWithWaveform/AudioPlayerWithWaveformPlaceholder.svelte';
	import { cubicOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import AudioPlayerWithWaveformInner from '$components/voiceover/audioPlayer/audioPlayerWithWaveform/AudioPlayerWithWaveformInner.svelte';
	import type { TAudioStatus } from '$components/voiceover/audioPlayer/audioPlayerWithWaveform/types';

	export let output: TVoiceoverFullOutput;
	export { classes as class };
	let classes = '';

	const barWidth = 20;
	let currentTime = 0;
	let duration: number;
	let audioElement: HTMLAudioElement;
	let isPaused = true;
	let isPlaying = false;
	let isMuted = false;

	let playButton: HTMLButtonElement;
	let muteButton: HTMLButtonElement;

	let audioStatus: TAudioStatus;
	$: audioStatus =
		output?.status === 'to-be-submitted' ||
		output?.status === 'server-received' ||
		output?.status === 'server-processing'
			? 'being-created'
			: output?.status === 'succeeded'
			? 'created'
			: 'idle';

	onMount(async () => {
		$allAudioPlayers.add(audioElement);
	});

	onDestroy(() => {
		$allAudioPlayers.delete(audioElement);
	});
</script>

<audio
	src={output?.audio_file_url}
	aria-label={output?.voiceover.prompt.text || 'Voiceover'}
	bind:currentTime
	bind:duration
	bind:this={audioElement}
	bind:muted={isMuted}
	on:playing={() => {
		isPlaying = true;
	}}
	on:play={() => (isPaused = false)}
	on:pause={() => {
		isPaused = true;
		isPlaying = false;
	}}
/>
<div
	on:keydown={(e) => {
		if (e.target === playButton || e.target === muteButton) return;
		if (e.key === ' ') {
			togglePlay({ audioElement });
		}
	}}
	class="w-full h-full bg-c-bg-secondary flex flex-col rounded-2xl overflow-hidden relative z-0
		shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] {classes}"
>
	{#if audioStatus !== 'created'}
		<div
			transition:scale|local={{ duration: 300, easing: cubicOut, start: 0.9 }}
			class="w-full h-full absolute left-0 top-0 bg-c-bg-secondary"
		>
			<AudioPlayerWithWaveformPlaceholder {output} {barWidth} />
		</div>
	{:else}
		<div
			transition:scale|local={{ duration: 300, easing: cubicOut, start: 1.1 }}
			class="w-full h-full flex flex-col bg-c-bg-secondary z-10"
		>
			<AudioPlayerWithWaveformInner
				bind:currentTime
				bind:muteButton
				bind:playButton
				{output}
				{isMuted}
				bind:isPaused
				bind:isPlaying
				{audioElement}
				{duration}
				{barWidth}
			/>
		</div>
	{/if}
</div>
