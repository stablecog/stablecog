<script lang="ts">
	import Numerator from '$components/Numerator.svelte';
	import RangeInput from '$components/RangeInput.svelte';

	export let value: number;
	export let min: number;
	export let max: number;
	export let step = 1;
	export let name: string;
	export let disabled: boolean;
	export let valueSize: 'sm' | 'md' = 'sm';
	export let numeratorFormatter: (value: number) => string = (value) => value.toString();
	export { classes as class };
	let classes = 'px-4 gap-3.5';

	let isGrabbed = false;
</script>

<div class="range-input flex-1 min-w-0 flex items-center relative rounded-r-xl {classes}">
	<Numerator
		{min}
		{max}
		{step}
		{numeratorFormatter}
		showWheel={isGrabbed}
		bind:value
		class="{valueSize === 'md' ? 'text-base px-0.5' : 'text-sm'} text-c-on-bg"
	/>
	<RangeInput {disabled} class="flex-1 h-13" bind:value {name} {min} {max} {step} />
</div>
