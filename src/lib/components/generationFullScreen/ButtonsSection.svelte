<script lang="ts">
	import SubtleButton from '$components/buttons/SubtleButton.svelte';
	import IconCopy from '$components/icons/IconCopy.svelte';
	import IconDownload from '$components/icons/IconDownload.svelte';
	import IconRefresh from '$components/icons/IconRefresh.svelte';
	import IconTick from '$components/icons/IconTick.svelte';
	import IconTrashcan from '$components/icons/IconTrashcan.svelte';
	import IconTrashcanFilledOpen from '$components/icons/IconTrashcanFilledOpen.svelte';
	import Morpher from '$components/Morpher.svelte';
	import LL from '$i18n/i18n-svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { downloadGenerationImage } from '$ts/helpers/downloadGenerationImage';
	import {
		activeGeneration,
		setGenerationOutputToDeleted,
		type TGenerationWithSelectedOutput
	} from '$ts/stores/user/generation';
	import { copy } from 'svelte-copy';
	import type {
		TButtonObjectsWithState,
		TGenerationFullScreenModalType,
		TSetButtonObjectWithState
	} from '$components/generationFullScreen/types';
	import IconWand from '$components/icons/IconWand.svelte';
	import IconLink from '$components/icons/IconLink.svelte';
	import IconLoading from '$components/icons/IconLoading.svelte';
	import { apiUrl } from '$ts/constants/main';
	import { page } from '$app/stores';
	import { useQueryClient } from '@tanstack/svelte-query';
	import type { TUserGenerationFullOutputsPage } from '$ts/queries/userGenerations';
	import { logGalleryGenerateSimilarClicked } from '$ts/helpers/loggers';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { userSummary } from '$ts/stores/user/summary';

	export let generation: TGenerationWithSelectedOutput;
	export let generateSimilarUrl: string;
	export let regenerateUrl: string;
	export let linkUrl: string;
	export let setButtonObjectWithState: TSetButtonObjectWithState;
	export let buttonObjectsWithState: TButtonObjectsWithState;
	export let currentImageUrl: string;
	export let modalType: TGenerationFullScreenModalType;

	const queryClient = useQueryClient();
	const onDownloadImageClicked = async () => {
		try {
			setButtonObjectWithState('download', 'loading');
			await downloadGenerationImage({
				url: currentImageUrl,
				guidanceScale: generation.guidance_scale,
				inferenceSteps: generation.inference_steps,
				isUpscaled: generation.selected_output.upscaled_image_url !== undefined,
				prompt: generation.prompt.text,
				seed: generation.seed
			});
			setButtonObjectWithState('download', 'success');
		} catch (error) {
			console.log("Couldn't download image", error);
			setButtonObjectWithState('download', 'idle');
		}
	};

	let deleteStatus: 'idle' | 'should-confirm' | 'loading' | 'deleted' = 'idle';

	async function deleteGeneration() {
		if (deleteStatus === 'idle') {
			deleteStatus = 'should-confirm';
			return;
		}
		deleteStatus = 'loading';
		try {
			const res = await fetch(`${apiUrl.origin}/v1/user/generation`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$page.data.session?.access_token}`
				},
				body: JSON.stringify({ generation_output_ids: [generation.selected_output.id] })
			});
			if (!res.ok) throw new Error('Response not ok');
			console.log('Delete generation output response', res);
			if (modalType === 'history') {
				queryClient.setQueryData(['user_generation_full_outputs'], (data: any) => ({
					...data,
					pages: data.pages.map((page: TUserGenerationFullOutputsPage) => {
						return {
							...page,
							outputs: page.outputs.map((output) =>
								output.id === generation.selected_output.id
									? { ...output, is_deleted: true }
									: output
							)
						};
					})
				}));
			} else if (modalType === 'generate') {
				setGenerationOutputToDeleted(generation.selected_output.id);
			}
			activeGeneration.set(undefined);
			deleteStatus = 'deleted';
		} catch (error) {
			console.log('Error deleting generation output', error);
			resetDeleteStatus();
		}
	}

	const resetDeleteStatus = () => (deleteStatus = 'idle');
</script>

<div class="w-full flex flex-wrap gap-3 pb-1">
	{#if modalType === 'generate' || modalType === 'history'}
		<SubtleButton
			onClick={onDownloadImageClicked}
			disabled={buttonObjectsWithState.download.state === 'loading'}
			state={buttonObjectsWithState.download.state === 'success' ? 'success' : 'idle'}
		>
			<Morpher morphed={buttonObjectsWithState.download.state === 'success'}>
				<div slot="item-0" class="flex items-center justify-center gap-1.5">
					<Morpher morphed={buttonObjectsWithState.download.state === 'loading'}>
						<div slot="item-0" class="flex items-center justify-center gap-1.5">
							<IconDownload class="w-5 h-5 -ml-0.5 text-c-on-bg" />
							<p>{$LL.GenerationFullscreen.DownloadButton()}</p>
						</div>
						<div slot="item-1" class="flex items-center justify-center gap-1.5">
							<IconLoading class="w-5 h-5 animate-spin-faster text-c-on-bg" />
						</div>
					</Morpher>
				</div>
				<div slot="item-1" class="flex items-center justify-center gap-1.5">
					<IconTick class="w-5 h-5 -ml-0.5 transform scale-110 text-c-on-primary" />
					<p>{$LL.GenerationFullscreen.DoneButtonState()}</p>
				</div>
			</Morpher>
		</SubtleButton>
	{/if}
	{#if modalType === 'history' || modalType === 'gallery'}
		<div class="flex relative">
			<SubtleButton
				target="_self"
				prefetch={true}
				href={generateSimilarUrl}
				onClick={() => {
					if (modalType === 'gallery') {
						logGalleryGenerateSimilarClicked({
							'SC - Advanced Mode': $advancedModeApp,
							'SC - Output Id': generation.selected_output.id,
							'SC - Stripe Product Id': $userSummary?.product_id
						});
					}
				}}
			>
				<div class="flex items-center justify-center gap-1.5">
					<IconWand class="w-5 h-5 -ml-0.5" />
					<p>{$LL.GenerationFullscreen.GenerateSimilarButton()}</p>
				</div>
			</SubtleButton>
		</div>
	{/if}
	{#if modalType === 'history'}
		<div class="flex relative">
			<SubtleButton target="_self" prefetch={true} href={regenerateUrl}>
				<div class="flex items-center justify-center gap-1.5">
					<IconRefresh class="w-5 h-5 -ml-0.5" />
					<p>{$LL.GenerationFullscreen.RegenerateButton()}</p>
				</div>
			</SubtleButton>
		</div>
	{/if}
	<div
		use:copy={generation.prompt.text}
		on:svelte-copy={() => setButtonObjectWithState('prompt', 'success')}
	>
		<SubtleButton state={buttonObjectsWithState.prompt.state === 'success' ? 'success' : 'idle'}>
			<Morpher morphed={buttonObjectsWithState.prompt.state === 'success'}>
				<div slot="item-0" class="flex items-center justify-center gap-1.5">
					<IconCopy class="w-5 h-5 -ml-0.5" />
					<p>{$LL.GenerationFullscreen.CopyPromptButton()}</p>
				</div>
				<div slot="item-1" class="flex items-center justify-center gap-1.5">
					<IconTick class="w-5 h-5 -ml-0.5 scale-110" />
					<p>{$LL.GenerationFullscreen.CopiedButtonState()}</p>
				</div>
			</Morpher>
		</SubtleButton>
	</div>
	{#if modalType === 'gallery'}
		<div use:copy={linkUrl} on:svelte-copy={() => setButtonObjectWithState('link', 'success')}>
			<SubtleButton state={buttonObjectsWithState.link.state === 'success' ? 'success' : 'idle'}>
				<Morpher morphed={buttonObjectsWithState.link.state === 'success'}>
					<div slot="item-0" class="flex items-center justify-center gap-1.5">
						<IconLink class="w-5 h-5 -ml-0.5" />
						<p>{$LL.Shared.CopyLinkButton()}</p>
					</div>
					<div slot="item-1" class="flex items-center justify-center gap-1.5">
						<IconTick class="w-5 h-5 -ml-0.5 scale-110" />
						<p>{$LL.GenerationFullscreen.CopiedButtonState()}</p>
					</div>
				</Morpher>
			</SubtleButton>
		</div>
	{/if}
	{#if modalType === 'generate' || modalType === 'history'}
		<div use:clickoutside={{ callback: resetDeleteStatus }}>
			<SubtleButton
				disabled={deleteStatus === 'loading'}
				onClick={deleteGeneration}
				state={deleteStatus === 'should-confirm' || deleteStatus === 'loading' ? 'danger' : 'idle'}
			>
				<Morpher morphed={deleteStatus === 'should-confirm'}>
					<div slot="item-0" class="flex items-center justify-center gap-1.5 text-c-danger">
						<Morpher morphed={deleteStatus === 'loading'}>
							<div slot="item-0" class="flex items-center justify-center gap-1.5 text-c-danger">
								<IconTrashcan class="w-5 h-5 -ml-0.5" />
								<p>{$LL.Shared.DeleteButton()}</p>
							</div>
							<div slot="item-1" class="flex items-center justify-center gap-1.5 text-c-on-primary">
								<IconLoading class="w-5 h-5 animate-spin-faster" />
							</div>
						</Morpher>
					</div>
					<div slot="item-1" class="flex items-center justify-center gap-1.5">
						<IconTrashcanFilledOpen class="w-5 h-5 -ml-0.5 scale-110 text-c-on-primary" />
					</div>
				</Morpher>
			</SubtleButton>
		</div>
	{/if}
</div>
