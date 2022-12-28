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
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M5 2.25A3.75 3.75 0 0 0 1.25 6v12A3.75 3.75 0 0 0 5 21.75h14A3.75 3.75 0 0 0 22.75 18V6A3.75 3.75 0 0 0 19 2.25H5Zm16.25 11.94V6c0-1.24-1-2.25-2.25-2.25H5c-1.24 0-2.25 1-2.25 2.25v7.97l3.17-3.7a2.75 2.75 0 0 1 4.17 0l3.06 3.52 1.9-1.9a2.75 2.75 0 0 1 3.9 0l2.3 2.3Zm-7.12.74 1.99-1.99a1.25 1.25 0 0 1 1.76 0l3.37 3.37V18c0 1.24-1 2.25-2.25 2.25H5c-1.24 0-2.25-1-2.25-2.25v-1.72l4.3-5.03c.5-.58 1.4-.58 1.9 0l4.98 5.74a.75.75 0 0 0 1.14-.98l-.94-1.08ZM13.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
			fill="currentColor"
		/>
	</svg>
{:else if type === 'servers'}
	<svg
		class={classes}
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
{/if}
