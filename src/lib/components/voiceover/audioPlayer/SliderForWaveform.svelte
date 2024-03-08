<script lang="ts">
	import { createSlider } from '@melt-ui/svelte';
	import { writable } from 'svelte/store';
	export let value: number;
	export let min: number;
	export let max: number;
	export let step: number;
	export let name: string;
	export let onPointerUp: () => void;

	const {
		options,
		elements: { range, root, thumbs },
		states: { value: valueLocal }
	} = createSlider({
		value: writable([value]),
		min,
		max,
		step
	});

	$: options.max.set(max);
	$: options.min.set(min);
	$: options.step.set(step);
	$: valueLocal.set([value]);
	$: value = $valueLocal[0];
</script>

<span on:pointerup={onPointerUp} aria-label={name} class="h-full w-full">
	<span
		{...$root}
		use:root
		class="group relative flex h-full cursor-grab
      items-end overflow-hidden active:cursor-grabbing"
	>
		<span class="relative flex h-full w-full flex-col justify-end">
			<span
				{...$range}
				class="absolute h-4px origin-right rounded-r-full
				bg-c-primary/50 transition group-hover:scale-x-0 group-active:scale-x-0"
			/>
		</span>
		{#each [...Array($valueLocal.length).keys()] as _}
			<span
				{...$thumbs[0]}
				use:thumbs
				class="h-full w-4px origin-bottom scale-y-0
				transform rounded-full bg-c-primary/50 outline-none transition
				group-hover:scale-y-100 group-active:scale-y-100 group-active:bg-c-primary"
			/>
		{/each}
	</span>
</span>
