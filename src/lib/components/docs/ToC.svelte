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
	class="w-72 self-stretch flex flex-col sticky top-24 mt-1 overflow-hidden {classes}"
>
	<div class="h-full absolute right-0 top-0 py-4">
		<div class="h-full w-2px bg-c-on-bg/5 rounded-full" />
	</div>
	<div
		class="w-full h-full items-start justify-start flex flex-col
		self-stretch"
	>
		<div class="w-full flex justify-center mb-1 px-5 mt-5">
			<NoBgButton href="/blog" prefetch={true} hoverFrom="right">
				<div class="flex items-center justify-center gap-2.5 px-2 py-1">
					<IconBack
						class="w-6 h-6 transform transition text-c-on-bg/50 group-hover:-translate-x-1
						not-touch:group-hover:text-c-primary"
					/>
					<p class="transition text-c-on-bg/50 not-touch:group-hover:text-c-primary">
						{$LL.Blog.BackToBlogButton()}
					</p>
				</div>
			</NoBgButton>
		</div>
		<div class="w-full px-5">
			<ScBar noGuide noBlog noGithub noProductHunt />
		</div>
		<div class="w-full px-5 mt-5">
			<div class="w-full h-2px bg-c-on-bg/5 rounded-full px-5" />
		</div>
		<nav class="w-full flex flex-col max-h-full overflow-auto pt-5 pb-16 px-3">
			<ul class="w-full flex flex-col">
				{#each toc as tocItem}
					<ToCItem item={tocItem} {activeId} />
				{/each}
			</ul>
		</nav>
	</div>
</div>
