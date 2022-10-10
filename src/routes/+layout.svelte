<script lang="ts">
	import '$css/app.css';
	import Navbar from '$components/Navbar.svelte';
	import { theme } from '$ts/stores/theme';
	import { onMount } from 'svelte';
	import { serverUrl } from '$ts/stores/serverUrl';
	import { browser } from '$app/environment';
	import { checkServerHealth } from '$ts/queries/checkServerHealth';
	import { serverHealth } from '$ts/stores/serverHealth';
	import Footer from '$components/Footer.svelte';

	let innerHeight: number | undefined;

	$: [$theme], setBodyClasses();

	onMount(async () => {
		setBodyClasses();
		const now = Date.now();
		if (!$serverUrl) {
			serverHealth.set({ status: 'not-set' });
			return;
		}
		try {
			serverHealth.set({ status: 'loading', features: $serverHealth.features });
			console.log('Checking server health...');
			if ($serverUrl === undefined) {
				serverHealth.set({ status: 'unhealthy' });
			} else {
				const healthRes = await checkServerHealth($serverUrl);
				if (healthRes.status === 'healthy') {
					serverHealth.set({ status: 'healthy', features: healthRes.features ?? undefined });
					console.log('Server is healthy ✅:', $serverUrl);
					console.log('Server features:', healthRes.features);
				} else {
					serverHealth.set({ status: 'unhealthy' });
					console.log('Server is unhealthy ❌:', $serverUrl);
				}
			}
		} catch (error) {
			console.log('Server health check failed:', $serverUrl, 'Error:', error);
		} finally {
			if ($serverHealth.status !== 'healthy' && $serverHealth.status !== 'unhealthy') {
				serverHealth.set({ status: 'unknown' });
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
	<Navbar />
	<main class="w-full flex-1 flex flex-col overflow-x-hidden relative break-words">
		<slot />
	</main>
	<Footer />
</div>
