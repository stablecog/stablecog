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
			d="M5.25364 7.25C6.74775 5.13187 9.21301 3.75 12 3.75C16.5563 3.75 20.25 7.44365 20.25 12C20.25 16.5563 16.5563 20.25 12 20.25C7.44365 20.25 3.75 16.5563 3.75 12C3.75 11.5858 3.41421 11.25 3 11.25C2.58579 11.25 2.25 11.5858 2.25 12C2.25 17.3848 6.61522 21.75 12 21.75C17.3848 21.75 21.75 17.3848 21.75 12C21.75 6.61522 17.3848 2.25 12 2.25C9.08612 2.25 6.4716 3.52831 4.68552 5.55323V4C4.68552 3.58579 4.34973 3.25 3.93552 3.25C3.52131 3.25 3.18552 3.58579 3.18552 4V8C3.18552 8.41421 3.52131 8.75 3.93552 8.75H7C7.41421 8.75 7.75 8.41421 7.75 8C7.75 7.58579 7.41421 7.25 7 7.25H5.25364ZM12.75 7C12.75 6.58579 12.4142 6.25 12 6.25C11.5858 6.25 11.25 6.58579 11.25 7V12C11.25 12.4142 11.5858 12.75 12 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V7Z"
			fill="currentcolor"
		/>
	</svg>
{:else if type === 'pricing'}
	<svg
		class={classes}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M2.25 18.75c5.34 0 10.65.7 15.8 2.1.72.2 1.45-.34 1.45-1.1v-1M18 10.5h.5m-13 0H6M2.25 5.62c0-.62.5-1.12 1.13-1.12h17.25c.62 0 1.12.5 1.12 1.13v9.75c0 .62-.5 1.12-1.13 1.12H3.38c-.6 0-1.12-.51-1.12-1.13V5.63ZM15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{:else if type === 'account'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={classes}
		width="24"
		height="24"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
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
			d="M5.75 3C5.75 2.58579 5.41421 2.25 5 2.25C4.58579 2.25 4.25 2.58579 4.25 3V5C4.25 6.36506 5.24459 7.49781 6.54863 7.71314L5.48697 11.9598C5.29906 12.7114 5.43695 13.5075 5.86673 14.1522L11.376 22.416C11.5151 22.6247 11.7492 22.75 12 22.75C12.2508 22.75 12.4849 22.6247 12.624 22.416L18.0814 14.2299C18.5522 13.5238 18.6705 12.6399 18.4022 11.8349L17.0405 7.74971C18.5406 7.72807 19.75 6.50527 19.75 5V3C19.75 2.58579 19.4142 2.25 19 2.25C18.5858 2.25 18.25 2.58579 18.25 3V5C18.25 5.69036 17.6904 6.25 17 6.25H16.0175C16.0059 6.24973 15.9943 6.24973 15.9827 6.25H7.51568C7.50482 6.24976 7.49399 6.24976 7.48319 6.25H7C6.30964 6.25 5.75 5.69036 5.75 5V3ZM8.08558 7.75L6.94219 12.3236C6.85677 12.6652 6.91945 13.0271 7.1148 13.3201L11.25 19.5229V14.3546C10.517 14.0579 10 13.3393 10 12.5C10 11.3954 10.8954 10.5 12 10.5C13.1046 10.5 14 11.3954 14 12.5C14 13.3393 13.483 14.0579 12.75 14.3546V19.5229L16.8334 13.3979C17.0473 13.0769 17.1011 12.6751 16.9792 12.3092L15.4594 7.75H8.08558Z"
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
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class={classes}
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
		/>
	</svg>
{:else if type === 'admin'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class={classes}
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z"
		/>
		<path stroke-linecap="round" stroke-linejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008z" />
	</svg>
{:else if type === 'documentation'}
	<svg
		class={classes}
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
		/>
	</svg>
{:else if type === 'voiceover'}
	<svg
		class={classes}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M12 18.75C13.5913 18.75 15.1174 18.1179 16.2426 16.9926C17.3679 15.8674 18 14.3413 18 12.75V11.25M12 18.75C10.4087 18.75 8.88258 18.1179 7.75736 16.9926C6.63214 15.8674 6 14.3413 6 12.75V11.25M12 18.75V22.5M8.25 22.5H15.75M12 15.75C11.2044 15.75 10.4413 15.4339 9.87868 14.8713C9.31607 14.3087 9 13.5456 9 12.75V4.5C9 3.70435 9.31607 2.94129 9.87868 2.37868C10.4413 1.81607 11.2044 1.5 12 1.5C12.7956 1.5 13.5587 1.81607 14.1213 2.37868C14.6839 2.94129 15 3.70435 15 4.5V12.75C15 13.5456 14.6839 14.3087 14.1213 14.8713C13.5587 15.4339 12.7956 15.75 12 15.75Z"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{:else if type === 'resources'}
	<svg
		class={classes}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M20.25 12v-.63A3.37 3.37 0 0 0 16.87 8h-1.5a1.13 1.13 0 0 1-1.12-1.13v-1.5A3.37 3.37 0 0 0 10.87 2m.13 9.75h5.5m-5.5 3h2.75M7.25 5.5v-2c0-.83.67-1.5 1.5-1.5h2.5a9 9 0 0 1 9 9v6c0 .83-.67 1.5-1.5 1.5h-2m-9.5-13V17c0 .83.67 1.5 1.5 1.5h8m-9.5-13h-2c-.83 0-1.5.67-1.5 1.5v13.5c0 .83.67 1.5 1.5 1.5h10c.83 0 1.5-.67 1.5-1.5v-2"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{:else if type === 'logs'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class={classes}
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
		/>
	</svg>
{/if}
