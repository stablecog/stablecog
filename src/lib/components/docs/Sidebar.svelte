<script lang="ts">
	import SidebarItem from '$components/docs/SidebarItem.svelte';
	import type { TSidebarItem } from '$docroutes/guide/types';
	import { navbarEstimatedHeight } from '$ts/constants/main';
	import { navbarHeight } from '$ts/stores/navbarHeight';
	import { windowHeight } from '$ts/stores/window';

	export let sidebar: TSidebarItem;
	export { classes as class };
	export { styles as style };
	export let noBottomPadding = false;
	export let noDivider = false;
	let classes = 'w-full';
	let styles: string | undefined = undefined;
	$: _styles = `${
		$windowHeight && $navbarHeight
			? `max-height: calc(${$windowHeight - $navbarHeight}px); top: calc(${$navbarHeight}px);`
			: `max-height: calc(100vh - ${navbarEstimatedHeight}px); max-height: calc(100svh - ${navbarEstimatedHeight}px); top: ${navbarEstimatedHeight}px;`
	}`;
</script>

<nav
	style={styles !== undefined ? styles : _styles}
	class="{classes} flex items-stretch justify-start overflow-hidden md:sticky md:top-0"
>
	<div class="flex h-full min-w-0 flex-1 overflow-hidden">
		<div
			class="w-full pt-1 md:pt-4 {noBottomPadding
				? ''
				: 'pb-20 md:pb-36'} flex flex-col overflow-auto"
		>
			<SidebarItem sidebarItem={sidebar} />
		</div>
	</div>
	{#if !noDivider}
		<div class="flex h-full flex-col py-4">
			<div class="h-full w-2px rounded-full bg-c-bg-secondary" />
		</div>
	{/if}
</nav>
