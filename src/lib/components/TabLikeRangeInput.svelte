<script lang="ts">
	import RangeInput from '$components/RangeInput.svelte';

	export let value: number;
	export let min: number;
	export let max: number;
	export { classes as class };
	let classes = '';
</script>

<div
	class="w-full flex items-stretch bg-c-bg shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] 
	ring-2 ring-c-bg-secondary rounded-xl transition relative {classes}"
>
	<div class="self-stretch flex text-c-on-bg/30">
		<slot name="title" />
	</div>
	<div class="w-2px mr-px -ml-px self-stretch">
		<div class="w-full h-full bg-c-bg-secondary" />
	</div>
	<div class="range-input flex-1 min-w-0 flex relative rounded-r-xl pl-3 pr-4 gap-3">
		<div class="w-5 flex items-center">
			<p
				class="w-full text-right overflow-hidden overflow-ellipsis text-xs md:text-sm 
				text-c-on-bg/75 font-medium"
			>
				{value}
			</p>
		</div>
		<RangeInput class="flex-1 h-12 md:h-13" classInput="rounded-lg" bind:value {min} {max} />
	</div>
</div>

<style>
	.range-input {
		--track-bg: rgba(var(--c-bg-tertiary));
		--track-bg-progressed: rgba(var(--c-on-bg) / 0.25);
		--track-height: 0.5rem;
		--track-radius: 9999px;
		--thumb-size: 1.5rem;
		--thumb-bg: rgba(var(--c-bg-tertiary));
		--thumb-radius: 9999px;
		--thumb-shadow: 0 0.25rem 0.5rem 0 rgba(var(--c-shadow) / var(--o-shadow-strong));
	}
</style>
