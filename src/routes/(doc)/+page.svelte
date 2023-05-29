<script lang="ts">
	import MetaTag from '$components/MetaTag.svelte';
	import { canonicalUrl } from '$ts/constants/main.js';
	import DescribeAnything from '$components/landing/DescribeAnything.svelte';
	import InitImage from '$components/landing/InitImage.svelte';
	import StartCreating from '$components/landing/StartCreating.svelte';
	import Hero from '$components/landing/Hero.svelte';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
</script>

<MetaTag
	title="Stablecog | AI Image Generator"
	description="Create amazing art in seconds with AI. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	image_url="{canonicalUrl}/previews/home-{previewImageVersion}.png"
/>

<Hero />
<DescribeAnything />
<InitImage />
<StartCreating />
