<script lang="ts">
	import '$css/app.css';
	import Navbar from '$components/navigation/Navbar.svelte';
	import { theme, themeApp } from '$ts/stores/theme';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Footer from '$components/navigation/Footer.svelte';
	import { env } from '$env/dynamic/public';
	import NavbarBottom from '$components/navigation/NavbarBottom.svelte';
	import { page } from '$app/stores';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import type { LayoutData } from './$types';
	import { locale, setLocale } from '$i18n/i18n-svelte';
	import { localeLS } from '$ts/stores/localeLS';
	import { loadLocaleAsync } from '$i18n/i18n-util.async';
	import { isLocale } from '$i18n/i18n-util';
	import { advancedMode, advancedModeApp } from '$ts/stores/advancedMode';
	import { routesWithHiddenFooter } from '$ts/constants/main';
	import mixpanel from 'mixpanel-browser';
	import { supabase } from '$ts/constants/supabase';
	import { afterNavigate, invalidateAll } from '$app/navigation';
	import { mLogPageview } from '$ts/helpers/loggers';
	import { setCookie } from '$ts/helpers/setCookie';

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

	let mounted = false;

	$: [$themeApp], setBodyClasses();
	$: [innerWidth, innerHeight], setWindowStores();

	$: if (mounted && $page.data.session?.user.id) {
		mixpanel.identify($page.data.session?.user.id);
		mixpanel.people.set({ $email: $page.data.session?.user.email });
		mixpanel.people.set({ 'SC - Plan': $page.data.plan });
	}

	onMount(async () => {
		mixpanel.init(env.PUBLIC_MIXPANEL_ID, { api_host: env.PUBLIC_MIXPANEL_URL });
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(() => {
			invalidateAll();
		});
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

	function setWindowStores() {
		windowWidth.set(innerWidth);
		windowHeight.set(innerHeight);
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
