<script lang="ts">
	import '$css/app.css';
	import Navbar from '$components/Navbar.svelte';
	import { theme } from '$ts/stores/theme';

	let innerHeight: number | undefined;
</script>

<svelte:window bind:innerHeight />

<div
	class="w-full bg-c-bg text-c-on-bg min-h-screen flex flex-col {$theme === 'light'
		? 'theme-light'
		: 'theme-dark'}"
	style="background-image: url({$theme === 'light'
		? '/grid-on-light.svg'
		: '/grid-on-dark.svg'}); background-size: 24px;{innerHeight !== undefined
		? `min-height: ${innerHeight}px`
		: ''}"
>
	<!-- <div class="w-full h-full absolute left-0 bottom-0 bg-gradient-to-t from-c-bg to-c-bg/0" /> -->
	<Navbar />
	<main class="w-full flex-1 flex flex-col overflow-x-hidden relative">
		<slot />
	</main>
</div>
