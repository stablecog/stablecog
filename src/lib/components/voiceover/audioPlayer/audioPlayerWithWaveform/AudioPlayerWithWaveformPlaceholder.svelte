<script lang="ts">
	import { animateWave, resetWave } from '$components/voiceover/audioPlayer/helpers';
	import IconSpeaker from '$components/icons/IconVoiceoverSpeaker.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { voiceoverSpeakerIdToDisplayName } from '$ts/constants/voiceover/models';
	import { languageName } from '$ts/helpers/language';
	import { onDestroy, onMount } from 'svelte';
	import { fly, scale } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import { easingBounceOut } from '$ts/animation/easing';
	import ErrorChip from '$components/error/ErrorChip.svelte';
	import type { TVoiceover } from '$ts/stores/user/voiceovers';
	import type { TAudioStatus } from '$components/voiceover/audioPlayer/audioPlayerWithWaveform/types';
	import { getEstimatedVoiceoverDurationInSeconds } from '$ts/helpers/voiceover/getEstimatedDuration';
	import IconTimerAnimated from '$components/icons/IconTimerAnimated.svelte';
	import IconHourglassAnimated from '$components/icons/IconHourglassAnimated.svelte';

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
	let elapsedSecondsSinceCreation = 0;
	let remainingSeconds = 0;
	let canShowTimerTimeout: NodeJS.Timeout;
	let canShowTimer = false;

	$: voiceoverStatus = voiceover.status;
	$: [voiceoverStatus], setNowInterval();
	$: estimatedDuration = getEstimatedVoiceoverDurationInSeconds(voiceover.prompt.text);
	$: elapsedSeconds = voiceover.started_at
		? (now - new Date(voiceover.started_at).getTime()) / 1000
		: 0;
	$: elapsedSecondsSinceCreation = voiceover.created_at
		? (now - new Date(voiceover.created_at).getTime()) / 1000
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

	onMount(() => {
		canShowTimerTimeout = setTimeout(() => {
			canShowTimer = true;
		}, 500);
	});

	onDestroy(() => {
		resetWave(waveformContainer);
		clearInterval(nowInterval);
		clearTimeout(canShowTimerTimeout);
	});
</script>

<div class="relative flex h-full w-full flex-col bg-c-bg-secondary">
	<div class="flex w-full items-center justify-start p-2.5 md:p-4">
		<div class="relative flex flex-shrink-0 items-center justify-start">
			<div
				class="absolute left-0 top-0 h-full w-full rounded-lg bg-c-on-bg/20 md:rounded-2xl {shouldAnimate
					? 'animate-ping-speaker-bg'
					: ''}"
			/>
			<div class="{shouldAnimate ? 'animate-ping-speaker' : ''} flex-shrink-0">
				<IconSpeaker
					sizes="(min-width: 768px) 60px, 44px"
					class="relative h-11 w-11 rounded-md shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] ring-2 ring-c-bg-tertiary md:h-15 md:w-15 md:rounded-lg2"
					type={voiceover.speaker.id}
				/>
			</div>
		</div>
		<p class="min-w-0 flex-1 break-words pl-3 pr-10 text-sm text-c-on-bg/50 md:pl-4 md:text-base">
			{@html $LL.Voiceover.Generate.SpeakerParagraph({
				speakerName: getHighlightedSpan($voiceoverSpeakerIdToDisplayName[voiceover.speaker.id]),
				languageName: getHighlightedSpan(languageName($locale).of(voiceover.speaker.locale) || '')
			})}<br />{$LL.Voiceover.Generate.VoiceoverParagraph()}
		</p>
		{#if canShowTimer && elapsedSecondsSinceCreation > 0.5 && audioStatus === 'being-created' && remainingSeconds !== estimatedDuration}
			<div
				transition:fly={{ duration: 150, easing: quadOut, y: -20 }}
				class="absolute right-3 top-2 flex items-center justify-end gap-0.75 md:right-4 md:top-3"
			>
				<IconTimerAnimated class="h-4.5 w-4.5 text-c-on-bg/50" />
				<p class="mt-0.5 font-medium text-c-on-bg/50">
					{Math.max(0, remainingSeconds).toLocaleString($locale, {
						maximumFractionDigits: 0
					})}
				</p>
			</div>
		{:else if canShowTimer && elapsedSecondsSinceCreation > 0.5 && audioStatus === 'being-created' && remainingSeconds === estimatedDuration}
			<div
				transition:fly={{ duration: 150, easing: quadOut, y: -20 }}
				class="absolute right-2 top-2 flex items-center justify-end md:right-3 md:top-3"
			>
				<div class="flex items-center justify-center">
					<IconHourglassAnimated class="h-6 w-6 text-c-on-bg-faded" />
				</div>
			</div>
		{/if}
	</div>

	<div class="relative flex w-full flex-1 overflow-hidden pt-2">
		<div
			bind:clientWidth={waveformContainerWidth}
			bind:clientHeight={waveformContainerHeight}
			class="h-full w-full"
		>
			{#if waveformContainerWidth && waveformContainerHeight}
				<div class="h-0 w-full" bind:this={waveformContainer} />
			{/if}
		</div>
	</div>

	{#if voiceover.error}
		<div
			in:scale={{ duration: 200, easing: easingBounceOut, start: 0.5 }}
			out:scale={{ duration: 200, easing: quadOut, start: 0.5 }}
			class="absolute bottom-0 left-0 flex w-full items-center justify-center p-5"
		>
			<ErrorChip size="md" class="max-h-[6rem] overflow-auto" error={voiceover.error} />
		</div>
	{/if}
</div>
