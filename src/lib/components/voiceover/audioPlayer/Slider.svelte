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
		elements: { range, root, thumbs },
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

<div on:pointerup={onPointerUp} aria-label={name} class="relative h-full w-full">
	{#if duration && bufferedArray}
		{#each bufferedArray as item}
			{@const leftPercent = (item.start / duration) * 100}
			{@const widthPercent = ((item.end - item.start) / duration) * 100}
			<div
				style="width: {widthPercent}%; left: {leftPercent}%"
				class="pointer-events-none absolute top-1/2 h-6px -translate-y-1/2 transform rounded-full bg-c-on-bg/20"
			/>
		{/each}
	{/if}
	<span
		{...$root}
		use:root
		class="group/audio-player-slider relative flex h-full flex-1 cursor-grab
      items-center active:cursor-grabbing"
	>
		<span class="relative block h-6px w-full rounded-full bg-c-on-bg/20">
			<span
				{...$range}
				use:range
				class="block h-6px rounded-full bg-c-on-bg transition not-touch:group-active/audio-player-slider:bg-c-primary"
			/>
		</span>
		{#each [...Array($valueLocal.length).keys()] as _}
			<span
				use:thumbs
				{...$thumbs[0]}
				class="{$isTouchscreen ? 'hidden' : 'block'} h-4.5 w-4.5 scale-75
      	transform rounded-full bg-c-on-bg opacity-0 shadow-lg shadow-c-shadow/[var(--o-shadow-strongest)] outline-none
				ring-0 ring-c-on-bg/25 transition group-hover/audio-player-slider:scale-100 group-hover/audio-player-slider:opacity-100 group-hover/audio-player-slider:ring-[6px]
      	group-active/audio-player-slider:bg-c-primary group-active/audio-player-slider:ring-[3px] group-active/audio-player-slider:ring-c-primary/50"
			/>
		{/each}
	</span>
</div>
