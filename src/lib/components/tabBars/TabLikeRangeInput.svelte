<script lang="ts">
	import RangeInputWithNumerator from '$components/RangeInputWithNumerator.svelte';
	import TabBarWrapper from '$components/tabBars/TabBarWrapper.svelte';

	export let value: number;
	export let min: number;
	export let max: number;
	export let step = 1;
	export let disabled: boolean;
	export { classes as class };
	let classes = '';
</script>

<TabBarWrapper class={classes}>
	<div class="self-stretch flex text-c-on-bg/50">
		<slot name="title" />
	</div>
	<div class="w-2px mr-px -ml-px self-stretch">
		<div class="w-full h-full bg-c-bg-secondary transition" />
	</div>
	<RangeInputWithNumerator bind:value {step} {max} {min} {disabled} />
</TabBarWrapper>
