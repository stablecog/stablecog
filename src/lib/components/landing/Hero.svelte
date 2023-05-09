<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import { themeApp } from '$ts/stores/theme';
</script>

<section
	class="w-full h-[100svh] pb-[calc(env(safe-area-inset-bottom)+2rem)] min-h-[25rem] md:min-h-[30rem] flex flex-col md:flex-row items-center justify-between"
>
	<div
		class="px-6 pt-4 pb-8 md:py-12 md:pl-[max(calc((100%-1280px)/2+4rem),4rem)]
			md:pr-6 xl:pr-16 flex flex-col items-center md:items-start order-2 md:order-1"
	>
		<h1
			class="font-bold text-3xl md:text-4xl lg:text-5xl flex-1 leading-tight md:leading-tight lg:leading-tight
				max-w-[19rem] md:max-w-[22rem] lg:max-w-[30rem] text-center md:text-left"
		>
			Create amazing art in seconds with AI.
		</h1>
		<Button href="/generate" class="mt-5 px-18 py-4" noPadding>Get Started</Button>
	</div>
	<div
		class="flex-1 min-h-0 pl-12 md:pl-0 w-full md:h-full flex flex-col justify-end items-end relative order-1 md:order-2"
	>
		<div class="flex-1 flex-col w-full md:h-full overflow-hidden relative">
			<div class="w-full h-full">
				<img
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
					class="w-full h-full object-cover object-[25%_100%] md:object-[40%_100%] lg:object-left-bottom"
					srcset="
            /landing/hero/hero-512.webp 512w,
            /landing/hero/hero-768.webp 768w,
            /landing/hero/hero-1024.webp 1024w,
            /landing/hero/hero-1440.webp 1440w,
            /landing/hero/hero-1920.webp 1920w,
          "
					sizes="(min-width: 768px) 50vw, 100vw"
					src="/landing/hero/hero-1920.webp"
					alt="Hero"
					width="1920"
					height="1920"
				/>
			</div>
			<div
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
				class="absolute w-full h-full right-0 top-0 bg-gradient-to-b from-c-barrier/75 via-c-barrier/0 via-[10rem] to-c-barrier/0"
			/>
			<img
				class="w-full h-full absolute right-0 top-0 object-cover object-left-bottom"
				src={$themeApp === 'light'
					? '/landing/hero/hero-outline-light.svg'
					: '/landing/hero/hero-outline-dark.svg'}
				alt="Hero Outline"
				width="1920"
				height="1920"
			/>
		</div>
	</div>
</section>
