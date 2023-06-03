<script lang="ts">
	import { Slider } from 'radix-svelte';
	export let value: number;
	export let min: number;
	export let max: number;
	export let step: number;
	export let name: string;
</script>

<form class="w-full h-full">
	<Slider.Root
		class="flex-1 h-full touch-none select-none cursor-pointer relative flex 
      items-center group"
		bind:value
		{min}
		{max}
		{step}
		{name}
	>
		<Slider.Track class="relative h-6px grow rounded-full bg-c-bg-tertiary">
			<Slider.Range
				class="absolute h-6px rounded-full transition bg-c-on-bg group-active:bg-c-primary"
			/>
		</Slider.Track>
		<Slider.Thumb
			class="block ring-0 ring-c-on-bg/25 group-hover:ring-[6px] group-active:ring-c-primary/50 
      transition shadow-lg shadow-c-shadow/[var(--o-shadow-strongest)] h-4.5 w-4.5 rounded-full bg-c-on-bg
      group-active:bg-c-primary group-active:ring-[3px] outline-none transform opacity-0 scale-75 group-hover:scale-100
      group-hover:opacity-100"
		/>
	</Slider.Root>
</form>
