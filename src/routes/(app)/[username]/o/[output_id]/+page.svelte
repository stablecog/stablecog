<script lang="ts">
	import { page } from '$app/stores';
	import OutputPage from '$components/outputPage/OutputPage.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import { canonicalUrl } from '$ts/constants/main.js';
	import { getUserProfilePreviewImageUrlFromOutputId } from '$ts/helpers/getPreviewImageUrl.js';
	import {
		getOutputOnProfileMetaTagDescriptionFromPromptText,
		shortenString
	} from '$ts/helpers/metaTag.js';

	export let data;

	$: output = data.generationFullOutput;
	$: similarOutputs = data.similarGenerationFullOutputs;
	$: shortPromptTitle = shortenString(output.generation.prompt.text);
</script>

<MetaTag
	title={`"${shortPromptTitle}" | @${data.username} on Stablecog`}
	description={getOutputOnProfileMetaTagDescriptionFromPromptText(
		output.generation.prompt.text,
		data.username
	)}
	image_url={getUserProfilePreviewImageUrlFromOutputId(output.id, data.username)}
	canonical="{canonicalUrl}{$page.url.pathname}"
	robots="noindex"
/>

<OutputPage {output} {similarOutputs} modalType="user-profile" />
