<script lang="ts">
	import Numerator from '$components/Numerator.svelte';
	import RangeInput from '$components/RangeInput.svelte';

	export let value: number;
	export let min: number;
	export let max: number;
	export let step = 1;
	export let disabled: boolean;
	export let valueSize: 'sm' | 'md' = 'sm';
	export let numeratorFormatter: (value: number) => string = (value) => value.toString();
	export { classes as class };
	let classes = 'px-4 gap-3.5';

	let focused = false;
</script>

<div class="range-input flex-1 min-w-0 flex items-center relative rounded-r-xl {classes}">
	<Numerator
		{min}
		{max}
		{step}
		{numeratorFormatter}
		bind:value
		class="{valueSize === 'md'
			? 'text-sm md:text-base px-0.5 md:px-1'
			: 'text-xs md:text-sm'} text-c-on-bg"
		showWheel={focused}
	/>
	<RangeInput
		{disabled}
		class="flex-1 h-12 md:h-13"
		classInput="rounded-lg"
		bind:value
		bind:focused
		{min}
		{max}
		{step}
	/>
</div>
