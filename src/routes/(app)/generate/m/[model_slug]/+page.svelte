<script lang="ts">
	import RedirectPage from '$components/RedirectPage.svelte';
	import LL from '$i18n/i18n-svelte.js';
	import { generationModels } from '$ts/constants/generationModels.js';
	import { staticAssetBaseUrl } from '$ts/constants/main.js';
	import { metaDescriptionDefault } from '$ts/constants/meta.js';
	import { previewImageVersion } from '$ts/constants/previewImageVersion.js';
	import { getModelPreviewImageUrl } from '$ts/helpers/getPreviewImageUrl.js';

	export let data;

	const url = data.model_id ? `/generate?mi=${data.model_id}` : `/generate`;

	$: meta = {
		title:
			data.model_id !== null && generationModels[data.model_id]?.name
				? `Generate with ${generationModels[data.model_id].name} | Stablecog`
				: 'Generate | Stablecog',
		description:
			data.model_id !== null && generationModels[data.model_id]?.name
				? `Create AI art with ${
						generationModels[data.model_id].name
					} on Stablecog: Free, multilingual and open-source AI image generator using Stable Diffusion, FLUX, and Kandinsky.`
				: metaDescriptionDefault,
		image_url: data.model_id
			? getModelPreviewImageUrl(data.model_id)
			: `${staticAssetBaseUrl}/previews/home-${previewImageVersion}.png`
	};
</script>

<RedirectPage {...meta} {url} urlIsInternal redirectingText={$LL.Redirect.RedirectingTitle()} />
