<script lang="ts">
	import { page } from '$app/stores';
	import SubtleButton from '$components/buttons/SubtleButton.svelte';
	import IconCopy from '$components/icons/IconCopy.svelte';
	import IconDice from '$components/icons/IconDice.svelte';
	import IconDownload from '$components/icons/IconDownload.svelte';
	import IconRefresh from '$components/icons/IconRefresh.svelte';
	import IconTick from '$components/icons/IconTick.svelte';
	import IconTrashcan from '$components/icons/IconTrashcan.svelte';
	import IconTrashcanFilledOpen from '$components/icons/IconTrashcanFilledOpen.svelte';
	import Morpher from '$components/Morpher.svelte';
	import LL from '$i18n/i18n-svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { downloadGenerationImage } from '$ts/helpers/downloadGenerationImage';
	import { deleteGenerationFromDb } from '$ts/queries/indexedDb';
	import type { TGenerationWithSelectedOutput } from '$ts/stores/user/generation';
	import { copy } from 'svelte-copy';
	import { tick } from 'svelte';
	import { copyTimeoutDuration } from './constants';

	export let generation: TGenerationWithSelectedOutput;
	export let rerollUrl: string;
	export let regenerateUrl: string;
	export let promptCopied: boolean;
	export let negativePromptCopied: boolean;
	export let seedCopied: boolean;
	export let promptCopiedTimeout: NodeJS.Timeout;
	export let negativePromptCopiedTimeout: NodeJS.Timeout;
	export let seedCopiedTimeout: NodeJS.Timeout;
	export let currentImageUrl: string;

	const onPromptCopied = () => {
		promptCopied = true;
		negativePromptCopied = false;
		seedCopied = false;
		clearTimeout(promptCopiedTimeout);
		clearTimeout(negativePromptCopiedTimeout);
		clearTimeout(seedCopiedTimeout);
		promptCopiedTimeout = setTimeout(() => {
			promptCopied = false;
		}, copyTimeoutDuration);
	};

	const onNegativePromptCopied = () => {
		negativePromptCopied = true;
		promptCopied = false;
		seedCopied = false;
		clearTimeout(negativePromptCopiedTimeout);
		clearTimeout(promptCopiedTimeout);
		clearTimeout(seedCopiedTimeout);
		promptCopiedTimeout = setTimeout(() => {
			negativePromptCopied = false;
		}, copyTimeoutDuration);
	};

	let imageDownloading = false;
	const onDownloadImageClicked = async () => {
		imageDownloading = true;
		try {
			await downloadGenerationImage({
				url: currentImageUrl,
				guidanceScale: generation.guidance_scale,
				inferenceSteps: generation.inference_steps,
				isUpscaled: generation.selected_output.upscaled_image_url !== undefined,
				prompt: generation.prompt.text,
				seed: generation.seed
			});
		} catch (error) {
			console.log("Couldn't download image", error);
		}
		imageDownloading = false;
	};

	let deleteStatus: 'idle' | 'loading' | 'success' | 'should-confirm' = 'idle';

	async function deleteGeneration(id: number | undefined) {
		if (id === undefined) {
			console.log("Can't delete generation, id is undefined");
			return;
		}
		if (deleteStatus === 'idle') {
			deleteStatus = 'should-confirm';
			return;
		}
		try {
			deleteStatus = 'should-confirm';
			await tick();
			setTimeout(() => (deleteStatus = 'loading'));
			await deleteGenerationFromDb(id);
			deleteStatus = 'success';
			/* setTimeout(() => {
      dispatchDelete('delete', { generation });
    }, 300); */
		} catch (error) {
			console.log(error);
			deleteStatus = 'idle';
		}
	}
</script>

<div class="w-full flex flex-wrap gap-3">
	<SubtleButton onClick={onDownloadImageClicked} state={imageDownloading ? 'success' : 'idle'}>
		<Morpher morphed={imageDownloading}>
			<div slot="item-0" class="flex items-center justify-center gap-1.5">
				<IconDownload class="w-5 h-5 -ml-0.5" />
				<p>{$LL.GenerationFullscreen.DownloadButton()}</p>
			</div>
			<div slot="item-1" class="flex items-center justify-center gap-1.5">
				<IconTick class="w-5 h-5 -ml-0.5 transform scale-110" />
				<p>{$LL.GenerationFullscreen.DoneButtonState()}</p>
			</div>
		</Morpher>
	</SubtleButton>
	{#if $page.url.pathname !== '/'}
		<div class="flex relative">
			<SubtleButton target="_self" prefetch={true} href={rerollUrl}>
				<div class="flex items-center justify-center gap-1.5">
					<IconDice class="w-5 h-5 -ml-0.5" />
					<p>{$LL.GenerationFullscreen.RerollButton()}</p>
				</div>
			</SubtleButton>
		</div>
		<div class="flex relative">
			<SubtleButton target="_self" prefetch={true} href={regenerateUrl}>
				<div class="flex items-center justify-center gap-1.5">
					<IconRefresh class="w-5 h-5 -ml-0.5" />
					<p>{$LL.GenerationFullscreen.RegenerateButton()}</p>
				</div>
			</SubtleButton>
		</div>
	{/if}
	<div use:copy={generation.prompt.text} on:svelte-copy={onPromptCopied}>
		<SubtleButton state={promptCopied ? 'success' : 'idle'}>
			<Morpher morphed={promptCopied}>
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
	{#if generation.negative_prompt}
		<div use:copy={generation.negative_prompt.text} on:svelte-copy={onNegativePromptCopied}>
			<SubtleButton state={negativePromptCopied ? 'success' : 'idle'}>
				<Morpher morphed={negativePromptCopied}>
					<div slot="item-0" class="flex items-center justify-center gap-1.5">
						<IconCopy class="w-5 h-5 -ml-0.5" />
						<p>{$LL.GenerationFullscreen.CopyNegativePromptButton()}</p>
					</div>
					<div slot="item-1" class="flex items-center justify-center gap-1.5">
						<IconTick class="w-5 h-5 -ml-0.5 scale-110" />
						<p>{$LL.GenerationFullscreen.CopiedButtonState()}</p>
					</div>
				</Morpher>
			</SubtleButton>
		</div>
	{/if}
	<div
		use:clickoutside={{
			callback: () => (deleteStatus === 'should-confirm' ? (deleteStatus = 'idle') : null)
		}}
	>
		<SubtleButton disabled={deleteStatus === 'loading'} onClick={() => null}>
			<Morpher morphed={deleteStatus === 'should-confirm'}>
				<div slot="item-0" class="flex items-center justify-center gap-1.5 text-c-danger">
					<IconTrashcan class="w-5 h-5 -ml-0.5" />
					<p>{$LL.Shared.DeleteButton()}</p>
				</div>
				<div slot="item-1" class="flex items-center justify-center gap-1.5 text-c-danger">
					<IconTrashcanFilledOpen class="w-5 h-5 -ml-0.5 scale-110" />
				</div>
			</Morpher>
		</SubtleButton>
	</div>
</div>
