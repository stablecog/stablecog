<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import '$css/blog.css';
	import { staticAssetBaseUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';

	export let data;
</script>

<MetaTag
	title="Privacy Policy | Stablecog"
	description="Check out the privacy policy for Stablecog. Free, multilingual and open-source AI image generator using Stable Diffusion, FLUX, and Kandinsky."
	image_url="{staticAssetBaseUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

<div class="flex w-full items-start justify-center px-5 pb-7 pt-4 md:px-10 md:pb-12 md:pt-7">
	<div class="blog w-full max-w-3xl">
		<svelte:component this={data.content} class="w-full" />
	</div>
</div>
