<script lang="ts">
	import ImageWithOutlineAndLoaded from '$components/ImageWithOutlineAndLoaded.svelte';
	import ImageWithOutlineAndPlaceholder from '$components/ImageWithOutlineAndPlaceholder.svelte';
	import Button from '$components/buttons/Button.svelte';
	import LL from '$i18n/i18n-svelte';
	import { themeApp } from '$ts/stores/theme';
	import { isSignedIn } from '$ts/stores/user/isSignedIn';
</script>

<section
	id="hero"
	class="w-full h-[100svh] pb-[calc(env(safe-area-inset-bottom)+2rem)] min-h-[25rem] md:min-h-[40rem] flex flex-col md:flex-row items-center justify-between"
>
	<div
		class="px-6 pt-6 pb-8 md:py-12 md:pl-[max(calc((100%-1280px)/2+4rem),4rem)]
			md:pr-6 xl:pr-16 flex flex-col items-center md:items-start order-2 md:order-1"
	>
		<h1
			class="font-semibold text-3xl md:text-4xl lg:text-5xl flex-1 leading-tight md:leading-tight lg:leading-tight
				max-w-[19rem] md:max-w-[22rem] lg:max-w-[30rem] text-center md:text-left"
		>
			{$LL.Landing.Hero.Title()}
		</h1>
		<Button
			href={$isSignedIn ? '/generate' : '/generate?smo=true'}
			class="mt-5 w-full max-w-[15rem] px-6 md:px-8 py-4"
			noPadding
		>
			{$LL.Landing.GetStartedButton()}
		</Button>
	</div>
	<div
		class="flex-1 min-h-0 pl-12 md:pl-0 w-full md:h-full flex flex-col justify-end items-end relative order-1 md:order-2"
	>
		<div class="flex-1 flex-col w-full md:h-full overflow-hidden relative">
			<ImageWithOutlineAndPlaceholder
				style="
					-webkit-mask-image: url(/landing/hero/hero-mask.svg);
					mask-image: url(/landing/hero/hero-mask.svg);
					-webkit-mask-repeat: no-repeat;
					mask-repeat: no-repeat;
					mask-size: cover;
					-webkit-mask-size: cover;
					mask-position: left bottom;
					-webkit-mask-position: left bottom;
				"
				class="w-full h-full object-cover object-[25%_100%] md:object-[40%_100%] lg:object-left-bottom transform
					[transition:opacity_0.2s_ease-out,transform_0.4s_ease-out]"
				classPlaceholder="w-full h-full object-cover object-[25%_100%] md:object-[40%_100%] lg:object-left-bottom transform
				[transition:opacity_0.2s_ease-out,transform_0.4s_ease-out] filter blur-2xl"
				srcset="
					/landing/hero/hero-v2-512.webp 512w,
					/landing/hero/hero-v2-768.webp 768w,
					/landing/hero/hero-v2-1024.webp 1024w,
					/landing/hero/hero-v2-1440.webp 1440w,
					/landing/hero/hero-v2-1920.webp 1920w,
				"
				sizes="(min-width: 768px) 50vw, 100vw"
				src="/landing/hero/hero-v2-1920.webp"
				srcPlaceholder="data:image/png;base64,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"
				alt="Hero"
				width="1920"
				height="1920"
				classOutline="w-full h-full absolute right-0 top-0 object-cover object-left-bottom transform
					[transition:opacity_0.2s_ease-out,transform_0.4s_ease-out]"
				srcOutline={$themeApp === 'light'
					? '/landing/hero/hero-outline-light.svg'
					: '/landing/hero/hero-outline-dark.svg'}
				altOutline="Hero Outline"
			/>
		</div>
	</div>
</section>
