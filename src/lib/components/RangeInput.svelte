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
</script>

<form class={classes}>
	<Slider.Root
		class="flex-1 h-full touch-none select-none cursor-grab active:cursor-grabbing relative flex 
			items-center group"
		bind:value
		{min}
		{max}
		{step}
		{name}
		{disabled}
		minStepsBetweenThumbs={step}
	>
		<Slider.Track class="relative h-2 grow rounded-full bg-c-bg-tertiary">
			<Slider.Range
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
