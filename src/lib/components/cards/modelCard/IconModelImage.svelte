<script lang="ts">
	import { modelImageVersion } from '$components/cards/modelCard/constants';
	import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
	import { staticAssetBaseUrl } from '$ts/constants/main';

	import { getImgProxySrc, getImgProxySrcSetSmall } from '$ts/helpers/imgproxy';

	export let type: TAvailableGenerationModelId;
	export { classes as class };
	export let sizes = '44px';
	let classes = 'w-6 h-6';
	const imageFolder = '1x1';
	$: imageUrl = imageUrlFromModelId(type);
	$: src = getImgProxySrc({ src: imageUrl, preset: '64w' });
	$: srcset = getImgProxySrcSetSmall({ src: imageUrl });
	const width = '64';
	const height = '64';

	function imageUrlFromModelId(type: TAvailableGenerationModelId) {
		return `${staticAssetBaseUrl}/images/models/${modelImageVersion}/${imageFolder}/${type}.jpeg`;
	}
</script>

{#key src}
	<img loading="lazy" class={classes} {src} {srcset} {sizes} alt={type} {width} {height} />
{/key}
