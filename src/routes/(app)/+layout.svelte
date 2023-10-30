<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import LayoutWrapper from '$components/LayoutWrapper.svelte';
	import UnderDevelopment from '$components/UnderDevelopment.svelte';
	import UpdateAvailableCard from '$components/UpdateAvailableCard.svelte';
	import UserSummaryProvider from '$components/userSummary/UserSummaryProvider.svelte';
	import Drawer from '$components/navigation/Drawer.svelte';
	import Footer from '$components/navigation/Footer.svelte';
	import Navbar from '$components/navigation/navbar/Navbar.svelte';
	import { locale } from '$i18n/i18n-svelte';
	import { apiUrl } from '$ts/constants/main';
	import {
		appRoutes,
		rawRoutes,
		routesWithTheirOwnDrawer,
		sseExcludedRoutes
	} from '$ts/constants/routes';
	import { isSuperAdmin } from '$ts/helpers/admin/roles';
	import { generateSSEId } from '$ts/helpers/generateSSEId';
	import { logInitImageAdded } from '$ts/helpers/loggers';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { appVersion, serverVersion } from '$ts/stores/appVersion';
	import {
		generationInitImageFiles,
		generationInitImageFilesError,
		generationInitImageFilesState,
		generationInitImageHeight,
		generationInitImageSrc,
		generationInitImageUrl,
		generationInitImageWidth
	} from '$ts/stores/generationSettings';
	import { navbarHeight } from '$ts/stores/navbarHeight';
	import { navbarStickyType } from '$ts/stores/navbar';
	import { underDevelopment } from '$ts/constants/underDevelopment';
	import {
		activeGeneration,
		generations,
		setGenerationOutputUpscaledImageUrl,
		setGenerationToFailed,
		setGenerationToServerReceived,
		submitInitialGenerationRequest
	} from '$ts/stores/user/generation';
	import {
		sse,
		sseId,
		type TSSECreationProcessMessage,
		type TSSEMessage
	} from '$ts/stores/user/sse';
	import { userSummary } from '$ts/stores/user/summary';
	import {
		setUpscaleToFailed,
		setUpscaleToServerReceived,
		submitInitialUpscaleRequest,
		upscales
	} from '$ts/stores/user/upscale';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';
	import {
		isCreationProcessData,
		setCreationProcessStatus
	} from '$ts/helpers/user/creationProcess.js';
	import {
		setVoiceoverToFailed,
		setVoiceoverToServerReceived,
		submitInitialVoiceoverRequest,
		voiceovers
	} from '$ts/stores/user/voiceovers.js';
	import { queue } from '$ts/stores/user/queue.js';

	export let data;

	$: $generations, onGenerationsChanged();
	$: $upscales, onUpscalesChanged();
	$: $voiceovers, onVoiceoversChanged();
	$: isDrawerRoute =
		!routesWithTheirOwnDrawer.includes($page.url.pathname) &&
		!routesWithTheirOwnDrawer.some((r) => $page.url.pathname.startsWith(r));

	$: if (
		browser &&
		(!$sse || $sse.readyState === $sse.CLOSED) &&
		!sseExcludedRoutes.includes($page.url.pathname)
	) {
		sseId.set(generateSSEId());
		const sseUrl = `${apiUrl.origin}/v1/sse?id=${$sseId}`;
		console.log('SSE ID:', $sseId);
		console.log('SSE URL:', sseUrl);
		try {
			sse.set(new EventSource(sseUrl));
		} catch (error) {
			console.log('Error creating SSE', error);
		}
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
				if (data.message_type === 'queue' || data.message_type === 'creation_process') {
					const d = data as TSSEMessage;
					if (d.message_type === 'queue') {
						queue.set(d.queue_items);
					} else if (isCreationProcessData(data)) {
						setCreationProcessStatus(data);
					}
				}
			};
			$sse.onerror = (event) => {
				console.log('Error from SSE', event);
			};
		}
	}

	$: $generationInitImageFiles, onFilesChanged();

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
				const { id, error, total_remaining_credits, ui_id, queued_id, queue_items } = res;
				if (total_remaining_credits !== undefined && $userSummary) {
					userSummary.set({ ...$userSummary, total_remaining_credits });
				}
				if (queue_items) {
					queue.set(queue_items);
				}
				if (error || !id || !ui_id) {
					console.log('Generation failed:', error);
					setGenerationToFailed({
						id: generation.id || generation.ui_id,
						error
					});
				} else {
					setGenerationToServerReceived({ ui_id: ui_id, id, queued_id });
				}
			} catch (error) {
				const err = error as Error;
				console.log('Initial generation submisssion error', error);
				setGenerationToFailed({
					id: generation.id || generation.ui_id,
					error: err.message
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
					const { id, error, total_remaining_credits, ui_id, queued_id, queue_items } = res;
					if (total_remaining_credits !== undefined && $userSummary) {
						userSummary.set({ ...$userSummary, total_remaining_credits });
					}
					if (queue_items) {
						queue.set(queue_items);
					}
					if (error || !id || !ui_id) {
						console.log('Upscale failed:', error);
						setUpscaleToFailed({ id: upscale.id || upscale.ui_id, error: error });
					} else {
						setUpscaleToServerReceived({ ui_id: ui_id, id: id, queued_id });
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

	let isSubmittingVoiceovers = false;
	async function onVoiceoversChanged() {
		if (isSubmittingVoiceovers) return;
		if (!$voiceovers || $voiceovers.length === 0) {
			return;
		}
		if (!$page.data.session?.access_token) {
			console.log('No access token, not submitting initial voiceover request');
			return;
		}
		if ($sseId === null) {
			console.log('Stream id is null, not submitting initial voiceover request');
			return;
		}
		for (let i = 0; i < $voiceovers.length; i++) {
			const voiceover = $voiceovers[i];
			if (voiceover.status !== 'to-be-submitted') continue;
			if (voiceover.is_placeholder) continue;
			isSubmittingVoiceovers = true;
			try {
				console.log('Submitting initial voiceover request', voiceover);
				const res = await submitInitialVoiceoverRequest(
					{
						...voiceover,
						stream_id: $sseId
					},
					$page.data.session.access_token,
					$appVersion
				);
				const { id, error, total_remaining_credits, ui_id } = res;
				if (total_remaining_credits !== undefined && $userSummary) {
					userSummary.set({ ...$userSummary, total_remaining_credits });
				}
				if (error || !id || !ui_id) {
					console.log('Voiceover failed:', error);
					setVoiceoverToFailed({ id: voiceover.id || voiceover.ui_id, error: error });
				} else {
					setVoiceoverToServerReceived({ ui_id: ui_id, id: id });
				}
			} catch (error) {
				const err = error as Error;
				console.log('Initial voiceover submisssion error', error);
				setVoiceoverToFailed({ id: voiceover.id || voiceover.ui_id, error: err.message });
			} finally {
				isSubmittingVoiceovers = false;
			}
		}
	}

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

	function setNavbarState() {
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
	}

	$: showUpdateAvailableCard =
		Number($serverVersion) > Number($appVersion) &&
		!rawRoutes.includes($page.url.pathname) &&
		(!$userSummary || !isSuperAdmin($userSummary.roles)) &&
		!$page.url.pathname.startsWith('/admin') &&
		!$page.url.pathname.startsWith('/api/auth') &&
		!$page.url.pathname.startsWith('/sign-in');

	$: showUnderDevelopmentCard =
		underDevelopment &&
		!rawRoutes.includes($page.url.pathname) &&
		(!$userSummary || !isSuperAdmin($userSummary.roles)) &&
		!$page.url.pathname.startsWith('/admin') &&
		!$page.url.pathname.startsWith('/api/auth') &&
		!$page.url.pathname.startsWith('/sign-in');

	onMount(() => {
		setNavbarState();
	});
</script>

<svelte:window on:scroll|passive={setNavbarState} />

<QueryClientProvider client={data.queryClient}>
	<UserSummaryProvider queryClient={data.queryClient}>
		<LayoutWrapper isAppRoute={appRoutes.includes($page.url.pathname)}>
			{#if showUpdateAvailableCard}
				<div class="w-full flex-1 flex flex-col items-center justify-center my-auto py-4">
					<UpdateAvailableCard />
				</div>
			{:else if showUnderDevelopmentCard}
				<UnderDevelopment />
			{:else}
				<Navbar {notAtTheVeryTop} {scrollDirection} />
				{#if appRoutes.includes($page.url.pathname)}
					<slot />
				{:else}
					{#if !rawRoutes.includes($page.url.pathname) && ($navbarStickyType === undefined || $navbarStickyType !== 'relative')}
						<div
							style={$navbarHeight ? `height: ${$navbarHeight}px` : ``}
							class="h-16 md:h-18 w-full"
						/>
					{/if}
					<main class="w-full flex-1 flex flex-col relative break-words">
						<slot />
					</main>
					<Footer />
				{/if}
			{/if}
		</LayoutWrapper>
		{#if !rawRoutes.includes($page.url.pathname) && isDrawerRoute}
			<Drawer />
		{/if}
	</UserSummaryProvider>
</QueryClientProvider>
