<script lang="ts">
	import IconStar from '$components/icons/IconStar.svelte';
	import { modelImageVersion } from '$components/modelCard/constants';
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
	class="touch-manipulation w-1/2 md:w-full flex flex-col p-1 md:px-[calc(0.5rem+1px)] md:py-[calc(0.5rem-3px)] group"
>
	<div
		class="w-full flex flex-col text-left items-start justify-start transition
    	rounded-lg bg-c-bg-tertiary overflow-hidden z-0 relative border-3 border-c-bg-tertiary {isSelected
			? 'ring-2'
			: 'ring-0'} ring-c-primary not-touch:group-hover:ring-2"
	>
		<div class="w-full flex flex-col items-start justify-start px-1.75 pt-1 pb-2.5">
			<div class="max-w-full flex items-center justify-start gap-2">
				<p
					class="flex-shrink min-w-0 bg-c-bg-tertiary text-base whitespace-nowrap overflow-hidden overflow-ellipsis
					font-medium rounded-tr-lg"
				>
					{modelName}
				</p>
				{#if isNew}
					<div
						class="pl-1 pr-1.5 py-0.25 items-center font-medium flex text-xs
						bg-c-secondary/10 rounded text-c-secondary gap-0.75 mb-0.75"
					>
						<IconStar class="w-3 h-3" />
						<p class="mt-0.25">{$LL.Shared.NewTitle()}</p>
					</div>
				{/if}
			</div>
			<p
				class="max-w-full text-xs leading-none text-c-on-bg/60 font-medium mt-0.75 flex-shrink min-w-0 whitespace-nowrap overflow-hidden overflow-ellipsis"
			>
				{aspectRatioToImageSize[$generationAspectRatio][modelId]?.width ??
					aspectRatioToImageSize[$generationAspectRatio].default.width} ×
				{aspectRatioToImageSize[$generationAspectRatio][modelId]?.height ??
					aspectRatioToImageSize[$generationAspectRatio].default.height}
			</p>
		</div>
		<img
			loading="lazy"
			class="w-full h-auto bg-c-bg-tertiary rounded-md"
			{src}
			{srcset}
			{sizes}
			alt={modelName}
			{width}
			{height}
		/>
	</div>
</button>
