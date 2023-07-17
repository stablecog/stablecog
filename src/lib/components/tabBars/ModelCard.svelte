<script lang="ts">
	import LL from '$i18n/i18n-svelte';
	import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
	import { aspectRatioToImageSize } from '$ts/constants/generationSize';
	import { canonicalUrl } from '$ts/constants/main';
	import { getImgProxySrcDefault, getImgProxySrcSet } from '$ts/helpers/imgproxy';
	import { generationAspectRatio } from '$ts/stores/generationSettings';
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export let modelId: TAvailableGenerationModelId;
	export let onClick: () => void;
	export let isSelected: boolean;

	const imageVersion = 'v3/wide';
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

<button on:click={onClick} class="w-full flex px-[calc(0.5rem+1px)] py-[calc(0.5rem-4px)] group">
	<div
		class="w-full transition rounded-xl {isSelected
			? 'ring-2'
			: 'ring-0'} ring-c-primary not-touch:group-hover:ring-2"
	>
		<div
			class="w-full flex flex-col text-left items-start justify-start transition
    	rounded-xl bg-c-bg-tertiary overflow-hidden z-0 relative border-3 border-c-bg-tertiary"
		>
			<img
				loading="lazy"
				class="w-full h-auto"
				{src}
				{srcset}
				{sizes}
				alt={modelName}
				{width}
				{height}
			/>
			<div class="absolute left-0 bottom-0 w-full flex items-end justify-between p-1 gap-3">
				<p
					class="bg-c-bg-tertiary/80 text-sm flex-shrink min-w-0 whitespace-nowrap overflow-hidden overflow-ellipsis
        	font-medium px-1.5 py-0.5 rounded-md"
				>
					{modelName}
				</p>
				<p
					class="text-xs px-1.25 pt-1.25 pb-1 rounded-md leading-none bg-c-bg-tertiary/80 text-c-on-bg font-medium"
				>
					{aspectRatioToImageSize[$generationAspectRatio][modelId]?.width ??
						aspectRatioToImageSize[$generationAspectRatio].default.width} ×
					{aspectRatioToImageSize[$generationAspectRatio][modelId]?.height ??
						aspectRatioToImageSize[$generationAspectRatio].default.height}
				</p>
			</div>
			{#if isSelected}
				<div
					transition:scale={{ duration: 200, easing: quadOut, start: 0 }}
					class="p-3px bg-c-bg-tertiary/80 absolute left-1 top-1 flex-shrink-0 rounded-full"
				>
					<div class="w-2 h-2 rounded-full bg-c-primary" />
				</div>
			{/if}
		</div>
	</div>
</button>
