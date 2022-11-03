<script lang="ts">
	import type { TNavbarRouteOption } from '$ts/types/main';

	export let type: TNavbarRouteOption;
	export { classes as class };
	let classes = 'w-6 h-6';
</script>

{#if type === 'home'}
	<svg
		class={classes}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M11.293 2.293a1 1 0 0 1 1.414 0l10 10a1 1 0 0 1-1.414 1.414L21 13.414V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 8-8ZM11 20h3v-3.5a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0-.5.5V20Zm5 0v-4a2 2 0 0 0-2-2h-3a2 2 0 0 0-2 2v4H5.5a.5.5 0 0 1-.5-.5v-8.086l7-7 7 7V19.5a.5.5 0 0 1-.5.5H16Z"
			fill="currentColor"
		/>
	</svg>
{:else if type === 'history'}
	<svg
		class={classes}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M5.754 7A8 8 0 1 1 4 12a1 1 0 1 0-2 0c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2a9.968 9.968 0 0 0-7.064 2.923V4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1H7a1 1 0 0 0 0-2H5.754ZM13 7a1 1 0 1 0-2 0v5a1 1 0 0 0 1 1h3a1 1 0 1 0 0-2h-2V7Z"
			fill="currentColor"
		/>
	</svg>
{:else if type === 'live'}
	<svg
		class={classes}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M5.559 4.286A1 1 0 0 1 5.573 5.7 8.968 8.968 0 0 0 3 12c0 2.453.98 4.676 2.573 6.3a1 1 0 1 1-1.429 1.4A10.967 10.967 0 0 1 1 12c0-2.998 1.2-5.717 3.144-7.7a1 1 0 0 1 1.415-.014Zm12.882 0a1 1 0 0 1 1.415.014A10.967 10.967 0 0 1 23 12c0 2.998-1.2 5.717-3.145 7.7a1 1 0 1 1-1.428-1.4A8.967 8.967 0 0 0 21 12c0-2.453-.98-4.676-2.573-6.3a1 1 0 0 1 .014-1.414ZM8.195 7.255a1 1 0 0 1 .078 1.412A4.978 4.978 0 0 0 7 12c0 1.281.48 2.448 1.273 3.333a1 1 0 1 1-1.49 1.334A6.977 6.977 0 0 1 5 12c0-1.792.675-3.43 1.783-4.667a1 1 0 0 1 1.412-.078Zm7.61 0a1 1 0 0 1 1.412.078A6.977 6.977 0 0 1 19 12c0 1.792-.675 3.43-1.783 4.667a1 1 0 1 1-1.49-1.334A4.978 4.978 0 0 0 17 12c0-1.281-.48-2.448-1.273-3.333a1 1 0 0 1 .078-1.412ZM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
			fill="currentColor"
		/>
	</svg>
{:else if type === 'blog'}
	<svg
		class={classes}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M6 3a1 1 0 0 0-2 0v2c0 1.395.953 2.568 2.243 2.904l-.999 3.995a3 3 0 0 0 .415 2.392l5.509 8.264a1 1 0 0 0 1.664 0l5.457-8.186a3 3 0 0 0 .35-2.613l-1.26-3.78A3 3 0 0 0 20 5V3a1 1 0 1 0-2 0v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3Zm2.28 5-1.095 4.384a1 1 0 0 0 .138.797L11 18.697v-4.965A2 2 0 0 1 12 10a2 2 0 0 1 1 3.732v4.965l3.625-5.438a1 1 0 0 0 .117-.87L15.279 8H8.281Z"
			fill="currentColor"
		/>
	</svg>
{:else if type === 'gallery'}
	<svg
		class={classes}
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill="none"
		viewBox="0 0 24 24"
	>
		<path
			fill="currentColor"
			fill-rule="evenodd"
			d="M4 2.25A2.75 2.75 0 0 0 1.25 5v14A2.75 2.75 0 0 0 4 21.75h16A2.75 2.75 0 0 0 22.75 19V5A2.75 2.75 0 0 0 20 2.25H4Zm17.25 11.94V5c0-.69-.56-1.25-1.25-1.25H4c-.69 0-1.25.56-1.25 1.25v8.97l3.16-3.69a2.75 2.75 0 0 1 4.18 0l3.03 3.54 1.94-1.94a2.75 2.75 0 0 1 3.88 0l2.31 2.3Zm-7.15.77 2.02-2.02a1.25 1.25 0 0 1 1.76 0l3.37 3.37V19c0 .69-.56 1.25-1.25 1.25H4c-.69 0-1.25-.56-1.25-1.25v-2.72l4.3-5.02c.5-.58 1.4-.58 1.9 0l4.48 5.23a.75.75 0 1 0 1.14-.98l-.47-.55ZM13.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
			clip-rule="evenodd"
		/>
	</svg>
{/if}
