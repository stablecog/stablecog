<script lang="ts">
	export let max: number;
	export let min: number;
	export let value: number;
	export let focused = false;
	export { classes as class };
	let classes = '';

	let itemHeight;

	$: array = Array.from({ length: max - min + 1 }, (_, i) => i + min);
</script>

<div class="relative">
	<div class="overflow-hidden relative py-3.5 {classes}">
		<div class="relative z-0 text-center">
			<p bind:clientHeight={itemHeight} class="opacity-0">{max}</p>
			<div
				style="transform: translateY(-{array.findIndex((i) => i === value) * itemHeight}px)"
				class="flex flex-col transition absolute left-0 top-0"
			>
				{#each array as n}
					<p class="transform transition font-medium {n === value ? 'scale-100' : 'scale-75'}">
						{n}
					</p>
				{/each}
			</div>
		</div>
	</div>
	<div
		class="absolute left-0 -top-0.25 bg-gradient-to-b transition
		from-c-bg via-c-bg/50 to-c-bg/0 w-full h-5 {focused ? 'opacity-100' : 'opacity-0'}"
	/>
	<div
		class="absolute left-0 -bottom-0.25 bg-gradient-to-t transition
		from-c-bg via-c-bg/50 to-c-bg/0 w-full h-5 {focused ? 'opacity-100' : 'opacity-0'}"
	/>
	<div
		class="absolute left-0 -top-0.25 bg-gradient-to-b transition
		from-c-bg via-c-bg to-c-bg/0 w-full h-5 {!focused ? 'opacity-100' : 'opacity-0'}"
	/>
	<div
		class="absolute left-0 -bottom-0.25 bg-gradient-to-t transition
		from-c-bg via-c-bg to-c-bg/0 w-full h-5 {!focused ? 'opacity-100' : 'opacity-0'}"
	/>
</div>
