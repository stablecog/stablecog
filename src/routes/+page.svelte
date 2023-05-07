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

	const confirmOtherEmailHash =
		'#message=Confirmation+link+accepted.+Please+proceed+to+confirm+link+sent+to+the+other+email';

	onMount(async () => {
		if ($page.url.hash === confirmOtherEmailHash) {
			await goto('/account/change-email?confirm_other_email=true');
		}
	});
</script>

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
	class="w-full flex flex-col items-center flex-1 justify-center"
>
	<Navbar />
	<section
		class="w-full h-[calc(100svh-2rem)] flex flex-col md:flex-row items-center justify-between"
	>
		<div
			class="px-6 pt-6 pb-4 md:pt-0 md:pb-0 md:pl-[max(calc((100%-1280px)/2+4rem),4rem)]
			md:pr-0 lg:pr-12 flex flex-col items-center md:items-start order-2 md:order-1"
		>
			<h1 class="font-bold text-4xl flex-1 leading-snug max-w-[22rem] text-center md:text-left">
				Create amazing art in seconds with AI.
			</h1>
			<Button class="mt-4 px-18 py-4" noPadding>Get Started</Button>
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
						class="w-full h-full object-cover object-left-bottom md:object-center lg:object-left-bottom"
						src="/landing/hero.jpeg"
						alt="Hero"
						width="5120"
						height="5120"
					/>
				</div>
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
