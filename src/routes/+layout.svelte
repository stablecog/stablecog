<script lang="ts">
	import '$css/app.css';
	import Navbar from '$components/Navbar.svelte';
	import { theme } from '$ts/stores/theme';
	import { onMount } from 'svelte';
	import { serverUrl } from '$ts/stores/serverUrl';
	import { browser } from '$app/environment';
	import { checkServerHealth } from '$ts/queries/checkServerHealth';
	import { serverHealth } from '$ts/stores/serverHealth';

	let innerHeight: number | undefined;

	$: [$theme], setBodyClasses();

	onMount(async () => {
		setBodyClasses();
		const now = Date.now();
		try {
			serverHealth.set('loading');
			console.log('Checking server health...');
			if ($serverUrl === undefined) {
				serverHealth.set('unhealthy');
			} else {
				const status = await checkServerHealth($serverUrl);
				if (status === 'healthy') {
					serverHealth.set('healthy');
					console.log('Server is healthy ✅:', $serverUrl);
				} else {
					serverHealth.set('unhealthy');
					console.log('Server is unhealthy ❌:', $serverUrl);
				}
			}
		} catch (error) {
			console.log('Server health check failed:', $serverUrl, 'Error:', error);
		} finally {
			if ($serverHealth !== 'healthy' && $serverHealth !== 'unhealthy') {
				serverHealth.set('unknown');
			}
			console.log('Server health check took:', Date.now() - now, 'ms');
		}
	});

	function setBodyClasses() {
		if (browser) {
			if ($theme === 'light') {
				document.body.classList.add('theme-light');
				document.body.classList.remove('theme-dark');
			} else {
				document.body.classList.add('theme-dark');
				document.body.classList.remove('theme-light');
			}
		}
	}
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
