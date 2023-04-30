<script lang="ts">
	import { Slider } from 'radix-svelte';

	export let value: number;
	export let min: number;
	export let max: number;
	export let step: number;
	export let disabled = false;
	export let name: string;
	export { classes as class };
	let classes = '';

	let internalValue: number[];
	$: value, onValueChanged();
	$: internalValue, onInternalValueChanged();

	function onValueChanged() {
		if (disabled) return;
		if (internalValue && value === internalValue[0]) return;
		internalValue = [value];
	}

	function onInternalValueChanged() {
		if (disabled) return;
		if (internalValue === undefined || value === internalValue[0]) return;
		value = internalValue[0];
	}
</script>

<form class={classes}>
	<Slider.Root
		class="flex-1 touch-none select-none cursor-pointer relative flex 
			items-center h-full group"
		bind:value={internalValue}
		{min}
		{max}
		{step}
		{name}
		{disabled}
		minStepsBetweenThumbs={step}
	>
		<Slider.Track
			on:focus={() => console.log('root focused')}
			class="relative h-2 grow rounded-full bg-c-bg-tertiary"
		>
			<Slider.Range
				on:focus={() => console.log('root focused')}
				class="absolute h-2 rounded-full transition bg-c-on-bg-secondary group-active:bg-c-primary"
			/>
		</Slider.Track>
		<Slider.Thumb
			class="block ring-0 ring-c-on-bg-secondary/50 group-hover:ring-8 group-active:ring-c-primary/50 
			transition shadow-lg shadow-c-shadow/[var(--o-shadow-strongest)] h-6 w-6 rounded-full bg-c-on-bg-secondary
			group-active:bg-c-primary group-active:ring-4 outline-none"
		/>
	</Slider.Root>
</form>
