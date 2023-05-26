<script lang="ts">
	import SrcsetProvider from '$components/generationImage/SrcsetProvider.svelte';
	import type { TGenerationImageCardType } from '$components/generationImage/types';
	import { getImgProxySrcFull } from '$ts/helpers/imgproxy';

	export let onImageLoad: (e: Event) => void;
	export let backgroundImageUrl: string;
	export let backgroundImageWidth: number;
	export let backgroundImageHeight: number;
	export let imageUrl: string;
	export let imageWidth: number;
	export let imageHeight: number;
	export let prompt: string;
	export let cardType: TGenerationImageCardType;
</script>

<SrcsetProvider src={backgroundImageUrl} {cardType} let:sizes let:srcset>
	<img
		class="w-full transform transition h-auto lg:h-full lg:object-contain absolute lg:left-0 lg:top-0"
		{sizes}
		src={backgroundImageUrl}
		{srcset}
		alt="Background for: {prompt}"
		width={backgroundImageWidth}
		height={backgroundImageHeight}
	/>
</SrcsetProvider>
<img
	on:load={onImageLoad}
	class="w-full relative transition h-auto lg:h-full lg:object-contain lg:absolute lg:left-0 lg:top-0"
	src={imageUrl}
	alt={prompt}
	width={imageWidth}
	height={imageHeight}
/>
