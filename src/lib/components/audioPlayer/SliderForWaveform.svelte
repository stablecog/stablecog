<script lang="ts">
	import { Slider } from 'radix-svelte';
	export let value: number;
	export let min: number;
	export let max: number;
	export let step: number;
	export let name: string;
	export let height: number;
</script>

<form class="w-full h-full">
	<Slider.Root
		class="h-full touch-none select-none cursor-pointer relative flex 
      items-end group overflow-hidden pt-4"
		bind:value
		{min}
		{max}
		{step}
		{name}
	>
		<Slider.Track class="relative h-full grow">
			<Slider.Range class="absolute h-full transition" />
		</Slider.Track>
		<Slider.Thumb
			style="height: {height - 4}px"
			class="transition shadow-lg shadow-c-shadow/[var(--o-shadow-strongest)] w-4px bg-c-primary/0
				outline-none transform rounded-t-full group-hover:scale-x-100 group-hover:bg-c-primary/50 
				scale-x-0 group-active:scale-x-100 group-active:bg-c-primary"
		/>
	</Slider.Root>
</form>
