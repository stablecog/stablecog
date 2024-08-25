<script lang="ts">
	import { page } from '$app/stores';
	import BlogPostCard from '$components/docs/BlogPostCard.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import PageWrapper from '$components/wrappers/PageWrapper.svelte';
	import LL from '$i18n/i18n-svelte';
	import { auxBucketStaticUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';

	export let data;
</script>

<MetaTag
	title="Blog | Stablecog"
	description="Articles about Stable Diffusion tips and tricks, Stable Diffusion experiments, other AI related topics and the latest Stablecog news."
	image_url="{auxBucketStaticUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

<PageWrapper>
	<div class="flex w-full max-w-7xl justify-center text-center">
		<h1 class="text-balance text-4xl font-bold">{$LL.Blog.TitleAlt()}</h1>
	</div>
	<ul class="-mx-5 mt-6 flex w-[100%+2.5rem] max-w-6xl flex-wrap items-start justify-center">
		<li class="w-full max-w-lg p-2 md:max-w-full">
			<BlogPostCard post={data.posts[0]} featured={true} loading="eager" />
		</li>
		{#each data.posts.slice(1) as post, index}
			<li class="flex w-full max-w-lg self-stretch p-2 md:w-1/2 lg:w-1/3">
				<BlogPostCard {post} loading={index < 1 ? 'eager' : 'lazy'} />
			</li>
		{/each}
	</ul>
</PageWrapper>
