<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { createSlider } from '@melt-ui/svelte';
	export let value: number;
	export let min: number;
	export let max: number;
	export let step: number;
	export let name: string;
	export let disabled = false;

	export let buffered: TimeRanges | undefined;
	export let duration: number | undefined;
	export let onPointerUp: () => void;

	let bufferedArray: { start: number; end: number }[];
	$: bufferedArray = buffered ? [...(buffered as any)] : [];

	const {
		options,
		slider,
		range,
		thumb,
		value: valueLocal
	} = createSlider({
		value: [value],
		min,
		max,
		step,
		disabled
	});

	$: options.set({ ...$options, disabled, min, max, step });
	$: valueLocal.set([value]);
	$: value = $valueLocal[0];
</script>

<div on:pointerup={onPointerUp} aria-label={name} class="w-full h-full relative">
	{#if duration && bufferedArray}
		{#each bufferedArray as item}
			{@const leftPercent = (item.start / duration) * 100}
			{@const widthPercent = ((item.end - item.start) / duration) * 100}
			<div
				style="width: {widthPercent}%; left: {leftPercent}%"
				class="h-6px bg-c-on-bg/20 absolute top-1/2 transform -translate-y-1/2 rounded-full pointer-events-none"
			/>
		{/each}
	{/if}
	<span
		{...$isTouchscreen ? {} : { ...slider }}
		class="flex-1 h-full cursor-grab active:cursor-grabbing relative flex
      items-center group/audio-player-slider"
	>
		<span class="block w-full h-6px rounded-full bg-c-on-bg/20">
			<span
				style={$isTouchscreen ? `width: ${((value - min) / (max - min)) * 100}%` : ''}
				{...$isTouchscreen ? {} : { ...range }}
				class="block h-6px rounded-full transition bg-c-on-bg not-touch:group-active/audio-player-slider:bg-c-primary"
			/>
		</span>
		{#each [...Array($valueLocal.length).keys()] as _}
			<span
				{...$isTouchscreen ? {} : { ...$thumb() }}
				class="{$isTouchscreen
					? 'hidden'
					: 'block'} ring-0 ring-c-on-bg/25 group-hover/audio-player-slider:ring-[6px]
      	transition shadow-lg shadow-c-shadow/[var(--o-shadow-strongest)] h-4.5 w-4.5 rounded-full bg-c-on-bg
				group-active/audio-player-slider:ring-[3px] outline-none transform opacity-0 scale-75 group-hover/audio-player-slider:scale-100
      	group-hover/audio-player-slider:opacity-100 group-active/audio-player-slider:bg-c-primary group-active/audio-player-slider:ring-c-primary/50"
			/>
		{/each}
	</span>
</div>
