<script lang="ts">
	import { animateWave, resetWave } from '$components/voiceover/audioPlayer/helpers';
	import IconSpeaker from '$components/icons/IconVoiceoverSpeaker.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { voiceoverSpeakerIdToDisplayName } from '$ts/constants/voiceover/models';
	import { languageName } from '$ts/helpers/language';
	import { onDestroy } from 'svelte';
	import { scale } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import { easingBounceOut } from '$ts/animation/easing';
	import ErrorChip from '$components/error/ErrorChip.svelte';
	import type { TVoiceover, TVoiceoverFullOutput } from '$ts/stores/user/voiceovers';

	export let barWidth: number;
	export let voiceover: TVoiceover;

	let waveformContainer: HTMLDivElement;
	let waveformContainerWidth: number | undefined;
	let waveformContainerHeight: number | undefined;

	$: shouldAnimate =
		voiceover.status === 'to-be-submitted' ||
		voiceover.status === 'server-received' ||
		voiceover.status === 'server-processing';
	$: pointCount = waveformContainerWidth
		? Math.floor(waveformContainerWidth / barWidth)
		: undefined;

	$: [
		waveformContainer,
		waveformContainerWidth,
		waveformContainerHeight,
		pointCount,
		shouldAnimate
	],
		drawWaveformPlaceholderWithCheck();

	let lastDrawnContainer: { width: number; height: number } | undefined;

	function drawWaveformPlaceholderWithCheck() {
		if (!waveformContainer) return;
		if (!waveformContainerWidth) return;
		if (!waveformContainerHeight) return;
		if (!pointCount) return;
		if (
			lastDrawnContainer &&
			(lastDrawnContainer.width !== waveformContainerWidth ||
				lastDrawnContainer.height !== waveformContainerHeight)
		) {
			resetWave(waveformContainer);
		}
		animateWave({
			element: waveformContainer,
			width: waveformContainerWidth,
			height: waveformContainerHeight,
			margin: { top: 0, left: 0, bottom: 0, right: 0 },
			minAmplitude: -0.5,
			maxAmplitude: 1,
			minY: 0.4,
			maxY: 1,
			initialWavelength: 25,
			speed: 1.5,
			shouldAnimate,
			modulationFrequency: 100,
			gradientStops: [
				{
					color: 'rgba(var(--c-on-bg)/0.2)',
					offset: '0%'
				},
				{
					color: 'rgba(var(--c-on-bg)/0)',
					offset: '100%'
				}
			]
		});
		lastDrawnContainer = {
			width: waveformContainerWidth,
			height: waveformContainerHeight
		};
	}

	function getHighlightedSpan(s: string) {
		return `<span class="text-c-on-bg/75 font-medium">${s}</span>`;
	}

	onDestroy(() => {
		resetWave(waveformContainer);
	});
</script>

<div class="w-full h-full bg-c-bg-secondary flex flex-col relative">
	<div class="w-full flex justify-start items-center p-4">
		<div class="flex-shrink-0 relative flex items-center justify-start">
			<div
				class="absolute left-0 top-0 w-full h-full bg-c-on-bg/20 rounded-2xl {shouldAnimate
					? 'animate-ping-speaker-bg'
					: ''}"
			/>
			<div class="{shouldAnimate ? 'animate-ping-speaker' : ''} flex-shrink-0">
				<IconSpeaker
					sizes="64px"
					class="w-15 h-15 rounded-lg2 shadow-lg relative shadow-c-shadow/[var(--o-shadow-strong)] ring-2 ring-c-bg-tertiary"
					type={voiceover.speaker.id}
				/>
			</div>
		</div>
		<p class="flex-shrink min-w-0 text-c-on-bg/50 font-base px-4">
			{@html $LL.Voiceover.Generate.SpeakerParagraph({
				speakerName: getHighlightedSpan($voiceoverSpeakerIdToDisplayName[voiceover.speaker.id]),
				languageName: getHighlightedSpan(languageName($locale).of(voiceover.speaker.locale) || '')
			})}<br />{$LL.Voiceover.Generate.VoiceoverParagraph()}
		</p>
	</div>

	<div class="w-full flex-1 flex relative overflow-hidden pt-4">
		<div
			bind:clientWidth={waveformContainerWidth}
			bind:clientHeight={waveformContainerHeight}
			class="w-full h-full"
		>
			{#if waveformContainerWidth && waveformContainerHeight}
				<div class="w-full h-0" bind:this={waveformContainer} />
			{/if}
		</div>
	</div>

	{#if voiceover.error}
		<div
			in:scale|local={{ duration: 200, easing: easingBounceOut, start: 0.5 }}
			out:scale|local={{ duration: 200, easing: quadOut, start: 0.5 }}
			class="w-full bottom-0 absolute left-0 p-5 flex items-center justify-center"
		>
			<ErrorChip size="md" class="max-h-[6rem] overflow-auto" error={voiceover.error} />
		</div>
	{/if}
</div>
