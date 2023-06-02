<script lang="ts">
	import '$css/app.css';
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import LL from '$i18n/i18n-svelte';
	import LayoutWrapper from '$components/LayoutWrapper.svelte';
	import Drawer from '$components/navigation/Drawer.svelte';
	import { onMount } from 'svelte';
	import Navbar from '$components/navigation/Navbar.svelte';
	import Footer from '$components/navigation/Footer.svelte';
	import { appRoutes, rawRoutes } from '$ts/constants/routes';
	import { navbarStickyType } from '$ts/stores/stickyNavbar';
	import { navbarHeight } from '$ts/stores/navbarHeight';

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

<LayoutWrapper>
	<Navbar {notAtTheVeryTop} {scrollDirection} />
	{#if !rawRoutes.includes($page.url.pathname) && ($navbarStickyType === undefined || $navbarStickyType !== 'relative')}
		<div style={$navbarHeight ? `height: ${$navbarHeight}px` : ``} class="h-16 md:h-18 w-full" />
	{/if}
	<div
		class="w-full flex-1 flex flex-col items-center justify-center px-5 pt-8 pb-[calc(4vh+1.5rem)]"
	>
		<div class="w-full flex flex-col items-center justify-center max-w-lg gap-8">
			<div class="w-full max-w-xl flex flex-col items-center gap-3">
				<h1 class="text-7xl md:text-8xl font-bold">{$page.status}</h1>
				<p class="text-lg text-c-on-bg/60">
					{$page.status === 404
						? $LL.Error.NotFound()
						: $page.error
						? $page.error.message
						: $LL.Error.SomethingWentWrong()}
				</p>
			</div>
			<Button class="w-56 max-w-full" href="/generate">{$LL.Shared.GoHomeButton()}</Button>
		</div>
	</div>
	<Footer />
	<Drawer />
</LayoutWrapper>
