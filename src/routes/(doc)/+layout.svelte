<script lang="ts">
	import '$css/blog.css';
	import { page } from '$app/stores';
	import LayoutWrapper from '$components/wrappers/LayoutWrapper.svelte';
	import Footer from '$components/navigation/Footer.svelte';
	import Navbar from '$components/navigation/navbar/Navbar.svelte';
	import { rawRoutes } from '$ts/constants/routes';
	import { navbarHeight } from '$ts/stores/navbarHeight';
	import { navbarStickyType } from '$ts/stores/navbar';

	export let data;
</script>

<LayoutWrapper isAppRoute={false}>
	<Navbar dirTree={data.dirTree} />
	{#if !rawRoutes.includes($page.url.pathname) && ($navbarStickyType === undefined || $navbarStickyType !== 'relative')}
		<div style={$navbarHeight ? `height: ${$navbarHeight}px` : ``} class="h-16 w-full md:h-18" />
	{/if}
	<main class="relative flex w-full flex-1 flex-col break-words">
		<slot />
	</main>
	<Footer />
</LayoutWrapper>
