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
	import type { TGenerationWithSelectedOutput } from '$ts/stores/user/generation';
	import { copy } from 'svelte-copy';
	import type {
		TCopiableButtonsObjects,
		TGenerationFullScreenModalType
	} from '$components/generationFullScreen/types';
	import IconWand from '$components/icons/IconWand.svelte';
	import { getGenerationUrlFromParams } from '$ts/helpers/getGenerationUrlFromParams';
	import IconLink from '$components/icons/IconLink.svelte';

	export let generation: TGenerationWithSelectedOutput;
	export let generateSimilarUrl: string;
	export let regenerateUrl: string;
	export let linkUrl: string;
	export let onCopied: (key: string) => void;
	export let copiableButtonObjects: TCopiableButtonsObjects;
	export let currentImageUrl: string;
	export let modalType: TGenerationFullScreenModalType;

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

	async function deleteGeneration(id: number | undefined) {}
</script>

<div class="w-full flex flex-wrap gap-3 pb-1">
	{#if modalType === 'generate' || modalType === 'history'}
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
	{/if}
	{#if modalType === 'history' || modalType === 'gallery'}
		<div class="flex relative">
			<SubtleButton target="_self" prefetch={true} href={generateSimilarUrl}>
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
	<div use:copy={generation.prompt.text} on:svelte-copy={() => onCopied('prompt')}>
		<SubtleButton state={copiableButtonObjects.prompt.copied ? 'success' : 'idle'}>
			<Morpher morphed={copiableButtonObjects.prompt.copied}>
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
		<div use:copy={linkUrl} on:svelte-copy={() => onCopied('link')}>
			<SubtleButton state={copiableButtonObjects.link.copied ? 'success' : 'idle'}>
				<Morpher morphed={copiableButtonObjects.link.copied}>
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
	{/if}
</div>
