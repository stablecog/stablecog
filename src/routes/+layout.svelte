<script lang="ts">
	import '$css/app.css';
	import Navbar from '$components/Navbar.svelte';
	import { theme } from '$ts/stores/theme';
	import { onDestroy, onMount } from 'svelte';
	import { serverUrl } from '$ts/stores/serverUrl';
	import { browser } from '$app/environment';
	import { checkServerHealth } from '$ts/queries/checkServerHealth';
	import Footer from '$components/Footer.svelte';
	import { env as envPublic } from '$env/dynamic/public';
	import {
		currentServer,
		currentServerHealthStatus,
		defaultServer,
		defaultServerHealthStatus
	} from '$ts/stores/serverHealth';
	import type { TServerHealthStatus } from '$ts/types/main';

	let innerHeight: number | undefined;

	let bothHealthCheckTimeout: NodeJS.Timeout;
	const bothHealthCheckTimeoutDuration = 1000 * 10;
	let mounted = false;

	$: [$theme], setBodyClasses();
	$: [$serverUrl, mounted], clearAndSetHealthCheckTimeout();

	onMount(async () => {
		mounted = true;
		setBodyClasses();
	});

	onDestroy(() => {
		clearTimeout(bothHealthCheckTimeout);
	});

	async function clearAndSetHealthCheckTimeout() {
		if (mounted) {
			clearTimeout(bothHealthCheckTimeout);
			try {
				await Promise.all([getAndSetServerHealth(), getAndSetDefaultServerHealth()]);
			} catch (error) {
				console.log(error);
			} finally {
				bothHealthCheckTimeout = setTimeout(
					clearAndSetHealthCheckTimeout,
					bothHealthCheckTimeoutDuration
				);
			}
		}
	}

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

	async function getAndSetServerHealth() {
		const now = Date.now();
		let newHealthStatus: TServerHealthStatus = 'unknown';
		if (envPublic.PUBLIC_DEFAULT_SERVER_URL && $serverUrl === envPublic.PUBLIC_DEFAULT_SERVER_URL) {
			localStorage.removeItem('serverUrl');
		}
		if (!$serverUrl) {
			currentServer.set({ lastHealthStatus: 'not-set', features: undefined });
			currentServerHealthStatus.set('not-set');
			console.log('Server URL not set');
			return;
		}
		try {
			console.log('Checking server health...');
			currentServerHealthStatus.set('loading');
			const healthRes = await checkServerHealth($serverUrl);
			newHealthStatus = healthRes.status;
			if (healthRes.status === 'healthy') {
				currentServer.set({
					lastHealthStatus: 'healthy',
					features: healthRes.features ?? undefined
				});
				currentServerHealthStatus.set('healthy');
				console.log('Server is healthy ✅:', $serverUrl);
				console.log('Server features:', healthRes.features);
			} else {
				currentServer.set({
					lastHealthStatus: 'unhealthy',
					features: healthRes.features ?? undefined
				});
				currentServerHealthStatus.set('unhealthy');
				console.log('Server is unhealthy ❌:', $serverUrl);
			}
		} catch (error) {
			console.log('Server health check failed:', $serverUrl, 'Error:', error);
		} finally {
			if (newHealthStatus !== 'healthy' && newHealthStatus !== 'unhealthy') {
				currentServer.set({
					lastHealthStatus: 'unknown',
					features: $currentServer.features ?? undefined
				});
				currentServerHealthStatus.set('unknown');
			}
			console.log('Server health check took:', Date.now() - now, 'ms');
		}
	}

	async function getAndSetDefaultServerHealth() {
		const now = Date.now();
		let newHealthStatus: TServerHealthStatus = 'unknown';
		try {
			defaultServerHealthStatus.set('loading');
			console.log('Checking default server health...');
			if ($serverUrl === undefined) {
				defaultServer.set({
					lastHealthStatus: 'unhealthy',
					features: $defaultServer.features ?? undefined
				});
				defaultServerHealthStatus.set('unhealthy');
			} else {
				const healthRes = await checkServerHealth(envPublic.PUBLIC_DEFAULT_SERVER_URL);
				newHealthStatus = healthRes.status;
				if (healthRes.status === 'healthy') {
					defaultServer.set({
						lastHealthStatus: 'healthy',
						features: healthRes.features ?? undefined
					});
					defaultServerHealthStatus.set('healthy');
					console.log('Default server is healthy ✅:', envPublic.PUBLIC_DEFAULT_SERVER_URL);
					console.log('Default server features:', healthRes.features);
				} else {
					defaultServer.set({
						lastHealthStatus: 'unhealthy',
						features: healthRes.features ?? undefined
					});
					console.log('Default server is unhealthy ❌:', $serverUrl);
				}
			}
		} catch (error) {
			console.log('Default server health check failed:', $serverUrl, 'Error:', error);
		} finally {
			if (newHealthStatus !== 'healthy' && newHealthStatus !== 'unhealthy') {
				defaultServer.set({
					lastHealthStatus: 'unknown',
					features: $defaultServer.features ?? undefined
				});
				defaultServerHealthStatus.set('unknown');
			}
			console.log('Default server health check took:', Date.now() - now, 'ms');
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
