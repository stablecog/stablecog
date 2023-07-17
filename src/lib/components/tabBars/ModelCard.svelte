<script lang="ts">
	import LL from '$i18n/i18n-svelte';
	import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
	import { aspectRatioToImageSize } from '$ts/constants/generationSize';
	import { canonicalUrl } from '$ts/constants/main';
	import { getImgProxySrcDefault, getImgProxySrcSet } from '$ts/helpers/imgproxy';
	import { generationAspectRatio } from '$ts/stores/generationSettings';

	export let modelId: TAvailableGenerationModelId;
	export let onClick: () => void;

	const imageVerison = 'v1';
	const imageUrl = imageUrlFromModelId(modelId);
	const src = getImgProxySrcDefault(imageUrl);
	const srcset = getImgProxySrcSet({ src: imageUrl });
	const sizes = `(min-width: 768px) 240px, 100vw`;

	// @ts-ignore
	$: modelName = $LL.Shared.ModelOptions[modelId].realName();

	function imageUrlFromModelId(modelId: TAvailableGenerationModelId) {
		return `${canonicalUrl}/images/models/${imageVerison}/${modelId}.jpeg`;
	}
</script>

<button
	on:click={onClick}
	class="w-full flex px-2 py-[calc(0.5rem-2px)] first:pt-3 last:pb-3 group"
>
	<div
		class="w-full flex flex-col text-left items-start justify-start transition
    rounded-lg bg-c-bg-tertiary ring-2 ring-c-bg-tertiary not-touch:group-hover:ring-c-primary"
	>
		<div class="w-full flex items-center justify-start pt-1.5 pb-2 pl-2.5 pr-1.5 gap-2">
			<p
				class="text-sm flex-1 min-w-0 whitespace-nowrap overflow-hidden overflow-ellipsis
         font-semibold"
			>
				{modelName}
			</p>
			<p
				class="text-xs px-1 pt-1.25 pb-1 rounded leading-none bg-c-primary/15 text-c-primary font-medium"
			>
				{aspectRatioToImageSize[$generationAspectRatio][modelId]?.width ??
					aspectRatioToImageSize[$generationAspectRatio].default.width} ×
				{aspectRatioToImageSize[$generationAspectRatio][modelId]?.height ??
					aspectRatioToImageSize[$generationAspectRatio].default.height}
			</p>
		</div>
		<div class="w-full p-px rounded-lg bg-c-bg-tertiary">
			<img
				class="w-full h-auto rounded-lg"
				{src}
				{srcset}
				{sizes}
				alt={modelName}
				width="1920"
				height="1080"
			/>
		</div>
	</div>
</button>
