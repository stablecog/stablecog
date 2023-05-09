<script lang="ts">
	import MetaTag from '$components/MetaTag.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { canonicalUrl } from '$ts/constants/main.js';
	import { onMount } from 'svelte';
	import { themeApp } from '$ts/stores/theme.js';
	import Navbar from '$components/navigation/Navbar.svelte';
	import Footer from '$components/navigation/Footer.svelte';
	import DescribeAnything from '$components/landing/DescribeAnything.svelte';
	import InitImage from '$components/landing/InitImage.svelte';
	import StartCreating from '$components/landing/StartCreating.svelte';
	import Hero from '$components/landing/Hero.svelte';

	export let data;

	let notAtTheVeryTop = false;
	const notAtTheVeryTopThreshold = 2;
	let oldScrollY = 0;
	const minScrollThreshold = 40;
	let scrollDirection: 'up' | 'down' = 'down';

	const setNavbarState = () => {
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
	};

	const confirmOtherEmailHash =
		'#message=Confirmation+link+accepted.+Please+proceed+to+confirm+link+sent+to+the+other+email';

	onMount(async () => {
		if ($page.url.hash === confirmOtherEmailHash) {
			await goto('/account/change-email?confirm_other_email=true');
		}
	});
</script>

<svelte:window on:scroll={setNavbarState} />

<MetaTag
	title="Stablecog"
	description="Free, easy to use, multilingual and open-source AI image generator using Stable Diffusion."
	imageUrl="{canonicalUrl}/previews/home.png"
	canonical={canonicalUrl}
/>

<div
	style="
		background-image: url({$themeApp === 'light'
		? '/illustrations/grid-on-light.svg'
		: '/illustrations/grid-on-dark.svg'}); background-size: 24px;
	"
	class="w-full flex flex-col items-center flex-1 justify-center bg-c-bg text-c-on-bg {$themeApp ===
	'light'
		? 'theme-light'
		: 'theme-dark'}"
>
	<Navbar {notAtTheVeryTop} {scrollDirection} />
	<Hero />
	<DescribeAnything />
	<InitImage />
	<StartCreating />
	<Footer />
</div>
