<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import {
		capitalize,
		getGalleryMetaTagDescriptionFromPromptText,
		shortenAndCapitalizeString
	} from '$ts/helpers/metaTag.js';
	import { getPreviewImageUrlFromOutputId } from '$ts/helpers/getPreviewImageUrl.js';
	import { canonicalUrl } from '$ts/constants/main.js';
	import OutputPage from '$components/outputPage/OutputPage.svelte';

	export let data;

	$: output = data.generationFullOutput;
	$: similarOutputs = data.similarGenerationFullOutputs;
	$: shortPromptTitle = shortenAndCapitalizeString(output.generation.prompt.text);
</script>

<MetaTag
	title={`"${shortPromptTitle}" | Stablecog Gallery`}
	description={getGalleryMetaTagDescriptionFromPromptText(output.generation.prompt.text)}
	image_url={getPreviewImageUrlFromOutputId(output.id)}
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<OutputPage {output} {similarOutputs} modalType="gallery" />
