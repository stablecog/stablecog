<script lang="ts">
	import { generationModels } from '$ts/constants/generationModels.js';
	import { PUBLIC_OG_IMAGE_API_URL } from '$env/static/public';
	import { canonicalUrl } from '$ts/constants/main.js';
	import { previewImageVersion } from '$ts/constants/previewImageVersion.js';
	import RedirectPage from '$components/RedirectPage.svelte';
	import LL from '$i18n/i18n-svelte.js';

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
				  } on Stablecog: Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky.`
				: 'Create amazing art in seconds with AI. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky.',
		image_url: data.model_id
			? `${PUBLIC_OG_IMAGE_API_URL}/api/generation-model-v2/${data.model_id}.png`
			: `${canonicalUrl}/previews/home-${previewImageVersion}.png`
	};
</script>

<RedirectPage {...meta} {url} redirectingText={$LL.Redirect.RedirectingTitle()} />
