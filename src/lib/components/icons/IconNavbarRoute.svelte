<script lang="ts">
	import IconImage from '$components/icons/IconImage.svelte';
	import type { TNavbarRouteOption } from '$components/navigation/routes';

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
{:else if type === 'generate'}
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
			d="M7.28 3.83c.97.16 1.73.92 1.9 1.9.06.36.58.36.65 0 .16-.98.92-1.74 1.9-1.9.36-.07.36-.6 0-.66a2.31 2.31 0 0 1-1.9-1.9c-.07-.36-.6-.36-.66 0a2.31 2.31 0 0 1-1.9 1.9c-.36.07-.36.6 0 .66Zm11 11c.97.16 1.73.92 1.9 1.9.06.36.58.36.65 0 .16-.98.92-1.74 1.9-1.9.36-.07.36-.6 0-.66a2.31 2.31 0 0 1-1.9-1.9c-.07-.36-.6-.36-.66 0a2.31 2.31 0 0 1-1.9 1.9c-.36.07-.36.6 0 .66Zm1.9-9.1a2.31 2.31 0 0 0-1.9-1.9c-.37-.07-.37-.6 0-.66a2.31 2.31 0 0 0 1.9-1.9c.06-.36.58-.36.65 0 .16.98.92 1.74 1.9 1.9.36.07.36.6 0 .66-.98.16-1.74.92-1.9 1.9-.07.36-.6.36-.66 0Zm-6.64 1.2a2.5 2.5 0 0 1 3.53 3.53l-1.12 1.13-3.54-3.54 1.13-1.12Zm1.44 5.62-8.52 8.52a2.5 2.5 0 0 1-3.53-3.53l8.52-8.52 3.53 3.53Zm-3.53-1.6L3.89 18.5a1.14 1.14 0 0 0 1.61 1.6l7.55-7.55-1.6-1.6Z"
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
	<IconImage class={classes} />
{:else if type === 'servers'}
	<svg
		class={classes}
		width="24"
		height="24"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z"
		/>
	</svg>
{:else if type === 'users'}
	<svg
		class={classes}
		width="24"
		height="24"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
		/>
	</svg>
{:else if type === 'guide'}
	<svg
		class={classes}
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="currentColor"
	>
		<path
			d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z"
		/>
	</svg>
{:else if type === 'admin'}
	<svg
		class={classes}
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="currentColor"
	>
		<path
			fill-rule="evenodd"
			d="M12 6.75a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0112 6.75zM4.117 19.125a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z"
			clip-rule="evenodd"
		/>
	</svg>
{/if}
