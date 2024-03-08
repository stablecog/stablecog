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
	export let size: 'sm' | 'md' = 'md';
	let classes = '';

	const {
		options,
		states: { value: valueLocal },
		elements: { range, root, thumbs }
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
		class="group/sliderinput relative flex h-full flex-1 cursor-grab touch-none select-none
			items-center active:cursor-grabbing"
	>
		<span class="{size === 'sm' ? 'h-1.5' : 'h-2'} block w-full rounded-full bg-c-on-bg/20">
			<span
				{...$range}
				class="{size === 'sm'
					? 'h-1.5'
					: 'h-2'} rounded-full bg-c-on-bg transition group-active/sliderinput:bg-c-primary"
			/>
		</span>
		{#each [...Array($valueLocal.length).keys()] as _}
			<span
				use:thumbs
				{...$thumbs[0]}
				class="{size === 'sm'
					? 'h-4 w-4 group-hover/sliderinput:ring-[6px] group-active/sliderinput:ring-3'
					: 'h-5 w-5 group-hover/sliderinput:ring-[7px] group-active/sliderinput:ring-4'}
					block rounded-full bg-c-on-bg shadow-lg
					shadow-c-shadow/[var(--o-shadow-strongest)] outline-none ring-0 ring-c-on-bg/25 transition
					group-active/sliderinput:bg-c-primary group-active/sliderinput:ring-c-primary/50"
			/>
		{/each}
	</span>
</div>
