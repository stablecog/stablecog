<script lang="ts">
	import '$css/app.css';
	import Navbar from '$components/Navbar.svelte';
	import { theme } from '$ts/stores/theme';
	import { onMount } from 'svelte';
	import { serverUrl } from '$ts/stores/serverUrl';
	import { defaultServerUrl } from '$ts/constants/main';
	import { iterationMpPerSec } from '$ts/stores/iterationMpPerSec';

	let innerHeight: number | undefined;

	onMount(() => {
		if ($serverUrl === undefined || $serverUrl === null || $serverUrl === '') {
			serverUrl.set(defaultServerUrl);
		}
		if ($iterationMpPerSec === undefined) {
			iterationMpPerSec.set(1000000);
		}
	});
</script>

<svelte:window bind:innerHeight />

<div
	class="w-full bg-c-bg text-c-on-bg min-h-screen flex flex-col {$theme === 'light'
		? 'theme-light'
		: 'theme-dark'}"
	style="background-image: url({$theme === 'light'
		? '/illustrations/grid-on-light.svg'
		: '/illustrations/grid-on-dark.svg'}); background-size: 24px;{innerHeight !== undefined
		? `min-height: ${innerHeight}px`
		: ''}"
>
	<!-- <div class="w-full h-full absolute left-0 bottom-0 bg-gradient-to-t from-c-bg to-c-bg/0" /> -->
	<Navbar />
	<main class="w-full flex-1 flex flex-col overflow-x-hidden relative">
		<slot />
	</main>
</div>
