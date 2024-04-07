<script lang="ts">
	import { page } from '$app/stores';
	import { locale } from '$i18n/i18n-svelte';
	import { logInitImageAdded } from '$ts/helpers/loggers';
	import { uploadImage } from '$ts/helpers/user/uploadImage';
	import { appVersion } from '$ts/stores/appVersion';
	import {
		generationInitImageFiles,
		generationInitImageFilesError,
		generationInitImageFilesState,
		generationInitImageHeight,
		generationInitImageSrc,
		generationInitImageUrl,
		generationInitImageWidth
	} from '$ts/stores/generationSettings';
	import {
		generations,
		setGenerationToFailed,
		setGenerationToServerReceived,
		submitInitialGenerationRequest
	} from '$ts/stores/user/generation';
	import { queue } from '$ts/stores/user/queue';
	import { sseId } from '$ts/stores/user/sse';
	import { userSummary } from '$ts/stores/user/summary';
	import { sessionStore } from '$ts/constants/supabase';
	import { thumbmarkId } from '$ts/stores/thumbmark';

	$: $generationInitImageFiles, onFilesChanged();
	$: $generations, onGenerationsChanged();

	let isSubmittingGenerations = false;
	async function onGenerationsChanged() {
		if (isSubmittingGenerations) return;
		if (!$generations || $generations.length === 0) {
			return;
		}
		if (!$sessionStore?.access_token) {
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
				const res = await submitInitialGenerationRequest({
					request: {
						...generation,
						stream_id: $sseId,
						output_image_extension: 'jpeg',
						process_type: 'generate',
						thumbmark_id: $thumbmarkId
					},
					access_token: $sessionStore.access_token,
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

	async function onFilesChanged() {
		if (!$generationInitImageFiles) return;
		const access_token = $sessionStore?.access_token;
		if (!access_token) return;
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
			'SC - User Id': $sessionStore?.user.id,
			'SC - Stripe Product Id': $userSummary?.product_id,
			'SC - Locale': $locale,
			'SC - Page': `${$page.url.pathname}${$page.url.search}`,
			'SC - App Version': $appVersion
		});
		try {
			const url = await uploadImage({ access_token, formData });
			if ($generationInitImageFilesState === 'uploading' && $generationInitImageFiles) {
				generationInitImageUrl.set(url);
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
</script>

<slot />
