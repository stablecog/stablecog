<script lang="ts">
	import { animateWave, resetWave } from '$components/voiceover/audioPlayer/helpers';
	import IconSpeaker from '$components/icons/IconVoiceoverSpeaker.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { voiceoverSpeakerIdToDisplayName } from '$ts/constants/voiceover/models';
	import { languageName } from '$ts/helpers/language';
	import { onDestroy } from 'svelte';
	import { fly, scale } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import { easingBounceOut } from '$ts/animation/easing';
	import ErrorChip from '$components/error/ErrorChip.svelte';
	import type { TVoiceover } from '$ts/stores/user/voiceovers';
	import type { TAudioStatus } from '$components/voiceover/audioPlayer/audioPlayerWithWaveform/types';
	import { getEstimatedVoiceoverDurationInSeconds } from '$ts/helpers/voiceover/getEstimatedDuration';
	import IconHourglass from '$components/icons/IconHourglass.svelte';
	import Morpher from '$components/Morpher.svelte';
	import IconTimer from '$components/icons/IconTimer.svelte';

	export let barWidth: number;
	export let voiceover: TVoiceover;
	export let audioStatus: TAudioStatus;

	let waveformContainer: HTMLDivElement;
	let waveformContainerWidth: number | undefined;
	let waveformContainerHeight: number | undefined;

	$: shouldAnimate = audioStatus === 'being-created';
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

	let nowInterval: NodeJS.Timeout;
	const nowUpdateInterval = 500;
	let now = Date.now();
	let estimatedDuration = 0;
	let elapsedSeconds = 0;
	let remainingSeconds = 0;

	$: voiceoverStatus = voiceover.status;
	$: [voiceoverStatus], setNowInterval();
	$: estimatedDuration = getEstimatedVoiceoverDurationInSeconds(voiceover.prompt.text);
	$: elapsedSeconds = voiceover.started_at
		? (now - new Date(voiceover.started_at).getTime()) / 1000
		: 0;
	$: remainingSeconds = estimatedDuration - elapsedSeconds;

	let lastDrawnContainer: { width: number; height: number } | undefined;

	function setNowInterval() {
		if (audioStatus === 'created' || audioStatus === 'failed') {
			clearInterval(nowInterval);
		} else if (
			voiceoverStatus === 'to-be-submitted' ||
			voiceoverStatus === 'server-received' ||
			voiceoverStatus === 'server-processing'
		) {
			clearInterval(nowInterval);
			nowInterval = setInterval(() => {
				now = Date.now();
			}, nowUpdateInterval);
		}
	}

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
		clearInterval(nowInterval);
	});
</script>

<div class="w-full h-full bg-c-bg-secondary flex flex-col relative">
	<div class="w-full flex justify-start items-center p-2.5 md:p-4">
		<div class="flex-shrink-0 relative flex items-center justify-start">
			<div
				class="absolute left-0 top-0 w-full h-full bg-c-on-bg/20 rounded-lg md:rounded-2xl {shouldAnimate
					? 'animate-ping-speaker-bg'
					: ''}"
			/>
			<div class="{shouldAnimate ? 'animate-ping-speaker' : ''} flex-shrink-0">
				<IconSpeaker
					sizes="(min-width: 768px) 60px, 44px"
					class="w-11 h-11 md:w-15 md:h-15 rounded-md md:rounded-lg2 shadow-lg relative shadow-c-shadow/[var(--o-shadow-strong)] ring-2 ring-c-bg-tertiary"
					type={voiceover.speaker.id}
				/>
			</div>
		</div>
		<p class="flex-1 min-w-0 break-words text-c-on-bg/50 text-sm md:text-base pl-3 md:pl-4 pr-10">
			{@html $LL.Voiceover.Generate.SpeakerParagraph({
				speakerName: getHighlightedSpan($voiceoverSpeakerIdToDisplayName[voiceover.speaker.id]),
				languageName: getHighlightedSpan(languageName($locale).of(voiceover.speaker.locale) || '')
			})}<br />{$LL.Voiceover.Generate.VoiceoverParagraph()}
		</p>
		{#if audioStatus === 'being-created' && now - new Date(voiceover.created_at).getTime() > 500}
			<div class="absolute right-0 top-0 flex items-center justify-end">
				{#if remainingSeconds !== estimatedDuration}
					<div
						transition:fly={{ duration: 150, easing: quadOut, y: -20 }}
						class="flex items-center justify-end absolute right-3 top-2 md:right-4 md:top-3 gap-0.75"
					>
						<IconTimer class="text-c-on-bg/50 w-4.5 h-4.5" />
						<p class="text-c-on-bg/50 mt-0.5 font-medium">
							{Math.max(0, remainingSeconds).toLocaleString($locale, {
								maximumFractionDigits: 0
							})}
						</p>
					</div>
				{:else}
					<div
						transition:fly={{ duration: 150, easing: quadOut, y: -20 }}
						class="flex items-center justify-end absolute right-2 top-3 md:right-3 md:top-4"
					>
						<div class="flex items-center justify-center animate-hourglass">
							<IconHourglass class="text-c-on-bg/50 w-4.5 h-4.5" />
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<div class="w-full flex-1 flex relative overflow-hidden pt-2">
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
