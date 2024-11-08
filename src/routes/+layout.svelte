<script lang="ts">
	import { afterNavigate, beforeNavigate, goto, invalidate } from '$app/navigation';
	import { page, updated } from '$app/stores';
	import '$css/app.css';
	import { env } from '$env/dynamic/public';
	import { locale, setLocale } from '$i18n/i18n-svelte';
	import { isLocale } from '$i18n/i18n-util';
	import { loadLocaleAsync } from '$i18n/i18n-util.async';
	import { appRoutes } from '$ts/constants/routes.js';
	import { sessionStore, supabaseStore } from '$ts/constants/supabase.js';
	import { isHydrated, setIsHydratedToTrue } from '$ts/helpers/isHydrated';
	import { logPageview } from '$ts/helpers/loggers';
	import { setBodyClasses } from '$ts/helpers/setBodyClasses';
	import { setCookie } from '$ts/helpers/setCookie';
	import { appVersion } from '$ts/stores/appVersion';
	import { globalSeed } from '$ts/stores/globalSeed';
	import { isTouchscreen } from '$ts/stores/isTouchscreen.js';
	import { localeLS } from '$ts/stores/localeLS';
	import { notAtTheVeryTop, scrollDirection } from '$ts/stores/scroll.js';
	import { isLeftSidebarHidden, isLeftSidebarHiddenApp } from '$ts/stores/sidebars';
	import { theme, themeApp } from '$ts/stores/theme';
	import { thumbmarkId } from '$ts/stores/thumbmark.js';
	import { userSummary } from '$ts/stores/user/summary';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import deepEqual from 'deep-equal';
	import posthog from 'posthog-js';
	import { onMount } from 'svelte';
	import { Toaster } from '$components/ui/sonner';

	export let data;

	//

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	$: sessionStore.set(session);
	$: supabaseStore.set(supabase);

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
	let isThumbmarkIdReady = false;

	$: [mounted, isThumbmarkIdReady, $page], identifyUser();

	let lastIdentityObject: Record<string, any> | undefined = undefined;

	function identifyUser() {
		if (!mounted || !$sessionStore?.user.id || !isThumbmarkIdReady) {
			return;
		}
		let indentityObject: Record<string, any> = {
			email: $sessionStore.user.email,
			'SC - User Id': $sessionStore.user.id,
			'SC - Stripe Product Id': $userSummary?.product_id,
			'SC - App Version': $appVersion
		};
		if ($thumbmarkId !== undefined && $thumbmarkId !== null && $thumbmarkId !== '') {
			indentityObject['SC - Thumbmark ID'] = $thumbmarkId;
		}
		if (lastIdentityObject !== undefined && deepEqual(indentityObject, lastIdentityObject)) {
			return;
		}
		posthog.identify($sessionStore.user.id, indentityObject);
		lastIdentityObject = indentityObject;
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
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		posthog.init(env.PUBLIC_PH_ID || '', {
			api_host: env.PUBLIC_PH_URL
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
		setThumbmark();
		mounted = true;
		return () => data.subscription.unsubscribe();
	});

	beforeNavigate(({ willUnload, to }) => {
		if ($updated && !willUnload && to?.url) {
			location.href = to.url.href + to.url.search;
		}
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
				'SC - User Id': $sessionStore?.user.id,
				'SC - Stripe Product Id': $userSummary?.product_id,
				'SC - App Version': $appVersion,
				'SC - Thumbmark ID': $thumbmarkId
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

	async function setThumbmark() {
		try {
			// @ts-ignore
			const { getFingerprint } = await import('@thumbmarkjs/thumbmarkjs');
			const thumbmark = await getFingerprint();
			if (thumbmark) thumbmarkId.set(thumbmark as string);
		} catch (error) {
			console.log('ThumbmarkJS error:', error);
		} finally {
			isThumbmarkIdReady = true;
		}
	}
</script>

<svelte:window
	bind:innerHeight={$windowHeight}
	bind:innerWidth={$windowWidth}
	on:scroll|passive={setNavbarState}
/>

<Toaster />

<slot />
