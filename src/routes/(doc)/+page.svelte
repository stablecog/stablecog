<script lang="ts">
	import MetaTag from '$components/utils/MetaTag.svelte';
	import { canonicalUrl } from '$ts/constants/main.js';
	import DescribeAnything from '$components/landing/DescribeAnything.svelte';
	import InitImage from '$components/landing/InitImage.svelte';
	import StartCreating from '$components/landing/StartCreating.svelte';
	import Hero from '$components/landing/Hero.svelte';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import { metaDescriptionDefault } from '$ts/constants/meta';
</script>

<MetaTag
	title="Stablecog | AI Image Generator"
	description={metaDescriptionDefault}
	image_url="{canonicalUrl}/previews/home-{previewImageVersion}.png"
/>

<Hero />
<DescribeAnything />
<InitImage />
<StartCreating />
