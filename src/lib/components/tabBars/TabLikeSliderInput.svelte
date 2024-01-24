<script lang="ts">
	import SliderInputWithNumerator from '$components/primitives/SliderInputWithNumerator.svelte';
	import TabBarWrapper from '$components/tabBars/TabBarWrapper.svelte';

	export let value: number;
	export let min: number;
	export let max: number;
	export let step = 1;
	export let name: string;
	export let disabled: boolean = false;
	export let hasTitle = true;
	export let valueSize: 'sm' | 'md' = 'sm';
	export let numeratorFormatter: (value: number) => string = (value) => value.toString();
	export { classes as class };
	let classes = '';
</script>

<TabBarWrapper class={classes}>
	{#if hasTitle}
		<div class="self-stretch flex text-c-on-bg/50">
			<slot name="title" />
		</div>
		<div class="w-2px mr-px -ml-px self-stretch">
			<div class="w-full h-full bg-c-bg-secondary transition" />
		</div>
	{/if}
	<SliderInputWithNumerator
		bind:value
		{valueSize}
		{step}
		{name}
		{max}
		{min}
		{disabled}
		{numeratorFormatter}
	/>
</TabBarWrapper>
