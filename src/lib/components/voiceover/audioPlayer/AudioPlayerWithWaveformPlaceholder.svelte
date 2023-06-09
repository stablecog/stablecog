<script lang="ts">
	import { drawWaveformPlaceholder } from '$components/voiceover/audioPlayer/helpers';
	import {
		voiceoverLocale,
		voiceoverSpeakerIdToDisplayName,
		type TVoiceoverSpeakerId
	} from '$ts/constants/voiceover/models';
	import IconSpeaker from '$components/icons/IconSpeaker.svelte';
	import { languageName } from '$ts/helpers/language';
	import { locale } from '$i18n/i18n-svelte';

	export let speakerId: TVoiceoverSpeakerId;

	const barWidth = 20;

	let waveformContainer: HTMLDivElement;
	let waveformContainerWidth: number | undefined;
	let waveformContainerHeight: number | undefined;

	$: pointCount = waveformContainerWidth
		? Math.floor(waveformContainerWidth / barWidth)
		: undefined;

	$: [waveformContainer, waveformContainerWidth, waveformContainerHeight, pointCount],
		drawWaveformPlaceholderWithCheck();

	function drawWaveformPlaceholderWithCheck() {
		if (!waveformContainer) return;
		if (!waveformContainerWidth) return;
		if (!waveformContainerHeight) return;
		if (!pointCount) return;
		drawWaveformPlaceholder({
			element: waveformContainer,
			width: waveformContainerWidth,
			pointCount,
			height: waveformContainerHeight,
			margin: { top: 0, left: 0, bottom: 0, right: 0 },
			minHeight: 0.5,
			gradientStop: [
				{
					color: 'rgba(var(--c-on-bg) / 0.2)',
					offset: '0%'
				},
				{
					color: 'rgba(var(--c-on-bg) / 0)',
					offset: '100%'
				}
			]
		});
	}
</script>

<div class="w-full h-full bg-c-bg-secondary flex flex-col relative">
	<div class="flex items-center gap-4 bg-c-bg-secondary p-4 rounded-xl">
		<IconSpeaker
			sizes="64px"
			class="w-16 h-16 rounded-lg shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] ring-2 ring-c-bg-tertiary"
			type={speakerId}
		/>
		<p class="text-c-on-bg/50 font-base pr-4">
			<span class="text-c-on-bg/75 font-medium">{$voiceoverSpeakerIdToDisplayName[speakerId]}</span>
			will be speaking in
			<span class="text-c-on-bg/75 font-medium">{languageName($locale).of($voiceoverLocale)}</span
			>.<br />The voiceover will appear here.
		</p>
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
</div>
