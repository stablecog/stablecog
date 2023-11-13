<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/MetaTag.svelte';
	import { capitalize, getGalleryMetaTagDescriptionFromPromptText } from '$ts/helpers/metaTag.js';
	import { getPreviewImageUrlFromOutputId } from '$ts/helpers/getPreviewImageUrl.js';
	import { canonicalUrl } from '$ts/constants/main.js';
	import OutputPage from '$components/outputPage/OutputPage.svelte';

	export let data;

	const titleLength = 50;
	$: output = data.generationFullOutput;
	$: similarOutputs = data.similarGenerationFullOutputs;
	$: shortPromptTitle = capitalize(
		output.generation.prompt.text.slice(0, titleLength) +
			(output.generation.prompt.text.length > titleLength ? '...' : '')
	);
</script>

<MetaTag
	title="{shortPromptTitle} | Gallery"
	description={getGalleryMetaTagDescriptionFromPromptText(output.generation.prompt.text)}
	image_url={getPreviewImageUrlFromOutputId(output.id)}
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<OutputPage {output} {similarOutputs} modalType="gallery" />
