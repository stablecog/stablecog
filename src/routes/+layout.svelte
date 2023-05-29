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
	import mixpanel from 'mixpanel-browser';
	import { afterNavigate, goto, invalidate } from '$app/navigation';
	import { logPageview } from '$ts/helpers/loggers';
	import { setCookie } from '$ts/helpers/setCookie';
	import { appVersion } from '$ts/stores/appVersion';
	import { globalSeed } from '$ts/stores/globalSeed';
	import { userSummary } from '$ts/stores/user/summary';
	import posthog from 'posthog-js';
	import { PUBLIC_MP_URL, PUBLIC_MP_ID, PUBLIC_PH_ID, PUBLIC_PH_URL } from '$env/static/public';
	import { isHydrated, setIsHydratedToTrue } from '$ts/helpers/isHydrated';
	import { setBodyClasses } from '$ts/helpers/setBodyClasses';
	import { isLeftSidebarHidden, isLeftSidebarHiddenApp } from '$ts/stores/sidebars';
	import { isTouchscreen } from '$ts/stores/isTouchscreen.js';
	import { appRoutes } from '$ts/constants/routes.js';

	export let data;

	$: ({ supabase, session } = data);

	setLocale(data.locale);

	const gss = data.globalSeedStore;
	globalSeed.set($gss);

	const us = data.userSummaryStore;
	userSummary.set($us);

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
		mixpanel.identify($page.data.session.user.id);
		mixpanel.people.set({
			$email: $page.data.session.user.email,
			'SC - User Id': $page.data.session.user.id,
			'SC - Stripe Product Id': $userSummary?.product_id,
			'SC - App Version': $appVersion
		});
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

	const confirmOtherEmailHash =
		'#message=Confirmation+link+accepted.+Please+proceed+to+confirm+link+sent+to+the+other+email';

	onMount(async () => {
		setBodyClasses();
		setBodyOverflowHiddenClass();
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		mixpanel.init(PUBLIC_MP_ID, { api_host: PUBLIC_MP_URL });
		posthog.init(PUBLIC_PH_ID, {
			api_host: PUBLIC_PH_URL
		});
		appVersion.set(document.body.getAttribute('app-version') ?? 'unknown');
		if ($page.url.hash === confirmOtherEmailHash) {
			await goto('/account/change-email?confirm_other_email=true');
		}
		if ($localeLS && isLocale($localeLS) && $localeLS !== $locale) {
			await loadLocaleAsync($localeLS);
			setLocale($localeLS);
		}
		if ($theme !== null && $theme !== $themeApp) {
			themeApp.set($theme);
		}
		if ($isLeftSidebarHidden && $isLeftSidebarHidden !== $isLeftSidebarHiddenApp) {
			isLeftSidebarHiddenApp.set($isLeftSidebarHidden);
		}
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
		if (appRoutes.includes($page.url.pathname)) {
			document.body.classList.add('overflow-hidden-for-app-routes');
		} else {
			document.body.classList.remove('overflow-hidden-for-app-routes');
		}
	}
</script>

<svelte:window bind:innerHeight={$windowHeight} bind:innerWidth={$windowWidth} />

<slot />
