<script lang="ts">
	import Numerator from '$components/primitives/Numerator.svelte';
	import SliderInput from '$components/primitives/SliderInput.svelte';

	export let value: number;
	export let min: number;
	export let max: number;
	export let step = 1;
	export let name: string;
	export let disabled: boolean;
	export let notAllowed: boolean;
	export let valueSize: 'sm' | 'md' = 'sm';
	export let numeratorFormatter: (value: number) => string = (value) => value.toString();
	export { classes as class };
	let classes = 'px-4 gap-3.5';
</script>

<div class="range-input relative flex min-w-0 flex-1 items-center rounded-r-xl {classes}">
	<Numerator
		{min}
		{max}
		{step}
		{numeratorFormatter}
		{value}
		class="{valueSize === 'md' ? 'px-0.5 text-base' : 'text-sm'} pointer-events-none text-c-on-bg"
	/>
	<SliderInput {notAllowed} {disabled} class="h-full flex-1" bind:value {name} {min} {max} {step} />
</div>
