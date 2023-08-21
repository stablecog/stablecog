<script lang="ts">
	import { createSlider } from '@melt-ui/svelte';
	import { writable } from 'svelte/store';

	export let value: number;
	export let min: number;
	export let max: number;
	export let step: number;
	export let disabled = false;
	export let name: string;
	export { classes as class };
	let classes = '';

	const {
		options,
		states: { value: valueLocal },
		elements: { range, root, thumb }
	} = createSlider({
		value: writable([value]),
		min,
		max,
		step,
		disabled
	});

	$: options.disabled.set(disabled);
	$: options.max.set(max);
	$: options.min.set(min);
	$: options.step.set(step);

	$: valueLocal.set([value]);
	$: value = $valueLocal[0];
</script>

<div
	aria-label={name}
	class="pr-1.5 {max.toString().length - min.toString().length < 2 ? 'pl-1.5' : ''} {classes}"
>
	<span
		{...$root}
		class="flex-1 h-full touch-none select-none cursor-grab active:cursor-grabbing relative flex
			items-center group/rangeinput"
	>
		<span class="block w-full h-2 rounded-full bg-c-on-bg/20">
			<span
				{...$range}
				class="h-2 rounded-full transition bg-c-on-bg group-active/rangeinput:bg-c-primary"
			/>
		</span>
		{#each [...Array($valueLocal.length).keys()] as _}
			<span
				{...$thumb()}
				class="block ring-0 ring-c-on-bg/25 group-hover/rangeinput:ring-[7px] group-active/rangeinput:ring-c-primary/50
					transition shadow-lg shadow-c-shadow/[var(--o-shadow-strongest)] h-5 w-5 rounded-full bg-c-on-bg
					group-active/rangeinput:bg-c-primary group-active/rangeinput:ring-4 outline-none"
			/>
		{/each}
	</span>
</div>
