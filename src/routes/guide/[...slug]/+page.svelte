<script lang="ts">
	import { page } from '$app/stores';
	import { flatSidebarShallow } from '$routes/guide/constants.js';
	import '$css/blog.css';
	import NextOrPrevButton from '$routes/guide/[...slug]/NextOrPrevButton.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import { canonicalUrl } from '$ts/constants/main.js';
	import ChapterButton from '$routes/guide/[...slug]/ChapterButton.svelte';

	export let data;

	$: pathname = $page.url.pathname;
	$: index = flatSidebarShallow.findIndex((item) => item.pathname === pathname);
	$: prev = index - 1 > 0 ? flatSidebarShallow[index - 1] : null;
	$: next = index + 1 < flatSidebarShallow.length ? flatSidebarShallow[index + 1] : null;
</script>

<MetaTag
	title="{data.metadata.title} | Guide"
	description={data.metadata.description}
	imageUrl={data.metadata.preview_image_url}
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex flex-col items-center pb-12">
	<article class="w-full max-w-3xl px-5 md:px-12 pt-2 md:pt-6 pb-8 blog flex flex-row flex-wrap">
		{@html data.content}
	</article>
	{#if data.sidebarItem?.children}
		<div class="w-full max-w-3xl px-5 md:px-12 pb-8 overflow-hidden">
			<h2 class="font-bold text-[1.75rem] leading-[1.35]">Chapters</h2>
			<ul class="w-[calc(100%+0.75rem)] -mx-1.5 -mb-1 flex flex-row flex-wrap mt-3">
				{#each data.sidebarItem.children as child}
					<li class="w-full md:w-1/2 p-1.5">
						<ChapterButton item={child} />
					</li>
				{/each}
			</ul>
		</div>
	{/if}
	<div class="w-full flex flex-wrap max-w-3xl px-5 md:px-12 gap-3 mt-2">
		{#if prev}
			<NextOrPrevButton item={prev} type="prev" />
		{/if}
		{#if next}
			<NextOrPrevButton item={next} type="next" />
		{/if}
	</div>
</div>
