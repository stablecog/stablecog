<script lang="ts">
	import '$css/blog.css';
	import { page } from '$app/stores';
	import LayoutWrapper from '$components/LayoutWrapper.svelte';
	import Footer from '$components/navigation/Footer.svelte';
	import Navbar from '$components/navigation/Navbar.svelte';
	import { rawRoutes } from '$ts/constants/routes';
	import { navbarHeight } from '$ts/stores/navbarHeight';
	import { navbarStickyType } from '$ts/stores/navbar';
	import { onMount } from 'svelte';

	export let data;

	let notAtTheVeryTop = false;
	const notAtTheVeryTopThreshold = 5;
	let oldScrollY = 0;
	const minScrollThreshold = 40;
	let scrollDirection: 'up' | 'down' = 'down';

	function setNavbarState() {
		const scrollY = window.scrollY;
		const _notAtTheVeryTop = scrollY > notAtTheVeryTopThreshold;
		if (_notAtTheVeryTop !== notAtTheVeryTop) {
			notAtTheVeryTop = _notAtTheVeryTop;
		}
		if (Math.abs(window.scrollY - oldScrollY) < minScrollThreshold) return;
		if (window.scrollY > oldScrollY) {
			scrollDirection = 'down';
		} else {
			scrollDirection = 'up';
		}
		oldScrollY = scrollY;
	}

	onMount(() => {
		setNavbarState();
	});
</script>

<svelte:window on:scroll|passive={setNavbarState} />

<LayoutWrapper isAppRoute={false}>
	<Navbar {notAtTheVeryTop} {scrollDirection} dirTree={data.dirTree} />
	{#if !rawRoutes.includes($page.url.pathname) && ($navbarStickyType === undefined || $navbarStickyType !== 'relative')}
		<div style={$navbarHeight ? `height: ${$navbarHeight}px` : ``} class="h-16 md:h-18 w-full" />
	{/if}
	<main class="w-full flex-1 flex flex-col relative break-words">
		<slot />
	</main>
	<Footer />
</LayoutWrapper>
