<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/MetaTag.svelte';
	import PageWrapper from '$components/PageWrapper.svelte';
	import BlogPostCard from '$components/docs/BlogPostCard.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';

	export let data;
</script>

<MetaTag
	title="Blog | Stablecog"
	description="Articles about Stable Diffusion tips and tricks, Stable Diffusion experiments, other AI related topics and the latest Stablecog news."
	image_url="{canonicalUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

<PageWrapper>
	<div class="w-full max-w-7xl flex justify-center text-center">
		<h1 class="font-bold text-4xl">{$LL.Blog.Title()}</h1>
	</div>
	<div class="w-[100%+2.5rem] -mx-5 max-w-7xl flex flex-wrap items-start justify-center mt-6">
		{#each data.posts as post}
			<div class="w-full self-stretch flex max-w-md md:w-1/2 lg:w-1/3 xl:w-auto xl:max-w-sm p-2">
				<BlogPostCard {post} />
			</div>
		{/each}
	</div>
</PageWrapper>
