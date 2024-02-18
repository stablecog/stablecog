<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import {
		getOutputOnProfileMetaTagDescriptionFromPromptText,
		shortenAndCapitalizeString
	} from '$ts/helpers/metaTag.js';
	import { getUserProfilePreviewImageUrlFromOutputId } from '$ts/helpers/getPreviewImageUrl.js';
	import { canonicalUrl } from '$ts/constants/main.js';
	import OutputPage from '$components/outputPage/OutputPage.svelte';

	export let data;

	$: output = data.generationFullOutput;
	$: similarOutputs = data.similarGenerationFullOutputs;
	$: shortPromptTitle = shortenAndCapitalizeString(output.generation.prompt.text);
</script>

<MetaTag
	title={`"${shortPromptTitle}" | @${data.username} on Stablecog`}
	description={getOutputOnProfileMetaTagDescriptionFromPromptText(
		output.generation.prompt.text,
		data.username
	)}
	image_url={getUserProfilePreviewImageUrlFromOutputId(output.id, data.username)}
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<OutputPage {output} {similarOutputs} modalType="user-profile" />
