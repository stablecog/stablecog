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
			items-center group/sliderinput"
	>
		<span class="{size === 'sm' ? 'h-1.5' : 'h-2'} block w-full rounded-full bg-c-on-bg/20">
			<span
				{...$range}
				class="{size === 'sm'
					? 'h-1.5'
					: 'h-2'} rounded-full transition bg-c-on-bg group-active/sliderinput:bg-c-primary"
			/>
		</span>
		{#each [...Array($valueLocal.length).keys()] as _}
			<span
				{...$thumb()}
				class="{size === 'sm'
					? 'w-4 h-4 group-hover/sliderinput:ring-[6px] group-active/sliderinput:ring-3'
					: 'w-5 h-5 group-hover/sliderinput:ring-[7px] group-active/sliderinput:ring-4'}
					block ring-0 ring-c-on-bg/25 group-active/sliderinput:ring-c-primary/50
					transition shadow-lg shadow-c-shadow/[var(--o-shadow-strongest)] rounded-full bg-c-on-bg
					group-active/sliderinput:bg-c-primary outline-none"
			/>
		{/each}
	</span>
</div>
