<script lang="ts">
	import SidebarItem from '$routes/guide/SidebarItem.svelte';
	import type { TSidebarItem } from '$routes/guide/types';
	import { navbarHeight } from '$ts/stores/navbarHeight';
	import { windowHeight } from '$ts/stores/window';

	export let sidebar: TSidebarItem;
	export { classes as class };
	export { styles as style };
	export let noBottomPadding = false;
	let classes = 'w-full';
	let styles: string;
	$: _styles = `${
		$windowHeight && $navbarHeight
			? `max-height: calc(${$windowHeight - $navbarHeight}px); top: calc(${$navbarHeight}px);`
			: 'max-height: calc(100vh-5rem); max-height: calc(100svh-5rem);'
	}`;
</script>

<nav
	style={styles !== undefined ? styles : _styles}
	class="{classes} sticky items-stretch overflow-hidden"
>
	<div class="flex-1 flex h-full overflow-hidden">
		<div
			class="w-full pt-4 {noBottomPadding ? '' : 'pb-48'} px-2 md:px-3 flex flex-col overflow-auto"
		>
			<SidebarItem sidebarItem={sidebar} />
		</div>
	</div>
	<div class="h-full flex py-4 flex-col">
		<div class="w-2px h-full rounded-full bg-c-bg-secondary" />
	</div>
</nav>
