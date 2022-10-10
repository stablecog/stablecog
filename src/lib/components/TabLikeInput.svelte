<script lang="ts">
	import TabBarWrapper from '$components/TabBarWrapper.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';

	export let value: number | string | undefined;
	export let placeholder: string | undefined = undefined;
	export { classes as class };
	export let type: 'text' | 'number' = 'number';
	export let max: undefined | number = undefined;
	let classes = '';
</script>

<TabBarWrapper class={classes}>
	{#if type === 'text'}
		<div class="self-stretch flex text-c-on-bg/30">
			<slot name="title" />
		</div>
		<div class="w-2px mr-px -ml-px self-stretch">
			<div class="w-full h-full bg-c-bg-secondary" />
		</div>
		<div class="flex-1 min-w-0 flex relative rounded-r-xl">
			<input
				on:keypress={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						e.stopPropagation();
					}
				}}
				bind:value
				on:input={() => {
					if (
						max !== undefined &&
						value !== null &&
						value !== undefined &&
						value.toString().length > max
					) {
						value = parseInt(value.toString().slice(0, 15));
					}
				}}
				{placeholder}
				type="text"
				class="text-base w-full text-c-on-bg/75 self-stretch overflow-ellipsis ring-0 transition ring-c-primary/20 focus:ring-2 
						px-4 py-3 md:py-3.5 rounded-r-xl bg-transparent placeholder:text-c-on-bg/30 {!$isTouchscreen
					? 'hover:ring-2'
					: ''}"
			/>
		</div>
	{:else}
		<div class="self-stretch flex text-c-on-bg/30">
			<slot name="title" />
		</div>
		<div class="w-2px mr-px -ml-px self-stretch">
			<div class="w-full h-full bg-c-bg-secondary" />
		</div>
		<div class="flex-1 min-w-0 flex relative rounded-r-xl">
			<input
				on:keypress={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						e.stopPropagation();
					}
				}}
				bind:value
				on:input={() => {
					if (
						max !== undefined &&
						value !== null &&
						value !== undefined &&
						value.toString().length > 15
					) {
						value = parseInt(value.toString().slice(0, 15));
					}
				}}
				{placeholder}
				type="number"
				class="text-base w-full text-c-on-bg/75 self-stretch overflow-ellipsis ring-0 transition ring-c-primary/20 focus:ring-2 
					px-4 py-3 md:py-3.5 rounded-r-xl bg-transparent placeholder:text-c-on-bg/30 {!$isTouchscreen
					? 'hover:ring-2'
					: ''}"
			/>
		</div>
	{/if}
</TabBarWrapper>
