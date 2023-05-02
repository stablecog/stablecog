<script lang="ts">
	import type { TAvailableAspectRatio } from '$ts/constants/generationSize';
	export let type: TAvailableAspectRatio;
	export { classes as class };
	let classes = 'w-6 h-6';
</script>

{#if type === '16:9'}
	<svg
		class={classes}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect x="3" y="7" width="18" height="10" rx="2" stroke="currentColor" stroke-width="1.5" />
	</svg>
{:else if type === '9:16'}
	<svg
		class={classes}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect x="7" y="3" width="10" height="18" rx="2" stroke="currentColor" stroke-width="1.5" />
	</svg>
{:else if type === '4:5'}
	<svg
		class={classes}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect x="5.5" y="4" width="13" height="16" rx="2" stroke="currentColor" stroke-width="1.5" />
	</svg>
{:else if type === '3:2'}
	<svg
		class={classes}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" stroke-width="1.5" />
	</svg>
{:else if type === '2:3'}
	<svg
		class={classes}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect x="6" y="3" width="12" height="18" rx="2" stroke="currentColor" stroke-width="1.5" />
	</svg>
{:else if type === '1:1'}
	<svg
		class={classes}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.5" />
	</svg>
{:else if type === '2.39:1'}
	<svg
		class={classes}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect x="3" y="8" width="18" height="8" rx="2" stroke="currentColor" stroke-width="1.5" />
	</svg>
{/if}
