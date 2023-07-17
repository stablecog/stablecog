<script lang="ts">
	import LL from '$i18n/i18n-svelte';
	import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
	import { aspectRatioToImageSize } from '$ts/constants/generationSize';
	import { canonicalUrl } from '$ts/constants/main';
	import { getImgProxySrcDefault, getImgProxySrcSet } from '$ts/helpers/imgproxy';
	import { generationAspectRatio } from '$ts/stores/generationSettings';

	export let modelId: TAvailableGenerationModelId;
	export let isSelected: boolean;
	export let onClick: () => void;

	const imageVersion = 'v2';
	const imageUrl = imageUrlFromModelId(modelId);
	const src = getImgProxySrcDefault(imageUrl);
	const srcset = getImgProxySrcSet({ src: imageUrl });
	const sizes = `(min-width: 768px) 240px, 100vw`;
	const width = '1920';
	const height = '960';

	// @ts-ignore
	$: modelName = $LL.Shared.ModelOptions[modelId].realName();

	function imageUrlFromModelId(modelId: TAvailableGenerationModelId) {
		return `${canonicalUrl}/images/models/${imageVersion}/${modelId}.jpeg`;
	}
</script>

<button
	on:click={onClick}
	class="w-full flex px-2 py-[calc(0.5rem-2px)] first:pt-3 last:pb-3 group"
>
	<div
		class="w-full flex flex-col text-left items-start justify-start transition
    rounded-lg bg-c-bg-tertiary overflow-hidden z-0 relative ring-2 {isSelected
			? 'ring-c-primary'
			: 'ring-c-bg-tertiary'} not-touch:group-hover:ring-c-primary"
	>
		<img class="w-full h-auto" {src} {srcset} {sizes} alt={modelName} {width} {height} />
		<div
			class="absolute left-0 bottom-0 bg-c-barrier/7 rounded-b-lg w-full flex items-end justify-between py-1.5 px-1.25 gap-2"
		>
			<p
				class="bg-c-barrier/75 text-sm flex-shrink min-w-0 whitespace-nowrap overflow-hidden overflow-ellipsis
        font-medium px-1.5 py-0.5 rounded-md"
			>
				{modelName}
			</p>
			<p
				class="flex-shrink-0 text-xs px-1.25 pt-1.25 pb-1 rounded-md leading-none bg-c-barrier/75 text-c-on-bg font-medium"
			>
				{aspectRatioToImageSize[$generationAspectRatio][modelId]?.width ??
					aspectRatioToImageSize[$generationAspectRatio].default.width} ×
				{aspectRatioToImageSize[$generationAspectRatio][modelId]?.height ??
					aspectRatioToImageSize[$generationAspectRatio].default.height}
			</p>
		</div>
	</div>
</button>
