<script lang="ts">
	import { createSlider } from '@melt-ui/svelte';
	export let value: number;
	export let min: number;
	export let max: number;
	export let step: number;
	export let name: string;
	export let onPointerUp: () => void;

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
		step
	});

	$: options.set({ ...$options, min, max, step });
	$: valueLocal.set([value]);
	$: value = $valueLocal[0];
</script>

<span on:pointerup={onPointerUp} aria-label={name} class="w-full h-full">
	<span
		{...$slider}
		class="h-full cursor-grab active:cursor-grabbing relative flex
      items-end group overflow-hidden"
	>
		<span class="w-full h-full relative flex flex-col justify-end">
			<span
				{...$range}
				class="absolute h-4px bg-c-primary/50 origin-right
				group-hover:scale-x-0 group-active:scale-x-0 transition rounded-r-full"
			/>
		</span>
		{#each [...Array($valueLocal.length).keys()] as _}
			<span
				{...$thumb()}
				class="transition h-full w-4px bg-c-primary/50
				outline-none rounded-full origin-bottom transform group-active:bg-c-primary
				scale-y-0 group-hover:scale-y-100 group-active:scale-y-100"
			/>
		{/each}
	</span>
</span>
