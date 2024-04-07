<script lang="ts">
	import { appVersion } from '$ts/stores/appVersion';
	import {
		activeGeneration,
		setGenerationOutputUpscaledImageUrl
	} from '$ts/stores/user/generation';
	import { queue } from '$ts/stores/user/queue';
	import { sseId } from '$ts/stores/user/sse';
	import { userSummary } from '$ts/stores/user/summary';
	import {
		setUpscaleToFailed,
		setUpscaleToServerReceived,
		submitInitialUpscaleRequest,
		upscales
	} from '$ts/stores/user/upscale';
	import { sessionStore } from '$ts/constants/supabase';
	import { thumbmarkId } from '$ts/stores/thumbmark';

	$: $upscales, onUpscalesChanged();

	let isSubmittingUpscales = false;
	async function onUpscalesChanged() {
		if (isSubmittingUpscales) return;
		if (!$upscales || $upscales.length === 0) {
			return;
		}
		if (!$sessionStore?.access_token) {
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
					console.log('Submitting initial upscale request', upscale);
					const res = await submitInitialUpscaleRequest({
						request: {
							...upscale,
							stream_id: $sseId
						},
						access_token: $sessionStore.access_token,
						app_version: $appVersion,
						thumbmark_id: $thumbmarkId
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
</script>

<slot />
