<script lang="ts">
	import '$css/app.css';
	import Navbar from '$components/navigation/Navbar.svelte';
	import { theme, themeApp } from '$ts/stores/theme';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Footer from '$components/navigation/Footer.svelte';
	import { page } from '$app/stores';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import type { LayoutData } from './$types';
	import { locale, setLocale } from '$i18n/i18n-svelte';
	import { localeLS } from '$ts/stores/localeLS';
	import { loadLocaleAsync } from '$i18n/i18n-util.async';
	import { isLocale } from '$i18n/i18n-util';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { apiUrl, routesWithHiddenFooter } from '$ts/constants/main';
	import mixpanel from 'mixpanel-browser';
	import { supabase } from '$ts/constants/supabase';
	import { afterNavigate, invalidateAll } from '$app/navigation';
	import { logInitImageAdded, logPageview } from '$ts/helpers/loggers';
	import { setCookie } from '$ts/helpers/setCookie';
	import { appVersion, serverVersion } from '$ts/stores/appVersion';
	import {
		sse,
		sseId,
		type TSSEGenerationMessageOutput,
		type TSSEGenerationOrUpscaleMessage,
		type TSSEUpscaleMessageOutput
	} from '$userStores/sse';
	import {
		activeGeneration,
		generations,
		setGenerationOutputUpscaledImageUrl,
		setGenerationToFailed,
		setGenerationToServerProcessing,
		setGenerationToServerReceived,
		setGenerationToSucceeded,
		submitInitialGenerationRequest
	} from '$userStores/generation';
	import { generateSSEId } from '$ts/helpers/generateSSEId';
	import { QueryClient, QueryClientProvider, createQuery } from '@tanstack/svelte-query';
	import {
		setUpscaleToFailed,
		setUpscaleToServerProcessing,
		setUpscaleToServerReceived,
		setUpscaleToSucceeded,
		submitInitialUpscaleRequest,
		upscales
	} from '$ts/stores/user/upscale';
	import { globalSeed } from '$ts/stores/globalSeed';
	import { userSummary } from '$ts/stores/user/summary';
	import posthog from 'posthog-js';
	import { PUBLIC_MP_URL, PUBLIC_MP_ID, PUBLIC_PH_ID, PUBLIC_PH_URL } from '$env/static/public';
	import UnderDevelopment from '$components/UnderDevelopment.svelte';
	import { isSuperAdmin } from '$ts/helpers/admin/roles';
	import { isHydrated, setIsHydratedToTrue } from '$ts/helpers/isHydrated';
	import { navbarHeight } from '$ts/stores/navbarHeight';
	import { navbarStickyType } from '$ts/stores/stickyNavbar';
	import {
		generationInitImageFiles,
		generationInitImageFilesError,
		generationInitImageFilesState,
		generationInitImageHeight,
		generationInitImageSrc,
		generationInitImageUrl,
		generationInitImageWidth
	} from '$ts/stores/generationSettings';
	import UpdateAvailableCard from '$components/UpdateAvailableCard.svelte';
	import UserSummaryProvider from '$components/UserSummaryProvider.svelte';
	import { underDevelopment } from '$ts/stores/underDevelopment';
	import { setBodyClasses } from '$ts/helpers/setBodyClasses';
	import Drawer from '$components/navigation/Drawer.svelte';
	import { isLeftSidebarHidden, isLeftSidebarHiddenApp } from '$ts/stores/sidebars';
	import LayoutWrapper from '$components/LayoutWrapper.svelte';

	export let data: LayoutData;
	setLocale(data.locale);

	const rawRoutes = ['/'];
	const appRoutes = ['/generate'];
	const routesWithTheirOwnDrawer = ['/guide'];
	const sseExcludedRoutes = ['/'];

	const gss = data.globalSeedStore;
	globalSeed.set($gss);

	const us = data.userSummaryStore;
	userSummary.set($us);

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 10 * 1000,
				enabled: browser
			}
		}
	});

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

	$: $themeApp, setBodyClasses();
	$: isDrawerRoute =
		!routesWithTheirOwnDrawer.includes($page.url.pathname) &&
		!routesWithTheirOwnDrawer.some((r) => $page.url.pathname.startsWith(r));

	$: $locale, runIfMounted(() => setCookie(`sc-locale=${$locale}`));
	$: $themeApp, runIfMounted(() => setCookie(`sc-theme=${$themeApp}`));
	$: $isLeftSidebarHiddenApp,
		runIfMounted(() => setCookie(`sc-l-sidebar-h=${$isLeftSidebarHiddenApp}`));
	$: $generations, onGenerationsChanged();
	$: $upscales, onUpscalesChanged();

	let isSubmittingGenerations = false;
	async function onGenerationsChanged() {
		if (isSubmittingGenerations) return;
		if (!$generations || $generations.length === 0) {
			return;
		}
		if (!$page.data.session?.access_token) {
			console.log('No access token, not submitting initial generation request');
			return;
		}
		if ($sseId === null) {
			console.log('Stream id is null, not submitting initial generation request');
			return;
		}
		for (let i = 0; i < $generations.length; i++) {
			const generation = $generations[i];
			if (generation.status !== 'to-be-submitted') continue;
			if (generation.is_placeholder) continue;
			isSubmittingGenerations = true;
			try {
				console.log('Submitting initial generation request', generation);
				const res = await submitInitialGenerationRequest(
					{
						...generation,
						stream_id: $sseId,
						output_image_extension: 'jpeg',
						process_type: 'generate'
					},
					$page.data.session.access_token,
					$appVersion
				);
				const { id, error, total_remaining_credits, ui_id } = res;
				if (total_remaining_credits !== undefined && $userSummary) {
					userSummary.set({ ...$userSummary, total_remaining_credits });
				}
				if (error || !id || !ui_id) {
					console.log('Generation failed:', error);
					setGenerationToFailed({ id: generation.id || generation.ui_id, error: error });
				} else {
					setGenerationToServerReceived({ ui_id: ui_id, id: id });
				}
			} catch (error) {
				const err = error as Error;
				console.log('Initial generation submisssion error', error);
				setGenerationToFailed({ id: generation.id || generation.ui_id, error: err.message });
			} finally {
				isSubmittingGenerations = false;
			}
		}
	}

	let isSubmittingUpscales = false;
	async function onUpscalesChanged() {
		if (isSubmittingUpscales) return;
		if (!$upscales || $upscales.length === 0) {
			return;
		}
		if (!$page.data.session?.access_token) {
			console.log('No access token, not submitting initial upscale request');
			return;
		}
		if ($sseId === null) {
			console.log('Stream id is null, not submitting initial upscale request');
			return;
		}
		for (let i = 0; i < $upscales.length; i++) {
			const upscale = $upscales[i];
			if (upscale.status === 'succeeded' && upscale.outputs[0].output_id) {
				setGenerationOutputUpscaledImageUrl({
					output_id: upscale.outputs[0].output_id,
					upscaled_image_url: upscale.outputs[0].image_url,
					currently_active_generation: $activeGeneration
				});
			} else if (upscale.status === 'to-be-submitted') {
				isSubmittingUpscales = true;
				try {
					const res = await submitInitialUpscaleRequest({
						request: {
							...upscale,
							stream_id: $sseId
						},
						access_token: $page.data.session.access_token,
						app_version: $appVersion
					});
					const { id, error, total_remaining_credits, ui_id } = res;
					if (total_remaining_credits !== undefined && $userSummary) {
						userSummary.set({ ...$userSummary, total_remaining_credits });
					}
					if (error || !id || !ui_id) {
						console.log('Upscale failed:', error);
						setUpscaleToFailed({ id: upscale.id || upscale.ui_id, error: error });
					} else {
						setUpscaleToServerReceived({ ui_id: ui_id, id: id });
					}
				} catch (error) {
					const err = error as Error;
					console.log('Initial upscale submisssion error', error);
					setUpscaleToFailed({ id: upscale.id || upscale.ui_id, error: err.message });
				} finally {
					isSubmittingUpscales = false;
				}
			}
		}
	}

	function setGenerationOrUpscaleStatus(data: TSSEGenerationOrUpscaleMessage) {
		if (
			data.process_type !== 'upscale' &&
			data.process_type !== 'generate' &&
			data.process_type !== 'generate_and_upscale'
		) {
			return;
		}
		if (data.process_type === 'generate' || data.process_type === 'generate_and_upscale') {
			if (data.id && data.ui_id && data.status === 'processing') {
				setGenerationToServerProcessing({ ui_id: data.ui_id, id: data.id });
			} else if (
				data.id &&
				data.ui_id &&
				data.status === 'succeeded' &&
				data.outputs &&
				data.outputs.length > 0
			) {
				const outputs = data.outputs as TSSEGenerationMessageOutput[];
				setGenerationToSucceeded({ id: data.id, outputs: outputs });
			} else if (data.id && data.status === 'failed') {
				setGenerationToFailed({ id: data.id, error: data.error });
			}
		} else if (data.process_type === 'upscale') {
			if (data.id && data.ui_id && data.status === 'processing') {
				setUpscaleToServerProcessing({ ui_id: data.ui_id, id: data.id });
			} else if (
				data.id &&
				data.status === 'succeeded' &&
				data.outputs &&
				data.outputs.length > 0
			) {
				const outputs = data.outputs as TSSEUpscaleMessageOutput[];
				setUpscaleToSucceeded({ id: data.id, outputs: outputs });
			} else if (data.id && data.status === 'failed') {
				setUpscaleToFailed({ id: data.id, error: data.error });
			}
		}
	}

	$: if (
		browser &&
		(!$sse || $sse.readyState === $sse.CLOSED) &&
		!sseExcludedRoutes.includes($page.url.pathname)
	) {
		sseId.set(generateSSEId());
		const sseUrl = `${apiUrl.origin}/v1/sse?id=${$sseId}`;
		console.log('SSE ID:', $sseId);
		console.log('SSE URL:', sseUrl);
		sse.set(new EventSource(sseUrl));
		if ($sse !== null) {
			$sse.onopen = () => {
				console.log(`Connected to SSE with ID: ${$sseId}`);
			};
			$sse.onmessage = (event) => {
				const data = JSON.parse(event.data);
				console.log('Message from SSE', data);
				if (data.total_remaining_credits !== undefined && $userSummary) {
					userSummary.set({
						...$userSummary,
						total_remaining_credits: data.total_remaining_credits
					});
				}
				if (data.version) {
					serverVersion.set(data.version);
				}
				setGenerationOrUpscaleStatus(data);
			};
			$sse.onerror = (event) => {
				console.log('Error from SSE', event);
			};
		}
	}

	$: $generationInitImageFiles, onFilesChanged();

	$: $generationInitImageFiles, onFilesChanged();

	async function onFilesChanged() {
		if (!$generationInitImageFiles) return;
		const file = $generationInitImageFiles?.[0];
		if (!file) return;
		generationInitImageUrl.set(undefined);
		generationInitImageFilesState.set('uploading');
		generationInitImageFilesError.set(undefined);
		generationInitImageSrc.set(undefined);
		const imgSrc = URL.createObjectURL(file);
		generationInitImageSrc.set(imgSrc);
		const imgElement = new Image();
		imgElement.onload = () => {
			generationInitImageWidth.set(imgElement.width);
			generationInitImageHeight.set(imgElement.height);
		};
		imgElement.src = imgSrc;
		generationInitImageSrc.set(imgSrc);
		const formData = new FormData();
		formData.append('file', file);
		logInitImageAdded({
			'SC - User Id': $page.data.session?.user.id,
			'SC - Stripe Product Id': $userSummary?.product_id,
			'SC - Locale': $locale,
			'SC - Advanced Mode': $advancedModeApp,
			'SC - Page': `${$page.url.pathname}${$page.url.search}`,
			'SC - App Version': $appVersion
		});
		try {
			const res = await fetch(`${apiUrl.origin}/upload`, {
				method: 'POST',
				body: formData,
				headers: {
					Authorization: `Bearer ${$page.data.session?.access_token}`
				}
			});
			if (!res.ok) throw new Error('Upload failed');
			const resJson = await res.json();
			if (!resJson.object) throw new Error('Upload failed, no object');
			if ($generationInitImageFilesState === 'uploading' && $generationInitImageFiles) {
				generationInitImageUrl.set(resJson.object);
				generationInitImageFilesState.set('uploaded');
			}
		} catch (error) {
			console.log(error);
			if ($generationInitImageFilesState === 'uploading' && $generationInitImageFiles) {
				generationInitImageFilesState.set('error');
				generationInitImageFilesError.set(error as string);
			}
		}
	}

	let notAtTheVeryTop = false;
	const notAtTheVeryTopThreshold = 5;
	let oldScrollY = 0;
	const minScrollThreshold = 40;
	let scrollDirection: 'up' | 'down' = 'down';

	const setNavbarState = () => {
		const scrollY = window.scrollY;
		const _notAtTheVeryTop = scrollY > notAtTheVeryTopThreshold;
		if (_notAtTheVeryTop !== notAtTheVeryTop) {
			notAtTheVeryTop = _notAtTheVeryTop;
		}
		if (Math.abs(window.scrollY - oldScrollY) < minScrollThreshold) return;
		if (window.scrollY > oldScrollY) {
			scrollDirection = 'down';
		} else {
			scrollDirection = 'up';
		}
		oldScrollY = scrollY;
	};

	onMount(async () => {
		setBodyClasses();
		setNavbarState();
		mixpanel.init(PUBLIC_MP_ID, { api_host: PUBLIC_MP_URL });
		posthog.init(PUBLIC_PH_ID, {
			api_host: PUBLIC_PH_URL
		});
		appVersion.set(document.body.getAttribute('app-version') ?? 'unknown');
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(() => {
			invalidateAll();
		});
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
</script>

<svelte:window
	bind:innerHeight={$windowHeight}
	bind:innerWidth={$windowWidth}
	on:scroll={setNavbarState}
/>

<QueryClientProvider client={queryClient}>
	<UserSummaryProvider>
		<LayoutWrapper isAppRoute={appRoutes.includes($page.url.pathname)}>
			{#if !rawRoutes.includes($page.url.pathname) && $underDevelopment && (!$userSummary || !isSuperAdmin($userSummary.roles)) && !$page.url.pathname.startsWith('/admin') && !$page.url.pathname.startsWith('/api/auth') && !$page.url.pathname.startsWith('/sign-in')}
				{#if Number($serverVersion) > Number($appVersion)}
					<div class="w-full flex-1 flex flex-col items-center justify-center my-auto py-4">
						<UpdateAvailableCard />
					</div>
				{:else}
					<UnderDevelopment />
				{/if}
			{:else}
				<Navbar {notAtTheVeryTop} {scrollDirection} />
				{#if appRoutes.includes($page.url.pathname)}
					<slot />
				{:else}
					{#if !rawRoutes.includes($page.url.pathname) && ($navbarStickyType === undefined || $navbarStickyType !== 'not-sticky')}
						<div
							style={$navbarHeight ? `height: ${$navbarHeight}px` : ``}
							class="h-16 md:h-18 w-full"
						/>
					{/if}
					<main class="w-full flex-1 flex flex-col relative break-words">
						<slot />
					</main>
					{#if !routesWithHiddenFooter.includes($page.url.pathname)}
						<Footer />
					{/if}
				{/if}
			{/if}
		</LayoutWrapper>
		{#if !rawRoutes.includes($page.url.pathname) && isDrawerRoute}
			<Drawer />
		{/if}
	</UserSummaryProvider>
</QueryClientProvider>
