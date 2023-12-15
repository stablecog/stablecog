<script lang="ts">
	import '$css/app.css';
	import { theme, themeApp } from '$ts/stores/theme';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import { locale, setLocale } from '$i18n/i18n-svelte';
	import { localeLS } from '$ts/stores/localeLS';
	import { loadLocaleAsync } from '$i18n/i18n-util.async';
	import { isLocale } from '$i18n/i18n-util';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { afterNavigate, goto, invalidate } from '$app/navigation';
	import { logPageview } from '$ts/helpers/loggers';
	import { setCookie } from '$ts/helpers/setCookie';
	import { appVersion } from '$ts/stores/appVersion';
	import { globalSeed } from '$ts/stores/globalSeed';
	import { userSummary } from '$ts/stores/user/summary';
	import posthog from 'posthog-js';
	import { PUBLIC_PH_ID, PUBLIC_PH_URL } from '$env/static/public';
	import { isHydrated, setIsHydratedToTrue } from '$ts/helpers/isHydrated';
	import { setBodyClasses } from '$ts/helpers/setBodyClasses';
	import { isLeftSidebarHidden, isLeftSidebarHiddenApp } from '$ts/stores/sidebars';
	import { isTouchscreen } from '$ts/stores/isTouchscreen.js';
	import { appRoutes } from '$ts/constants/routes.js';
	import { notAtTheVeryTop, scrollDirection } from '$ts/stores/scroll.js';
	export let data;

	$: ({ supabase, session } = data);

	setLocale(data.locale);

	const gss = data.globalSeedStore;
	globalSeed.set($gss);

	const us = data.userSummaryStore;
	userSummary.set($us ?? null);

	const th = data.themeStore;
	themeApp.set($th);
	if (data.theme !== null) themeApp.set(data.theme);

	const lsbh = data.isLeftSidebarHiddenStore;
	isLeftSidebarHiddenApp.set($lsbh);
	if (data.isLeftSidebarHidden !== null) isLeftSidebarHiddenApp.set(data.isLeftSidebarHidden);

	let mounted = false;

	let lastIdentity: string | undefined = undefined;
	$: [mounted, $page], identifyUser();

	function identifyUser() {
		if (!mounted || !$page.data.session?.user.id || lastIdentity === $page.data.session?.user.id) {
			return;
		}
		posthog.identify($page.data.session.user.id, {
			email: $page.data.session.user.email,
			'SC - User Id': $page.data.session.user.id,
			'SC - Stripe Product Id': $userSummary?.product_id,
			'SC - App Version': $appVersion
		});
		lastIdentity = $page.data.session?.user.id;
	}

	const runIfMounted = (fn: () => void) => {
		if (mounted) fn();
	};

	$: [$themeApp, $isTouchscreen], setBodyClasses();
	$: $locale, runIfMounted(() => setCookie(`sc-locale=${$locale}`));
	$: $themeApp, runIfMounted(() => setCookie(`sc-theme=${$themeApp}`));
	$: $isLeftSidebarHiddenApp,
		runIfMounted(() => setCookie(`sc-l-sidebar-h=${$isLeftSidebarHiddenApp}`));

	$: isAppRoute = appRoutes.includes($page.url.pathname);

	const confirmOtherEmailHash =
		'#message=Confirmation+link+accepted.+Please+proceed+to+confirm+link+sent+to+the+other+email';

	const notAtTheVeryTopThreshold = 5;
	let oldScrollY = 0;
	const minScrollThreshold = 40;

	function setNavbarState() {
		const scrollY = window.scrollY;
		const _notAtTheVeryTop = scrollY > notAtTheVeryTopThreshold;
		if (_notAtTheVeryTop !== $notAtTheVeryTop) {
			$notAtTheVeryTop = _notAtTheVeryTop;
		}
		if (Math.abs(window.scrollY - oldScrollY) < minScrollThreshold) return;
		if (window.scrollY > oldScrollY) {
			scrollDirection.set('down');
		} else {
			scrollDirection.set('up');
		}
		oldScrollY = scrollY;
	}

	onMount(() => {
		setBodyClasses();
		setBodyOverflowHiddenClass();
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		posthog.init(PUBLIC_PH_ID, {
			api_host: PUBLIC_PH_URL
		});
		appVersion.set(document.body.getAttribute('app-version') ?? 'unknown');
		if ($page.url.hash === confirmOtherEmailHash) {
			goto('/account/change-email?confirm_other_email=true');
		}
		if ($localeLS && isLocale($localeLS) && $localeLS !== $locale) {
			loadLocaleAsync($localeLS);
			setLocale($localeLS);
		}
		if ($theme !== null && $theme !== $themeApp) {
			themeApp.set($theme);
		}
		if ($isLeftSidebarHidden && $isLeftSidebarHidden !== $isLeftSidebarHiddenApp) {
			isLeftSidebarHiddenApp.set($isLeftSidebarHidden);
		}
		setNavbarState();
		mounted = true;
		return () => {
			subscription.unsubscribe();
		};
	});

	afterNavigate(() => {
		setBodyOverflowHiddenClass();
		if (!isHydrated) {
			setIsHydratedToTrue();
			return;
		} else {
			const props = {
				'SC - Page': `${$page.url.pathname}${$page.url.search}`,
				'SC - Locale': $locale,
				'SC - Advanced Mode': $advancedModeApp,
				'SC - User Id': $page.data.session?.user.id,
				'SC - Stripe Product Id': $userSummary?.product_id,
				'SC - App Version': $appVersion
			};
			logPageview(props);
		}
	});

	function setBodyOverflowHiddenClass() {
		if (isAppRoute) {
			document.body.classList.add('overflow-hidden-for-app-routes');
		} else {
			document.body.classList.remove('overflow-hidden-for-app-routes');
		}
	}
</script>

<svelte:window
	bind:innerHeight={$windowHeight}
	bind:innerWidth={$windowWidth}
	on:scroll|passive={setNavbarState}
/>

<slot />
