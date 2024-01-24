<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import {
		capitalize,
		getOutputOnProfileMetaTagDescriptionFromPromptText
	} from '$ts/helpers/metaTag.js';
	import { getUserProfilePreviewImageUrlFromOutputId } from '$ts/helpers/getPreviewImageUrl.js';
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
	title="{shortPromptTitle} | @{data.username}"
	description={getOutputOnProfileMetaTagDescriptionFromPromptText(
		output.generation.prompt.text,
		data.username
	)}
	image_url={getUserProfilePreviewImageUrlFromOutputId(output.id, data.username)}
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<OutputPage {output} {similarOutputs} modalType="user-profile" />
