<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/MetaTag.svelte';
	import ChapterButton from '$components/docs/ChapterButton.svelte';
	import NextOrPrevButton from '$components/docs/NextOrPrevButton.svelte';
	import LL from '$i18n/i18n-svelte';
	import type { TGuideEntryMetadataExtended, TSidebarItem } from '$docroutes/guide/types';
	import { canonicalUrl } from '$ts/constants/main';
	import type { Writable } from 'svelte/store';
	import type { TDirTreeItem } from '$routes/+layout';
	import { onDestroy } from 'svelte';

	export let content: ConstructorOfATypedSvelteComponent;
	export let metadata: TGuideEntryMetadataExtended;
	export let sidebarItem: TSidebarItem | null = null;
	export let prev: TSidebarItem | null = null;
	export let next: TSidebarItem | null = null;
	export let parentItem: TSidebarItem | null = null;
	export let dirTree: Writable<TDirTreeItem[]>;

	const rootPathnames = ['/try'];

	$: dirTree?.set([
		...(parentItem?.title && !rootPathnames.includes(parentItem.pathname)
			? [{ title: parentItem?.title, href: parentItem.pathname }]
			: []),
		{ title: sidebarItem?.title || '', href: sidebarItem?.pathname || '' }
	]);

	onDestroy(() => {
		dirTree.set([]);
	});
</script>

<MetaTag
	title="{metadata.title} | {rootPathnames.includes($page.url.pathname) ? 'Stablecog' : 'Try'}"
	description={metadata.description}
	image_url={metadata.preview_image_url}
	article_author={metadata.author}
	article_publisher={canonicalUrl}
	article_published_time={metadata.date}
/>

<div class="w-full flex flex-col items-center pb-12">
	<article class="w-full flex flex-wrap max-w-3xl px-5 md:px-12 pt-4 md:pt-8 pb-8 blog">
		<svelte:component this={content} />
	</article>
	{#if sidebarItem?.children}
		<div class="w-full max-w-3xl px-5 md:px-12 pb-8 overflow-hidden">
			<h2 class="font-bold text-[1.6rem] leading-[1.35]">{$LL.Guide.ChaptersTitle()}</h2>
			<ul class="w-[calc(100%+1rem)] -mx-2 -mb-1 flex flex-row flex-wrap mt-3">
				{#each sidebarItem.children.filter((c) => !rootPathnames.includes(c.pathname)) as child}
					<li class="w-full md:w-1/2 p-2">
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
