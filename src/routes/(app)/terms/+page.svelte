<script lang="ts">
	import '$css/blog.css';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { page } from '$app/stores';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';

	export let data;
</script>

<MetaTag
	title="Terms of Service | Stablecog"
	description="Check out the terms of service for Stablecog. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	image_url="{canonicalUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

<div class="w-full flex justify-center items-start pt-4 pb-7 md:pt-7 md:pb-12 px-5 md:px-10">
	<div class="w-full max-w-3xl blog">
		<svelte:component this={data.content} class="w-full" />
	</div>
</div>
