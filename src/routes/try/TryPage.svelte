<script lang="ts">
	import ChapterButton from '$components/docs/ChapterButton.svelte';
	import NextOrPrevButton from '$components/docs/NextOrPrevButton.svelte';
	import LL from '$i18n/i18n-svelte';
	import type { TSidebarItem } from '$routes/guide/types';

	export let content: string;
	export let sidebarItem: TSidebarItem | null = null;
	export let prev: TSidebarItem | null = null;
	export let next: TSidebarItem | null = null;
</script>

<div class="w-full flex flex-col items-center pb-12">
	<article class="w-full flex flex-wrap max-w-3xl px-5 md:px-12 pt-4 md:pt-8 pb-8 blog">
		{@html content}
	</article>
	{#if sidebarItem?.children}
		<div class="w-full max-w-3xl px-5 md:px-12 pb-8 overflow-hidden">
			<h2 class="font-bold text-[1.6rem] leading-[1.35]">{$LL.Guide.ChaptersTitle()}</h2>
			<ul class="w-[calc(100%+1rem)] -mx-2 -mb-1 flex flex-row flex-wrap mt-3">
				{#each sidebarItem.children.filter((c) => c.pathname !== '/try/models') as child}
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
