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
	class="{classes} flex justify-start md:sticky md:top-0 items-stretch overflow-hidden"
>
	<div class="flex-1 min-w-0 flex h-full overflow-hidden">
		<div
			class="w-full pt-1 md:pt-4 {noBottomPadding
				? ''
				: 'pb-36'} px-2 md:px-3 flex flex-col overflow-auto"
		>
			<SidebarItem sidebarItem={sidebar} />
		</div>
	</div>
	<div class="h-full flex py-4 flex-col">
		<div class="w-2px h-full rounded-full bg-c-bg-secondary" />
	</div>
</nav>
