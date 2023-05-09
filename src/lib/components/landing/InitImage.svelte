<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import { themeApp } from '$ts/stores/theme';
</script>

<section
	class="w-full flex flex-col lg:flex-row justify-center overflow-hidden relative z-0 pt-20 pb-16"
>
	<div class="flex lg:hidden flex-col items-center px-5">
		<h2
			class="font-bold text-3xl md:text-4xl
				lg:text-5xl flex-1 leading-tight lg:leading-tight text-center"
		>
			Or start with an image
		</h2>
		<p
			class="max-w-[24rem] md:max-w-[26rem] lg:max-w-[35rem] leading-relaxed md:text-lg lg:text-xl mt-2 text-center text-c-on-bg/75"
		>
			Give an input image, generate new art based on it.
		</p>
		<Button class="mt-6 px-18 py-4" noPadding>Try It Now</Button>
	</div>
	<div
		class="w-full relative mt-8 max-w-[120rem] gap-4 md:gap-8 lg:gap-0 flex justify-center items-center
    lg:h-[calc(100svh-env(safe-area-inset-bottom)-10rem)] lg:min-h-[40rem]"
	>
		<div class="flex-1 lg:flex-none aspect-[2/3] h-full relative -ml-[15%] lg:ml-0">
			<img
				style="
						-webkit-mask-image: url(/landing/dragon/dragon-mask.svg);
						mask-image: url(/landing/dragon/dragon-mask.svg);
						-webkit-mask-repeat: no-repeat;
						mask-repeat: no-repeat;
						mask-size: cover;
						-webkit-mask-size: cover;
						mask-position: right center;
						-webkit-mask-position: right center;
					"
				class="w-full h-full"
				srcset="
          /landing/dragon/dragon-512.webp 512w,
          /landing/dragon/dragon-768.webp 768w,
          /landing/dragon/dragon-1024.webp 1024w,
          /landing/dragon/dragon-1440.webp 1440w,
          /landing/dragon/dragon-1920.webp 1920w,
        "
				sizes="(min-width: 1024px) 33vw, 50vw"
				alt="Dragon"
				width="1820"
				height="1920"
			/>
			<img
				class="w-full h-full absolute right-0 top-0"
				src={$themeApp === 'light'
					? '/landing/dragon/dragon-outline-light.svg'
					: '/landing/dragon/dragon-outline-dark.svg'}
				alt="Dragon Outline"
				width="1820"
				height="1920"
			/>
		</div>
		<div
			class="absolute bottom-[20%] lg:bottom-0 lg:relative px-6 pt-6 pb-8 lg:pt-12 lg:pb-20 lg:min-w-[35%] xl:min-w-[42%] flex flex-col items-center z-10"
		>
			<div class="hidden lg:flex flex-col items-center">
				<h2
					class="max-w-[19rem] md:max-w-[22rem] lg:max-w-[35rem] font-bold text-3xl md:text-4xl
						lg:text-5xl flex-1 leading-tight lg:leading-tight text-center"
				>
					Or start with an image
				</h2>
				<p
					class="max-w-[22rem] lg:max-w-[35rem] leading-relaxed md:text-lg lg:text-xl mt-2 text-center text-c-on-bg/75"
				>
					Give an input image, generate new art based on it.
				</p>
				<Button class="mt-6 px-18 py-4" noPadding>Try It Now</Button>
			</div>
			<div class="w-full flex relative items-center justify-center lg:mt-20">
				<div
					style="background-image: url({$themeApp === 'light'
						? '/landing/arrow/arrow-middle-light.png'
						: '/landing/arrow/arrow-middle-dark.png'}); background-size: auto 100%; background-repeat: repeat-x;"
					class="w-[calc(100%+20rem)] lg:w-[calc(100%+12rem)] max-w-[calc(100vw-4rem)] h-4 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
				>
					<img
						class="h-full absolute -left-4 top-0"
						alt="Arrow Start"
						src={$themeApp === 'light'
							? '/landing/arrow/arrow-start-light.png'
							: '/landing/arrow/arrow-start-dark.png'}
					/>
					<img
						class="w-14 h-14 absolute -right-9 -bottom-5"
						alt="Arrow End"
						src={$themeApp === 'light'
							? '/landing/arrow/arrow-end-light.png'
							: '/landing/arrow/arrow-end-dark.png'}
					/>
				</div>
				<p
					class="px-4 py-2 md:px-6 md:py-3 font-semibold rounded-xl bg-c-bg-secondary relative
						text-lg md:text-2xl lg:text-3xl ring-2 ring-c-bg-tertiary shadow-xl shadow-c-shadow/[var(--o-shadow-stronger)]"
				>
					robot alien
				</p>
			</div>
		</div>
		<div class="flex-1 lg:flex-none aspect-[2/3] h-full relative -mr-[15%] lg:mr-0">
			<img
				style="
						-webkit-mask-image: url(/landing/dragon-alien/dragon-alien-mask.svg);
						mask-image: url(/landing/dragon-alien/dragon-alien-mask.svg);
						-webkit-mask-repeat: no-repeat;
						mask-repeat: no-repeat;
						mask-size: cover;
						-webkit-mask-size: cover;
						mask-position: right center;
						-webkit-mask-position: right center;
					"
				class="w-full h-full"
				srcset="
          /landing/dragon-alien/dragon-alien-512.webp 512w,
          /landing/dragon-alien/dragon-alien-768.webp 768w,
          /landing/dragon-alien/dragon-alien-1024.webp 1024w,
          /landing/dragon-alien/dragon-alien-1440.webp 1440w,
          /landing/dragon-alien/dragon-alien-1920.webp 1920w,
        "
				sizes="(min-width: 1024px) 33vw, 50vw"
				alt="Dragon Alien"
				width="1820"
				height="1920"
			/>
			<img
				class="w-full h-full absolute right-0 top-0"
				src={$themeApp === 'light'
					? '/landing/dragon-alien/dragon-alien-outline-light.svg'
					: '/landing/dragon-alien/dragon-alien-outline-dark.svg'}
				alt="Dragon Alien Outline"
				width="1820"
				height="1920"
			/>
		</div>
	</div>
</section>
