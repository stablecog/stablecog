<script lang="ts">
	import SubtleButton from '$components/buttons/SubtleButton.svelte';
	import IconCopy from '$components/icons/IconCopy.svelte';
	import IconDownload from '$components/icons/IconDownload.svelte';
	import IconTick from '$components/icons/IconTick.svelte';
	import IconTrashcan from '$components/icons/IconTrashcan.svelte';
	import IconTrashcanFilledOpen from '$components/icons/IconTrashcanFilledOpen.svelte';
	import Morpher from '$components/Morpher.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { downloadGenerationImage } from '$ts/helpers/downloadGenerationImage';
	import {
		activeGeneration,
		setGenerationOutputToDeleted,
		setGenerationOutputToSubmitted,
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
	import { apiUrl } from '$ts/constants/main';
	import { page } from '$app/stores';
	import { useQueryClient } from '@tanstack/svelte-query';
	import type { TUserGenerationFullOutputsPage } from '$ts/queries/userGenerations';
	import {
		logGalleryGenerateSimilarClicked,
		logGenerationOutputDeleted,
		logGenerationOutputSubmittedToGallery
	} from '$ts/helpers/loggers';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { userSummary } from '$ts/stores/user/summary';
	import IconUpload from '$components/icons/IconUpload.svelte';
	import IconTickOnly from '$components/icons/IconTickOnly.svelte';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import { userGenerationFullOutputsQueryKey } from '$ts/stores/user/keys';
	import { appVersion } from '$ts/stores/appVersion';

	export let generation: TGenerationWithSelectedOutput;
	export let generateSimilarUrl: string;
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
				seed: generation.seed,
				outputIndex: generation.outputs.findIndex(
					(output) => output.id === generation.selected_output.id
				),
				logProps: {
					'SC - Advanced Mode': $advancedModeApp,
					'SC - Locale': $locale,
					'SC - Output Id': generation.selected_output.id,
					'SC - Page': `${$page.url.pathname}${$page.url.search}`,
					'SC - Generation Id': generation.id,
					'SC - User Id': $page.data.session?.user.id,
					'SC - Stripe Product Id': $userSummary?.product_id,
					'SC - App Version': $appVersion
				}
			});
			setButtonObjectWithState('download', 'success');
		} catch (error) {
			console.log("Couldn't download image", error);
			setButtonObjectWithState('download', 'idle');
		}
	};

	let deleteStatus: 'idle' | 'should-confirm' | 'loading' | 'success' = 'idle';

	let submitToGalleryStatus: 'idle' | 'loading' | 'success' = 'idle';

	$: logProps = {
		'SC - Generation Id': generation.id,
		'SC - Output Id': generation.selected_output.id,
		'SC - Advanced Mode': $advancedModeApp,
		'SC - Locale': $locale,
		'SC - Page': `${$page.url.pathname}${$page.url.search}`,
		'SC - User Id': $page.data.session?.user.id,
		'SC - Stripe Product Id': $userSummary?.product_id,
		'SC - App Version': $appVersion
	};

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
			logGenerationOutputDeleted(logProps);
			if (modalType === 'history') {
				queryClient.setQueryData($userGenerationFullOutputsQueryKey, (data: any) => ({
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
			deleteStatus = 'success';
		} catch (error) {
			console.log('Error deleting generation output', error);
			resetDeleteStatus();
		}
	}
	const resetDeleteStatus = () => (deleteStatus = 'idle');

	async function submitToGallery() {
		submitToGalleryStatus = 'loading';
		try {
			const res = await fetch(`${apiUrl.origin}/v1/user/gallery`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$page.data.session?.access_token}`
				},
				body: JSON.stringify({ generation_output_ids: [generation.selected_output.id] })
			});
			if (!res.ok) throw new Error('Response not ok');
			console.log('Submit to gallery response', res);
			logGenerationOutputSubmittedToGallery(logProps);
			if (modalType === 'history') {
				queryClient.setQueryData($userGenerationFullOutputsQueryKey, (data: any) => ({
					...data,
					pages: data.pages.map((page: TUserGenerationFullOutputsPage) => {
						return {
							...page,
							outputs: page.outputs.map((output) =>
								output.id === generation.selected_output.id
									? { ...output, gallery_status: 'submitted' }
									: output
							)
						};
					})
				}));
			} else if (modalType === 'generate') {
				setGenerationOutputToSubmitted(generation.selected_output.id);
			}
			submitToGalleryStatus = 'success';
		} catch (error) {
			console.log('Error submitting generation', error);
			resetSubmitToGalleryStatus();
		}
	}

	const resetSubmitToGalleryStatus = () => (submitToGalleryStatus = 'idle');
</script>

<div class="w-full flex flex-wrap gap-3 pb-1">
	<SubtleButton
		prefetch={true}
		href={generateSimilarUrl}
		onClick={() => {
			if (modalType === 'gallery') {
				logGalleryGenerateSimilarClicked({
					'SC - Advanced Mode': $advancedModeApp,
					'SC - Output Id': generation.selected_output.id,
					'SC - User Id': $page.data.session?.user.id,
					'SC - Stripe Product Id': $userSummary?.product_id,
					'SC - App Version': $appVersion
				});
			}
		}}
	>
		<div class="flex items-center justify-center gap-1.5">
			<IconWand class="w-5 h-5 -ml-0.5" />
			<p>{$LL.GenerationFullscreen.GenerateSimilarButton()}</p>
		</div>
	</SubtleButton>
	<div
		use:copy={generation.prompt.text}
		on:svelte-copy={() => setButtonObjectWithState('prompt', 'success')}
	>
		<SubtleButton state={buttonObjectsWithState.prompt.state === 'success' ? 'success' : 'idle'}>
			<Morpher morphed={buttonObjectsWithState.prompt.state === 'success'}>
				<div slot="0" class="flex items-center justify-center gap-1.5">
					<IconCopy class="w-5 h-5 -ml-0.5" />
					<p>{$LL.GenerationFullscreen.CopyPromptButton()}</p>
				</div>
				<div slot="1" class="flex items-center justify-center gap-1.5">
					<IconTick class="w-5 h-5 -ml-0.5 scale-110" />
					<p>{$LL.GenerationFullscreen.CopiedButtonState()}</p>
				</div>
			</Morpher>
		</SubtleButton>
	</div>
	{#if (modalType === 'generate' || modalType === 'history') && !generation.selected_output.image_url.includes('placeholder')}
		<SubtleButton
			onClick={onDownloadImageClicked}
			disabled={buttonObjectsWithState.download.state === 'loading'}
			state={buttonObjectsWithState.download.state === 'success' ? 'success' : 'idle'}
		>
			<Morpher morphed={buttonObjectsWithState.download.state === 'success'}>
				<div slot="0" class="flex items-center justify-center gap-1.5">
					<Morpher morphed={buttonObjectsWithState.download.state === 'loading'}>
						<div slot="0" class="flex items-center justify-center gap-1.5">
							<IconDownload class="w-5 h-5 -ml-0.5" />
							<p>{$LL.GenerationFullscreen.DownloadButton()}</p>
						</div>
						<div slot="1" class="flex items-center justify-center gap-1.5">
							<IconAnimatedSpinner
								class="w-5 h-5"
								loading={buttonObjectsWithState.download.state === 'loading'}
							/>
						</div>
					</Morpher>
				</div>
				<div slot="1" class="flex items-center justify-center gap-1.5">
					<IconTick class="w-5 h-5 -ml-0.5 transform scale-110 text-c-on-primary" />
					<p>{$LL.GenerationFullscreen.DoneButtonState()}</p>
				</div>
			</Morpher>
		</SubtleButton>
	{/if}
	{#if modalType === 'gallery'}
		<div use:copy={linkUrl} on:svelte-copy={() => setButtonObjectWithState('link', 'success')}>
			<SubtleButton state={buttonObjectsWithState.link.state === 'success' ? 'success' : 'idle'}>
				<Morpher morphed={buttonObjectsWithState.link.state === 'success'}>
					<div slot="0" class="flex items-center justify-center gap-1.5">
						<IconLink class="w-5 h-5 -ml-0.5" />
						<p>{$LL.Shared.CopyLinkButton()}</p>
					</div>
					<div slot="1" class="flex items-center justify-center gap-1.5">
						<IconTick class="w-5 h-5 -ml-0.5 scale-110" />
						<p>{$LL.GenerationFullscreen.CopiedButtonState()}</p>
					</div>
				</Morpher>
			</SubtleButton>
		</div>
	{/if}
	{#if modalType === 'generate' || modalType === 'history'}
		{#if $userSummary?.product_id || $userSummary?.has_nonfree_credits === true}
			{#if submitToGalleryStatus === 'success' || generation.selected_output.gallery_status !== 'not_submitted'}
				<SubtleButton disabled={true}>
					<div class="flex items-center justify-center gap-1.5 text-c-success">
						<IconTickOnly class="w-4.5 h-4.5 -ml-0.5" />
						<p>{$LL.GenerationFullscreen.SubmittedTitle()}</p>
					</div>
				</SubtleButton>
			{:else}
				<SubtleButton disabled={submitToGalleryStatus === 'loading'} onClick={submitToGallery}>
					<div class="flex items-center justify-center gap-1.5 text-c-on-bg">
						<Morpher morphed={submitToGalleryStatus === 'loading'}>
							<div slot="0" class="flex items-center justify-center gap-1.5 text-c-on-bg">
								<IconUpload class="w-5 h-5 -ml-0.5" />
								<p>{$LL.GenerationFullscreen.SubmitToGalleryButton()}</p>
							</div>
							<div slot="1" class="flex items-center justify-center gap-1.5 text-c-on-bg">
								<IconAnimatedSpinner class="w-5 h-5" />
							</div>
						</Morpher>
					</div>
				</SubtleButton>
			{/if}
		{/if}
		<div use:clickoutside={{ callback: resetDeleteStatus }}>
			<SubtleButton
				disabled={deleteStatus === 'loading'}
				onClick={deleteGeneration}
				state={deleteStatus === 'should-confirm' || deleteStatus === 'loading' ? 'danger' : 'idle'}
			>
				<Morpher morphed={deleteStatus === 'should-confirm'}>
					<div slot="0" class="flex items-center justify-center gap-1.5 text-c-danger">
						<Morpher morphed={deleteStatus === 'loading'}>
							<div slot="0" class="flex items-center justify-center gap-1.5 text-c-danger">
								<IconTrashcan class="w-5 h-5 -ml-0.5" />
								<p>{$LL.Shared.DeleteButton()}</p>
							</div>
							<div slot="1" class="flex items-center justify-center gap-1.5 text-c-on-primary">
								<IconAnimatedSpinner class="w-5 h-5" />
							</div>
						</Morpher>
					</div>
					<div slot="1" class="flex items-center justify-center gap-1.5">
						<IconTrashcanFilledOpen class="w-5 h-5 -ml-0.5 scale-110 text-c-on-primary" />
					</div>
				</Morpher>
			</SubtleButton>
		</div>
	{/if}
</div>
