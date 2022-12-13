<script lang="ts">
	import '$css/app.css';
	import Navbar from '$components/Navbar.svelte';
	import { theme } from '$ts/stores/theme';
	import { onDestroy, onMount } from 'svelte';
	import { serverUrl } from '$ts/stores/serverUrl';
	import { browser } from '$app/environment';
	import { checkServerHealth } from '$ts/queries/checkServerHealth';
	import Footer from '$components/Footer.svelte';
	import { env } from '$env/dynamic/public';
	import {
		currentServer,
		currentServerHealthStatus,
		defaultServer,
		defaultServerHealthStatus
	} from '$ts/stores/serverHealth';
	import type { TServerHealthStatus } from '$ts/types/main';
	import NavbarBottom from '$components/NavbarBottom.svelte';
	import { page } from '$app/stores';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import type { LayoutData } from './$types';
	import { locale, setLocale } from '$i18n/i18n-svelte';
	import { localeLS } from '$ts/stores/localeLS';
	import { loadLocaleAsync } from '$i18n/i18n-util.async';
	import { isLocale } from '$i18n/i18n-util';
	import { advancedMode, advancedModeApp } from '$ts/stores/advancedMode';
	import { routesWithHealthCheck, routesWithHiddenFooter } from '$ts/constants/main';

	export let data: LayoutData;
	setLocale(data.locale);

	let innerHeight: number;
	let innerWidth: number;

	let bothHealthCheckTimeout: NodeJS.Timeout;
	const bothHealthCheckTimeoutDuration = 1000 * 15;
	let mounted = false;

	$: [$theme], setBodyClasses();
	$: [$serverUrl, mounted, $page], clearAndSetHealthCheckTimeout();
	$: [innerWidth, innerHeight], setWindowStores();

	onMount(async () => {
		mounted = true;
		setBodyClasses();
		if ($localeLS && isLocale($localeLS) && $localeLS !== $locale) {
			await loadLocaleAsync($localeLS);
			setLocale($localeLS);
		}
		if (($advancedMode === true || $advancedMode === false) && $advancedMode !== $advancedModeApp) {
			advancedModeApp.set($advancedMode);
		}
	});

	onDestroy(() => {
		clearTimeout(bothHealthCheckTimeout);
	});

	function setWindowStores() {
		windowWidth.set(innerWidth);
		windowHeight.set(innerHeight);
	}

	async function clearAndSetHealthCheckTimeout() {
		if (mounted) {
			if (!routesWithHealthCheck.includes($page.url.pathname)) {
				clearTimeout(bothHealthCheckTimeout);
				return;
			}
			clearTimeout(bothHealthCheckTimeout);
			try {
				const isDefaultServer = $serverUrl === env.PUBLIC_DEFAULT_SERVER_URL;
				if (isDefaultServer) {
					console.log('Server is the default server, skipping health check for default');
				}
				await Promise.all([
					getAndSetServerHealth(isDefaultServer),
					...(!isDefaultServer ? [getAndSetDefaultServerHealth()] : [])
				]);
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

	async function getAndSetServerHealth(isDefaultServer: boolean) {
		const now = Date.now();
		let newHealthStatus: TServerHealthStatus = 'unknown';
		if (env.PUBLIC_DEFAULT_SERVER_URL && $serverUrl === env.PUBLIC_DEFAULT_SERVER_URL) {
			localStorage.removeItem('serverUrl');
		}
		if (!$serverUrl) {
			currentServer.set({ lastHealthStatus: 'not-set', features: undefined });
			currentServerHealthStatus.set('not-set');
			if (isDefaultServer) {
				defaultServer.set({
					lastHealthStatus: 'not-set',
					features: undefined
				});
				defaultServerHealthStatus.set('not-set');
			}
			console.log('Server URL not set');
			return;
		}
		try {
			console.log('Checking server health...');
			currentServerHealthStatus.set('loading');
			if (isDefaultServer) {
				defaultServerHealthStatus.set('loading');
			}
			const healthRes = await checkServerHealth($serverUrl);
			newHealthStatus = healthRes.status;
			if (healthRes.status === 'healthy') {
				currentServer.set({
					lastHealthStatus: 'healthy',
					features: healthRes.features ?? undefined
				});
				currentServerHealthStatus.set('healthy');
				if (isDefaultServer) {
					defaultServer.set({
						lastHealthStatus: 'healthy',
						features: healthRes.features ?? undefined
					});
					defaultServerHealthStatus.set('healthy');
				}
				console.log('Server is healthy ✅:', $serverUrl);
				console.log('Server features:', healthRes.features);
			} else {
				currentServer.set({
					lastHealthStatus: 'unhealthy',
					features: healthRes.features ?? undefined
				});
				currentServerHealthStatus.set('unhealthy');
				if (isDefaultServer) {
					defaultServer.set({
						lastHealthStatus: 'unhealthy',
						features: healthRes.features ?? undefined
					});
					defaultServerHealthStatus.set('unhealthy');
				}
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
				if (isDefaultServer) {
					defaultServer.set({
						lastHealthStatus: 'unknown',
						features: $defaultServer.features ?? undefined
					});
					defaultServerHealthStatus.set('unknown');
				}
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
				const healthRes = await checkServerHealth(env.PUBLIC_DEFAULT_SERVER_URL);
				newHealthStatus = healthRes.status;
				if (healthRes.status === 'healthy') {
					defaultServer.set({
						lastHealthStatus: 'healthy',
						features: healthRes.features ?? undefined
					});
					defaultServerHealthStatus.set('healthy');
					console.log('Default server is healthy ✅:', env.PUBLIC_DEFAULT_SERVER_URL);
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

<svelte:window bind:innerHeight bind:innerWidth />

<div
	class="w-full relative bg-c-bg text-c-on-bg
	min-h-screen flex flex-col {$theme === 'light' ? 'theme-light' : 'theme-dark'}"
	style="background-image: url({$theme === 'light'
		? '/illustrations/grid-on-light.svg'
		: '/illustrations/grid-on-dark.svg'}); background-size: 24px;{innerHeight !== undefined
		? `min-height: ${innerHeight}px`
		: ''}"
>
	<Navbar />
	<main class="w-full flex-1 flex flex-col relative break-words">
		<slot />
	</main>
	{#if !routesWithHiddenFooter.includes($page.url.pathname)}
		<Footer />
	{/if}
	<NavbarBottom class="md:hidden h-[calc(3.75rem+env(safe-area-inset-bottom))]" />
	<div class="md:hidden h-[calc(3.75rem+env(safe-area-inset-bottom))]" />
	<div
		id="tooltip-container"
		class="absolute overflow-x-hidden left-0 top-0 w-full h-full pointer-events-none"
	/>
</div>
