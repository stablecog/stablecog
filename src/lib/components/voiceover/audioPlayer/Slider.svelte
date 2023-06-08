<script lang="ts">
	import { Slider } from 'radix-svelte';
	export let value: number;
	export let min: number;
	export let max: number;
	export let step: number;
	export let name: string;

	export let buffered: TimeRanges | undefined;
	export let duration: number | undefined;

	let bufferedArray: { start: number; end: number }[];
	$: bufferedArray = buffered ? [...(buffered as any)] : [];
</script>

<form class="w-full h-full relative">
	{#if duration && bufferedArray}
		{#each bufferedArray as item}
			{@const leftPercent = (item.start / duration) * 100}
			{@const widthPercent = ((item.end - item.start) / duration) * 100}
			<div
				style="width: {widthPercent}%; left: {leftPercent}%"
				class="h-6px bg-c-on-bg/15 absolute top-1/2 transform -translate-y-1/2 rounded-full pointer-events-none"
			/>
		{/each}
	{/if}
	<Slider.Root
		class="flex-1 h-full touch-none select-none cursor-grab active:cursor-grabbing relative flex 
      items-center group/audio-player-slider"
		bind:value
		{min}
		{max}
		{step}
		{name}
	>
		<Slider.Track class="relative h-6px grow rounded-full bg-c-on-bg/15">
			<Slider.Range
				class="absolute h-6px rounded-full transition bg-c-on-bg group-active/audio-player-slider:bg-c-primary"
			/>
		</Slider.Track>
		<Slider.Thumb
			class="block ring-0 ring-c-on-bg/25 group-hover/audio-player-slider:ring-[6px] 
      transition shadow-lg shadow-c-shadow/[var(--o-shadow-strongest)] h-4.5 w-4.5 rounded-full bg-c-on-bg
			group-active/audio-player-slider:ring-[3px] outline-none transform opacity-0 scale-75 group-hover/audio-player-slider:scale-100
      group-hover/audio-player-slider:opacity-100 group-active/audio-player-slider:bg-c-primary group-active/audio-player-slider:ring-c-primary/50"
		/>
	</Slider.Root>
</form>
