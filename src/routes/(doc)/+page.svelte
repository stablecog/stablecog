<script lang="ts">
	import DescribeAnything from '$components/landing/DescribeAnything.svelte';
	import Hero from '$components/landing/Hero.svelte';
	import InitImage from '$components/landing/InitImage.svelte';
	import StartCreating from '$components/landing/StartCreating.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import { staticAssetBaseUrl } from '$ts/constants/main.js';
	import { metaDescriptionDefault } from '$ts/constants/meta';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
</script>

<MetaTag
	title="Stablecog | AI Image Generator"
	description={metaDescriptionDefault}
	image_url="{staticAssetBaseUrl}/previews/home-{previewImageVersion}.png"
/>

<Hero />
<DescribeAnything />
<InitImage />
<StartCreating />
