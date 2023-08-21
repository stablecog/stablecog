<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { createSlider } from '@melt-ui/svelte';
	import { writable } from 'svelte/store';
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
		elements: { range, root, thumb },
		states: { value: valueLocal }
	} = createSlider({
		value: writable([value]),
		min,
		max,
		step,
		disabled
	});

	$: options.disabled.set(disabled || $isTouchscreen);
	$: options.max.set(max);
	$: options.min.set(min);
	$: options.step.set(step);
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
		{...$root}
		use:root
		class="flex-1 h-full cursor-grab active:cursor-grabbing relative flex
      items-center group/audio-player-slider"
	>
		<span class="block w-full h-6px rounded-full bg-c-on-bg/20 relative">
			<span
				{...$range}
				use:range
				class="block h-6px rounded-full transition bg-c-on-bg not-touch:group-active/audio-player-slider:bg-c-primary"
			/>
		</span>
		{#each [...Array($valueLocal.length).keys()] as _}
			<span
				{...$thumb()}
				use:thumb
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
