<script lang="ts">
	import LL from '$i18n/i18n-svelte';
	import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
	import { canonicalUrl } from '$ts/constants/main';
	import { getImgProxySrc, getImgProxySrcSetSmall } from '$ts/helpers/imgproxy';

	export let type: TAvailableGenerationModelId;
	export { classes as class };
	export let sizes = '32px';
	let classes = 'w-6 h-6';
	const imageVersion = 'v3/square';
	const imageUrl = imageUrlFromModelId(type);
	const src = getImgProxySrc({ src: imageUrl, preset: '64w' });
	const srcset = getImgProxySrcSetSmall({ src: imageUrl });
	const width = '64';
	const height = '64';

	// @ts-ignore
	$: modelName = $LL.Shared.ModelOptions[type].realName();

	function imageUrlFromModelId(type: TAvailableGenerationModelId) {
		return `${canonicalUrl}/images/models/${imageVersion}/${type}.jpeg`;
	}
</script>

<img loading="lazy" class={classes} {src} {srcset} {sizes} alt={modelName} {width} {height} />
