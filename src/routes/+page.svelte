<script lang="ts">
	import MetaTag from '$components/MetaTag.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { canonicalUrl } from '$ts/constants/main.js';
	import { onMount } from 'svelte';
	import DescribeAnything from '$components/landing/DescribeAnything.svelte';
	import InitImage from '$components/landing/InitImage.svelte';
	import StartCreating from '$components/landing/StartCreating.svelte';
	import Hero from '$components/landing/Hero.svelte';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';

	const confirmOtherEmailHash =
		'#message=Confirmation+link+accepted.+Please+proceed+to+confirm+link+sent+to+the+other+email';

	onMount(async () => {
		if ($page.url.hash === confirmOtherEmailHash) {
			await goto('/account/change-email?confirm_other_email=true');
		}
	});
</script>

<MetaTag
	title="Stablecog | AI Image Generator"
	description="Create amazing art in seconds with AI. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	imageUrl="{canonicalUrl}/previews/home-{previewImageVersion}.png"
	canonical={canonicalUrl}
/>

<Hero />
<DescribeAnything />
<InitImage />
<StartCreating />
