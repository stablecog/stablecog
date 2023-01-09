<script lang="ts">
	import '$css/app.css';
	import Navbar from '$components/navigation/Navbar.svelte';
	import { theme, themeApp } from '$ts/stores/theme';
	import { onDestroy, onMount } from 'svelte';
	import { serverUrl } from '$ts/stores/serverUrl';
	import { browser } from '$app/environment';
	import { checkServerHealth } from '$ts/queries/checkServerHealth';
	import Footer from '$components/navigation/Footer.svelte';
	import { env } from '$env/dynamic/public';
	import {
		currentServer,
		currentServerHealthStatus,
		defaultServer,
		defaultServerHealthStatus
	} from '$ts/stores/serverHealth';
	import type { TServerHealthStatus } from '$ts/types/main';
	import NavbarBottom from '$components/navigation/NavbarBottom.svelte';
	import { page } from '$app/stores';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import type { LayoutData } from './$types';
	import { locale, setLocale } from '$i18n/i18n-svelte';
	import { localeLS } from '$ts/stores/localeLS';
	import { loadLocaleAsync } from '$i18n/i18n-util.async';
	import { isLocale } from '$i18n/i18n-util';
	import { advancedMode, advancedModeApp } from '$ts/stores/advancedMode';
	import { routesWithHealthCheck, routesWithHiddenFooter } from '$ts/constants/main';
	import mixpanel from 'mixpanel-browser';
	import { supabase } from '$ts/constants/supabase';
	import { afterNavigate, invalidate, invalidateAll } from '$app/navigation';
	import { mLogPageview } from '$ts/helpers/loggers';
	import { setCookie } from '$ts/helpers/setCookie';
	import { didClearSupabaseTokenBefore } from '$ts/stores/didClearSupabaseTokenBefore';

	export let data: LayoutData;
	setLocale(data.locale);

	const th = data.themeStore;
	themeApp.set($th);
	if (data.theme !== null) themeApp.set(data.theme);

	const adv = data.advancedModeStore;
	advancedModeApp.set($adv);
	if (data.advancedMode !== null && data.advancedMode !== undefined) {
		advancedModeApp.set(data.advancedMode);
	}

	let innerHeight: number;
	let innerWidth: number;

	let bothHealthCheckTimeout: NodeJS.Timeout;
	const bothHealthCheckTimeoutDuration = 1000 * 15;
	let mounted = false;

	$: [$themeApp], setBodyClasses();
	$: [$serverUrl, mounted, $page], clearAndSetHealthCheckTimeout();
	$: [innerWidth, innerHeight], setWindowStores();

	$: if (mounted && $page.data.session?.user.id) {
		mixpanel.identify($page.data.session?.user.id);
		mixpanel.people.set({ $email: $page.data.session?.user.email });
		mixpanel.people.set({ 'SC - Plan': $page.data.plan });
	}

	function removeItem(sKey: string, sPath: string, sDomain: string) {
		document.cookie =
			encodeURIComponent(sKey) +
			'=; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
			(sDomain ? '; domain=' + sDomain : '') +
			(sPath ? '; path=' + sPath : '');
	}

	onMount(async () => {
		mixpanel.init(env.PUBLIC_MIXPANEL_ID, { api_host: env.PUBLIC_MIXPANEL_URL });
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(() => {
			invalidateAll();
		});
		if (!$didClearSupabaseTokenBefore) {
			removeItem('supabase-auth-token', '/', 'stablecog.com');
			removeItem('sb-refresh-token', '/', 'azwnrqkywgmlooolxxgm.supabase.co');
			removeItem('sb-access-token', '/', 'azwnrqkywgmlooolxxgm.supabase.co');
			didClearSupabaseTokenBefore.set(true);
			document.location.reload();
		}
		setBodyClasses();
		if ($localeLS && isLocale($localeLS) && $localeLS !== $locale) {
			await loadLocaleAsync($localeLS);
			setLocale($localeLS);
		}
		if (($advancedMode === true || $advancedMode === false) && $advancedMode !== $advancedModeApp) {
			advancedModeApp.set($advancedMode);
		}
		if ($theme !== null && $theme !== $themeApp) {
			themeApp.set($theme);
		}
		mounted = true;
		return () => {
			subscription.unsubscribe();
		};
	});

	afterNavigate(() => {
		const props = {
			'SC - Page': `${$page.url.pathname}${$page.url.search}`,
			'SC - Locale': $locale,
			'SC - Advanced Mode': $advancedModeApp,
			'SC - Plan': $page.data.plan
		};
		mLogPageview(props);
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
			if ($themeApp === 'light') {
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

	const runIfMounted = (fn: () => void) => {
		if (mounted) fn();
	};
	$: $locale, runIfMounted(() => setCookie(`sc-locale=${$locale}`));
	$: $themeApp, runIfMounted(() => setCookie(`sc-theme=${$themeApp}`));
	$: $advancedModeApp, runIfMounted(() => setCookie(`sc-advanced-mode=${$advancedModeApp}`));
</script>

<svelte:window bind:innerHeight bind:innerWidth />

<div
	class="w-full relative bg-c-bg text-c-on-bg
	min-h-screen flex flex-col {$themeApp === 'light' ? 'theme-light' : 'theme-dark'}"
	style="background-image: url({$themeApp === 'light'
		? '/illustrations/grid-on-light.svg'
		: '/illustrations/grid-on-dark.svg'}); background-size: 24px;{innerHeight !== undefined
		? `min-height: ${innerHeight}px`
		: ''}"
>
	{#if !$page.url.pathname.startsWith('/admin')}
		<p class="flex flex-1 items-center justify-center px-6 py-4">
			We're trying to fix some problems, we'll be back in 1-2 hours.
		</p>
	{/if}
	{#if $page.url.pathname.startsWith('/admin')}
		<Navbar />
		<main class="w-full flex-1 flex flex-col relative break-words">
			<slot />
		</main>
	{/if}
	{#if !routesWithHiddenFooter.includes($page.url.pathname)}
		<Footer />
	{/if}
	{#if $page.url.pathname.startsWith('/admin')}
		<NavbarBottom class="md:hidden h-[calc(3.75rem+env(safe-area-inset-bottom))]" />
		<div class="md:hidden h-[calc(3.75rem+env(safe-area-inset-bottom))]" />
		<div
			id="tooltip-container"
			class="absolute overflow-x-hidden left-0 top-0 w-full h-full pointer-events-none"
		/>
	{/if}
</div>
