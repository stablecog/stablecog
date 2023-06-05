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
		class="h-full touch-none select-none cursor-grab active:cursor-grabbing relative flex 
      items-end group overflow-hidden"
		bind:value
		{min}
		{max}
		{step}
		{name}
	>
		<Slider.Track class="relative h-full grow flex flex-col justify-end">
			<Slider.Range
				class="absolute h-4px bg-c-primary/50 origin-right 
				group-hover:scale-x-0 group-active:scale-x-0 transition rounded-r-full"
			/>
		</Slider.Track>
		<Slider.Thumb
			style="height: {height - 4}px"
			class="transition w-4px bg-c-primary/50
				outline-none rounded-full origin-bottom transform group-active:bg-c-primary
				scale-y-0 group-hover:scale-y-100 group-active:scale-y-100"
		/>
	</Slider.Root>
</form>
