<script lang="ts">
	import { modelImageVersion } from '$components/cards/modelCard/constants';
	import IconNewAlt from '$components/icons/IconNewAlt.svelte';
	import LL from '$i18n/i18n-svelte';
	import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
	import { aspectRatioToImageSize } from '$ts/constants/generationSize';
	import { canonicalUrl } from '$ts/constants/main';
	import { getImgProxySrcDefault, getImgProxySrcSet } from '$ts/helpers/imgproxy';
	import { generationAspectRatio } from '$ts/stores/generationSettings';

	export let modelId: TAvailableGenerationModelId;
	export let onClick: () => void;
	export let isSelected: boolean;
	export let isNew = false;

	const imageFolder = '16x9';
	const imageUrl = imageUrlFromModelId({ modelId, folder: imageFolder });
	const src = getImgProxySrcDefault(imageUrl);
	const srcset = getImgProxySrcSet({ src: imageUrl });
	const sizes = `(min-width: 768px) 240px, 50vw`;
	const width = '1440';
	const height = '810';

	// @ts-ignore
	$: modelName = $LL.Shared.ModelOptions[modelId].realName();

	function imageUrlFromModelId({
		modelId,
		folder
	}: {
		modelId: TAvailableGenerationModelId;
		folder: string;
	}) {
		return `${canonicalUrl}/images/models/${modelImageVersion}/${folder}/${modelId}.jpeg`;
	}
</script>

<button
	on:click={onClick}
	class="group flex w-1/2 touch-manipulation flex-col p-1 md:w-full md:px-[calc(0.5rem+1px)] md:py-[calc(0.5rem-3px)]"
>
	<div
		class="relative z-0 flex w-full flex-col items-start justify-start
    	overflow-hidden rounded-lg border-3 border-c-bg-tertiary bg-c-bg-tertiary text-left transition {isSelected
			? 'ring-2'
			: 'ring-0'} ring-c-primary not-touch:group-hover:ring-2"
	>
		<div class="flex w-full flex-col items-start justify-start px-1.75 pb-2.5 pt-1">
			<div class="flex max-w-full items-center justify-start gap-2">
				<p
					class="min-w-0 flex-shrink overflow-hidden overflow-ellipsis whitespace-nowrap rounded-tr-lg bg-c-bg-tertiary
					text-base font-medium"
				>
					{modelName}
				</p>
				{#if isNew}
					<div
						class="mb-0.75 flex items-center gap-0.75 rounded bg-c-secondary/10 py-0.25
						pl-1 pr-1.5 text-xs font-medium text-c-secondary"
					>
						<IconNewAlt class="h-3 w-3" />
						<p class="mt-0.25">{$LL.Shared.NewTitle()}</p>
					</div>
				{/if}
			</div>
			<p
				class="mt-0.75 min-w-0 max-w-full flex-shrink overflow-hidden overflow-ellipsis whitespace-nowrap text-xs font-medium leading-none text-c-on-bg/60"
			>
				{aspectRatioToImageSize[$generationAspectRatio][modelId]?.width ??
					aspectRatioToImageSize[$generationAspectRatio].default.width} ×
				{aspectRatioToImageSize[$generationAspectRatio][modelId]?.height ??
					aspectRatioToImageSize[$generationAspectRatio].default.height}
			</p>
		</div>
		<img
			loading="lazy"
			class="h-auto w-full rounded-md bg-c-bg-tertiary"
			{src}
			{srcset}
			{sizes}
			alt={modelName}
			{width}
			{height}
		/>
	</div>
</button>
