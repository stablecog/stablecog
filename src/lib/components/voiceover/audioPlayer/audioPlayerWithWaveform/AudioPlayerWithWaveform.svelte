<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import {
		audioBufferToArray,
		audioToArray,
		togglePlay
	} from '$components/voiceover/audioPlayer/helpers';

	import { allAudioPlayers } from '$ts/stores/allPlayers';
	import type { TVoiceover, TVoiceoverOutput } from '$ts/stores/user/voiceovers';
	import AudioPlayerWithWaveformPlaceholder from '$components/voiceover/audioPlayer/audioPlayerWithWaveform/AudioPlayerWithWaveformPlaceholder.svelte';
	import { cubicOut, quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import AudioPlayerWithWaveformInner from '$components/voiceover/audioPlayer/audioPlayerWithWaveform/AudioPlayerWithWaveformInner.svelte';
	import type { TAudioStatus } from '$components/voiceover/audioPlayer/audioPlayerWithWaveform/types';
	import { flyAndScale } from '$ts/animation/transitions';

	export let voiceover: TVoiceover;
	export { classes as class };
	let classes = '';

	const barWidth = 20;
	let currentTime = 0;
	let duration: number;
	let audioElement: HTMLAudioElement;
	let isPaused = true;
	let isPlaying = false;
	let isMuted = false;

	let containerWidth: number;

	let playButton: HTMLButtonElement;
	let muteButton: HTMLButtonElement;

	let audioStatus: TAudioStatus;

	let output: TVoiceoverOutput;
	$: output = voiceover.outputs[0];
	$: outputId = output.id;
	$: [outputId], onOutputIdChanged();
	$: pointCount = containerWidth ? Math.floor(containerWidth / barWidth) : undefined;
	$: status = output?.status;
	$: [status, pointCount], onStatusChanged();
	$: audioStatus =
		status === 'to-be-submitted' ||
		status === 'server-received' ||
		status === 'server-processing' ||
		(status === 'succeeded' && audioArray === undefined)
			? 'being-created'
			: status === 'succeeded' && audioArray !== undefined
			? 'created'
			: 'idle';
	let audioArray: number[] | undefined;

	function onOutputIdChanged() {
		audioArray = undefined;
	}

	async function onStatusChanged() {
		if (!pointCount) return;
		if (status === 'succeeded' && !output.audio_buffer) {
			try {
				if (output?.audio_buffer) {
					audioArray = await audioBufferToArray(output.audio_buffer, pointCount);
				} else {
					audioArray = await audioToArray(output.audio_file_url, pointCount);
				}
			} catch (error) {
				console.log('Audio to array error:', error);
			}
		}
	}

	onMount(async () => {
		$allAudioPlayers.add(audioElement);
	});

	onDestroy(() => {
		$allAudioPlayers.delete(audioElement);
	});
</script>

<audio
	src={output?.audio_file_url}
	aria-label={voiceover.prompt.text || 'Voiceover'}
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
	bind:clientWidth={containerWidth}
	class="w-full h-full bg-c-bg-secondary flex flex-col rounded-xl md:rounded-2xl overflow-hidden relative z-0
		shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] {classes}"
>
	{#if audioStatus !== 'created'}
		<div
			in:scale|local={{ duration: 300, easing: quadOut, start: 0.85 }}
			out:scale|local={{ duration: 200, easing: quadOut, start: 0.85 }}
			class="w-full h-full absolute left-0 top-0 bg-c-bg-secondary"
		>
			<AudioPlayerWithWaveformPlaceholder {audioStatus} {voiceover} {barWidth} />
		</div>
	{:else}
		<div
			in:scale|local={{ duration: 300, easing: quadOut, start: 1.15 }}
			out:scale|local={{ duration: 200, easing: quadOut, start: 1.15 }}
			class="w-full h-full flex flex-col bg-c-bg-secondary z-10"
		>
			<AudioPlayerWithWaveformInner
				bind:currentTime
				bind:muteButton
				bind:playButton
				output={{ ...output, voiceover }}
				{isMuted}
				bind:isPaused
				bind:isPlaying
				{audioElement}
				{audioArray}
				{pointCount}
				{duration}
			/>
		</div>
	{/if}
</div>
