<script lang="ts">
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
		<div class="w-full flex flex-col items-start justify-start px-2 pt-1 pb-2.25">
			<p
				class="max-w-full bg-c-bg-tertiary text-base flex-shrink min-w-0 whitespace-nowrap overflow-hidden overflow-ellipsis
				font-medium rounded-tr-lg"
			>
				{modelName}
			</p>
			<p
				class="max-w-full text-xs leading-none text-c-on-bg/60 font-medium mt-0.5 flex-shrink min-w-0 whitespace-nowrap overflow-hidden overflow-ellipsis"
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
