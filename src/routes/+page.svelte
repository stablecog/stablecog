<script lang="ts">
	import MetaTag from '$components/MetaTag.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { canonicalUrl } from '$ts/constants/main.js';
	import { onMount } from 'svelte';
	import Button from '$components/buttons/Button.svelte';
	import { themeApp } from '$ts/stores/theme.js';
	import Navbar from '$components/navigation/Navbar.svelte';

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
	<section
		class="w-full h-[calc(100svh-env(safe-area-inset-bottom)-2rem)] flex flex-col md:flex-row items-center justify-between"
	>
		<div
			class="px-6 pt-6 pb-8 md:pt-0 md:pb-0 md:pl-[max(calc((100%-1280px)/2+4rem),4rem)]
			md:pr-0 lg:pr-12 flex flex-col items-center md:items-start order-2 md:order-1"
		>
			<h1
				class="font-bold text-3xl md:text-4xl flex-1 leading-snug md:leading-snug max-w-[19rem] md:max-w-[22rem] text-center md:text-left"
			>
				Create amazing art in seconds with AI.
			</h1>
			<Button class="mt-5 px-18 py-4" noPadding>Get Started</Button>
		</div>
		<div
			class="flex-1 min-h-0 pl-12 md:pl-0 w-full md:h-full flex flex-col justify-end items-end relative order-1 md:order-2"
		>
			<div class="flex-1 flex-col w-full md:h-full overflow-hidden relative">
				<div class="w-full h-full">
					<img
						style="
							-webkit-mask-image: url(/landing/hero-mask.svg);
							mask-image: url(/landing/hero-mask.svg);
							-webkit-mask-repeat: no-repeat;
							mask-repeat: no-repeat;
							mask-size: cover;
							-webkit-mask-size: cover;
							mask-position: left bottom;
							-webkit-mask-position: left bottom;
						"
						class="w-full h-full object-cover object-[25%_100%] md:object-[40%_100%] lg:object-left-bottom"
						src="/landing/hero.jpeg"
						alt="Hero"
						width="5120"
						height="5120"
					/>
				</div>
				<div
					style="
						-webkit-mask-image: url(/landing/hero-mask.svg);
						mask-image: url(/landing/hero-mask.svg);
						-webkit-mask-repeat: no-repeat;
						mask-repeat: no-repeat;
						mask-size: cover;
						-webkit-mask-size: cover;
						mask-position: left bottom;
						-webkit-mask-position: left bottom;
					"
					class="absolute w-full h-full right-0 top-0 bg-gradient-to-b from-c-barrier/75 via-c-barrier/0 via-[10rem] to-c-barrier/0"
				/>
				<div class="w-full h-full absolute right-0 top-0">
					<img
						class="w-full h-full object-cover object-left-bottom"
						src="/landing/hero-outline.svg"
						alt="Hero Outline"
						width="3072"
						height="3072"
					/>
				</div>
			</div>
		</div>
	</section>
	<section class="w-full h-screen" />
</div>
