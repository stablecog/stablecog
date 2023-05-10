<script lang="ts">
	export let width: number;
	export let height: number;
	export { classes as class };
	export let containerHeight: number | undefined = undefined;
	let classes = '';
</script>

{#if containerHeight}
	<div
		style={containerHeight
			? `height: ${containerHeight}px; width: ${containerHeight * (width / height)}px`
			: ''}
	/>
{:else}
	<svg
		style={containerHeight
			? `height: ${containerHeight}px; width: ${containerHeight * (height / width)}`
			: ''}
		class="{containerHeight ? '' : 'w-full h-auto'} {classes}"
		{width}
		{height}
		viewBox="0 0 {width} {height}"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	/>
{/if}
