<script lang="ts">
	import ScBar from '$components/ScBar.svelte';
	import LL from '$i18n/i18n-svelte';
	import NoBgButton from '$components/primitives/buttons/NoBgButton.svelte';
	import IconBack from '$components/icons/IconBack.svelte';
	import { windowHeight } from '$ts/stores/window';
	import { navbarHeight } from '$ts/stores/navbarHeight';
	import type { TPostToCItem } from '$docroutes/blog/types';
	import ToCItem from '$components/docs/ToCItem.svelte';
	import { navbarEstimatedHeight } from '$ts/constants/main';

	export let toc: TPostToCItem[];
	export { classes as class };
	export let activeId: string;
	let classes = 'hidden lg:flex';
</script>

<div
	style={$windowHeight && $navbarHeight
		? `max-height: calc(${$windowHeight - $navbarHeight}px); top: calc(${$navbarHeight}px);`
		: `max-height: calc(100vh - ${navbarEstimatedHeight}px); max-height: calc(100svh - ${navbarEstimatedHeight}px); top: ${navbarEstimatedHeight}px;`}
	class="sticky top-24 mt-1 flex w-72 flex-col self-stretch overflow-hidden {classes}"
>
	<div class="absolute right-0 top-0 h-full py-4">
		<div class="h-full w-2px rounded-full bg-c-on-bg/5" />
	</div>
	<div
		class="flex h-full w-full flex-col items-start justify-start
		self-stretch"
	>
		<div class="mb-1 mt-5 flex w-full justify-center px-5">
			<NoBgButton href="/blog" prefetch={true} hoverFrom="right">
				<div class="flex items-center justify-center gap-2.5 px-2">
					<IconBack
						class="h-6 w-6 transform text-c-on-bg/50 transition group-hover:-translate-x-1
						not-touch:group-hover:text-c-primary"
					/>
					<p class="text-c-on-bg/50 transition not-touch:group-hover:text-c-primary">
						{$LL.Blog.BackToBlogButton()}
					</p>
				</div>
			</NoBgButton>
		</div>
		<div class="w-full px-5">
			<ScBar noGuide noBlog noGithub noProductHunt />
		</div>
		<div class="mt-5 w-full px-5">
			<div class="h-2px w-full rounded-full bg-c-on-bg/5 px-5" />
		</div>
		<nav class="flex max-h-full w-full flex-col overflow-auto px-3 pb-16 pt-5">
			<ul class="flex w-full flex-col">
				{#each toc as tocItem}
					<ToCItem item={tocItem} {activeId} />
				{/each}
			</ul>
		</nav>
	</div>
</div>
