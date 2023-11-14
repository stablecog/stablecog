<script lang="ts">
	import '$css/blog.css';
	import { page } from '$app/stores';
	import LayoutWrapper from '$components/LayoutWrapper.svelte';
	import Footer from '$components/navigation/Footer.svelte';
	import Navbar from '$components/navigation/navbar/Navbar.svelte';
	import { rawRoutes } from '$ts/constants/routes';
	import { navbarHeight } from '$ts/stores/navbarHeight';
	import { navbarStickyType } from '$ts/stores/navbar';
	import { onMount } from 'svelte';

	export let data;
</script>

<LayoutWrapper isAppRoute={false}>
	<Navbar dirTree={data.dirTree} />
	{#if !rawRoutes.includes($page.url.pathname) && ($navbarStickyType === undefined || $navbarStickyType !== 'relative')}
		<div style={$navbarHeight ? `height: ${$navbarHeight}px` : ``} class="h-16 md:h-18 w-full" />
	{/if}
	<main class="w-full flex-1 flex flex-col relative break-words">
		<slot />
	</main>
	<Footer />
</LayoutWrapper>
