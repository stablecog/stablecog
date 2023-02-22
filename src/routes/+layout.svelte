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
	import { apiUrl, routesWithHiddenFooter } from '$ts/constants/main';
	import mixpanel from 'mixpanel-browser';
	import { supabase } from '$ts/constants/supabase';
	import { afterNavigate, invalidateAll } from '$app/navigation';
	import {
		logGenerationFailed,
		logUpscaleFailed,
		mLogGeneration,
		mLogGenerationPropsFromGeneration,
		mLogPageview,
		mLogUpscale,
		mLogUpscalePropsFromUpscale,
		uLogGeneration,
		uLogUpscale
	} from '$ts/helpers/loggers';
	import { setCookie } from '$ts/helpers/setCookie';
	import { appVersion } from '$ts/stores/appVersion';
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
		setGenerationToServerReceived,
		setGenerationToSucceeded,
		submitInitialGenerationRequest
	} from '$userStores/generation';
	import { generateSSEId } from '$ts/helpers/generateSSEId';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import {
		setUpscaleToFailed,
		setUpscaleToServerReceived,
		setUpscaleToSucceeded,
		submitInitialUpscaleRequest,
		upscales
	} from '$ts/stores/user/upscale';
	import { globalSeed } from '$ts/stores/globalSeed';

	export let data: LayoutData;
	setLocale(data.locale);

	const gss = data.globalSeedStore;
	globalSeed.set($gss);

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});

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
	$: $generations, onGenerationsChanged();
	$: $upscales, onUpscalesChanged();

	let isSubmittingGenerations = false;
	async function onGenerationsChanged() {
		if (isSubmittingGenerations) return;
		if (!$generations || $generations.length === 0) {
			console.log('No generations, not submitting initial generation request');
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
				const { id, error } = res;
				if (error || !id) {
					console.log('Generation failed:', error);
					setGenerationToFailed(generation.id || generation.ui_id, error);
					logGenerationFailed({
						generation,
						error,
						advancedModeApp: $advancedModeApp,
						locale: $locale,
						plan: $page.data.plan
					});
				} else {
					setGenerationToServerReceived(id);
					console.log('Generations - After set server received', $generations);
				}
			} catch (error) {
				const err = error as Error;
				console.log('Initial generation submisssion error', error);
				setGenerationToFailed(generation.id || generation.ui_id, err.message);
				logGenerationFailed({
					generation,
					error: err.message,
					advancedModeApp: $advancedModeApp,
					locale: $locale,
					plan: $page.data.plan
				});
			} finally {
				isSubmittingGenerations = false;
			}
		}
	}

	let isSubmittingUpscales = false;
	async function onUpscalesChanged() {
		if (isSubmittingUpscales) return;
		if (!$upscales || $upscales.length === 0) {
			console.log('No upscales, not submitting initial upscale request');
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
				setGenerationOutputUpscaledImageUrl(
					upscale.outputs[0].output_id,
					upscale.outputs[0].image_url,
					$activeGeneration
				);
			} else if (upscale.status === 'to-be-submitted') {
				isSubmittingUpscales = true;
				try {
					const res = await submitInitialUpscaleRequest(
						{
							...upscale,
							stream_id: $sseId
						},
						$page.data.session.access_token,
						$appVersion
					);
					const { id, error } = res;
					if (error || !id) {
						console.log('Upscale failed:', error);
						setUpscaleToFailed(upscale.id || upscale.ui_id, error);
						logUpscaleFailed({
							upscale,
							advancedModeApp: $advancedModeApp,
							locale: $locale,
							plan: $page.data.plan
						});
					} else {
						setUpscaleToServerReceived(id);
						console.log('Upscales - After set server received', $upscales);
					}
				} catch (error) {
					const err = error as Error;
					console.log('Initial upscale submisssion error', error);
					setUpscaleToFailed(upscale.id || upscale.ui_id, err.message);
					logUpscaleFailed({
						upscale,
						advancedModeApp: $advancedModeApp,
						locale: $locale,
						plan: $page.data.plan
					});
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
			if (data.id && data.status === 'succeeded' && data.outputs && data.outputs.length > 0) {
				const outputs = data.outputs as TSSEGenerationMessageOutput[];
				setGenerationToSucceeded(data.id, outputs);
				const generationIndex = $generations.findIndex((g) => g.id === data.id);
				const generation = $generations[generationIndex];
				uLogGeneration('Succeeded');
				mLogGeneration(
					'Succeeded',
					mLogGenerationPropsFromGeneration({
						generation,
						advancedModeApp: $advancedModeApp,
						locale: $locale,
						plan: $page.data.plan
					})
				);
			} else if (data.id && data.status === 'failed') {
				setGenerationToFailed(data.id, data.error);
			}
		} else if (data.process_type === 'upscale') {
			if (data.id && data.status === 'succeeded' && data.outputs && data.outputs.length > 0) {
				const outputs = data.outputs as TSSEUpscaleMessageOutput[];
				setUpscaleToSucceeded(data.id, outputs);
				const upscaleIndex = $upscales.findIndex((u) => u.id === data.id);
				const upscale = $upscales[upscaleIndex];
				uLogUpscale('Succeeded');
				mLogUpscale(
					'Succeeded',
					mLogUpscalePropsFromUpscale({
						upscale,
						advancedModeApp: $advancedModeApp,
						locale: $locale,
						plan: $page.data.plan
					})
				);
			} else if (data.id && data.status === 'failed') {
				setUpscaleToFailed(data.id, data.error);
			}
		}
	}

	$: if (browser && (!$sse || $sse.readyState === $sse.CLOSED)) {
		sseId.set(generateSSEId());
		console.log('SSE ID:', $sseId);
		sse.set(new EventSource(`${apiUrl.href}v1/sse?id=${$sseId}`));
		if ($sse !== null) {
			$sse.onopen = () => {
				console.log(`Connected to SSE with ID: ${$sseId}`);
			};
			$sse.onmessage = (event) => {
				const data = JSON.parse(event.data);
				console.log('Message from SSE', data);
				setGenerationOrUpscaleStatus(data);
			};
			$sse.onerror = (event) => {
				console.log('Error from SSE', event);
			};
		}
	}

	onMount(async () => {
		setBodyClasses();
		mixpanel.init(env.PUBLIC_MIXPANEL_ID, { api_host: env.PUBLIC_MIXPANEL_URL });
		appVersion.set(document.body.getAttribute('app-version') || 'unknown');
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(() => {
			invalidateAll();
		});
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
</script>

<svelte:window bind:innerHeight bind:innerWidth />

<QueryClientProvider client={queryClient}>
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
</QueryClientProvider>
