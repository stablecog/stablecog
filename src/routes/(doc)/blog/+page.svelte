<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import PageWrapper from '$components/wrappers/PageWrapper.svelte';
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
		<h1 class="font-bold text-4xl">{$LL.Blog.TitleAlt()}</h1>
	</div>
	<ul class="w-[100%+2.5rem] -mx-5 max-w-6xl flex flex-wrap items-start justify-center mt-6">
		<li class="w-full p-2 max-w-lg md:max-w-full">
			<BlogPostCard post={data.posts[0]} featured={true} loading="eager" />
		</li>
		{#each data.posts.slice(1) as post, index}
			<li class="self-stretch flex max-w-lg w-full md:w-1/2 lg:w-1/3 p-2">
				<BlogPostCard {post} loading={index < 1 ? 'eager' : 'lazy'} />
			</li>
		{/each}
	</ul>
</PageWrapper>
