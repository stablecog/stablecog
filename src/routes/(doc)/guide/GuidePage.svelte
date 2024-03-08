<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import ChapterButton from '$components/docs/ChapterButton.svelte';
	import NextOrPrevButton from '$components/docs/NextOrPrevButton.svelte';
	import LL from '$i18n/i18n-svelte';
	import type { TGuideEntryMetadataExtended, TSidebarItem } from '$docroutes/guide/types';
	import { canonicalUrl } from '$ts/constants/main';
	import type { TDirTreeItem } from '$routes/+layout';
	import type { Writable } from 'svelte/store';
	import { onDestroy } from 'svelte';

	export let content: ConstructorOfATypedSvelteComponent;
	export let metadata: TGuideEntryMetadataExtended;
	export let sidebarItem: TSidebarItem | null = null;
	export let prev: TSidebarItem | null = null;
	export let next: TSidebarItem | null = null;
	export let parentItem: TSidebarItem | null = null;
	export let dirTree: Writable<TDirTreeItem[]>;

	$: dirTree?.set([
		...(parentItem?.title ? [{ title: parentItem?.title, href: parentItem.pathname }] : []),
		{ title: sidebarItem?.title || '', href: sidebarItem?.pathname || '' }
	]);

	const rootPathnames = ['/guide'];

	onDestroy(() => {
		dirTree.set([]);
	});
</script>

<MetaTag
	title="{metadata.title} | {rootPathnames.includes($page.url.pathname) ? 'Stablecog' : 'Guide'}"
	description={metadata.description}
	image_url={metadata.preview_image_url}
	article_author={metadata.author}
	article_publisher={canonicalUrl}
	article_published_time={metadata.date}
/>

<div class="flex w-full flex-col items-center pb-12">
	<article class="blog flex w-full max-w-3xl flex-wrap px-5 pb-8 pt-4 md:px-12 md:pt-8">
		<svelte:component this={content} />
	</article>
	{#if sidebarItem?.children}
		<div class="w-full max-w-3xl overflow-hidden px-5 pb-8 md:px-12">
			<h2 class="text-[1.6rem] font-bold leading-[1.35]">{$LL.Guide.ChaptersTitle()}</h2>
			<ul class="-mx-2 -mb-1 mt-3 flex w-[calc(100%+1rem)] flex-row flex-wrap">
				{#each sidebarItem.children.filter((c) => !rootPathnames.includes(c.pathname)) as child}
					<li class="w-full p-2 md:w-1/2">
						<ChapterButton item={child} />
					</li>
				{/each}
			</ul>
		</div>
	{/if}
	<div class="mt-2 flex w-full max-w-3xl flex-wrap gap-3 px-5 md:px-12">
		{#if prev}
			<NextOrPrevButton item={prev} type="prev" />
		{/if}
		{#if next}
			<NextOrPrevButton item={next} type="next" />
		{/if}
	</div>
</div>
