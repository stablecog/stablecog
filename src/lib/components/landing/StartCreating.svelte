<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import { themeApp } from '$ts/stores/theme';
</script>

<section class="w-full flex justify-center pt-4 pb-16">
	<div class="w-full max-w-7xl flex flex-col items-center px-3 md:px-8">
		<div class="flex flex-col items-center px-3 md:px-6">
			<h2
				class="max-w-[19rem] md:max-w-[22rem] lg:max-w-[32rem] font-bold text-3xl md:text-4xl lg:text-5xl
        flex-1 leading-tight lg:leading-tight text-center"
			>
				Start creating now!
			</h2>
			<p
				class="max-w-[22rem] lg:max-w-[32rem] leading-relaxed md:text-lg lg:text-xl mt-2 text-center text-c-on-bg/75"
			>
				It’s free to try :) Give it a go, we think you’ll like it. Thousands of our users do.
			</p>
			<Button class="mt-6 px-18 py-4" noPadding>Get Started</Button>
		</div>
		<img
			class="w-full h-auto mt-8 md:mt-10 rounded-lg md:rounded-xl lg:rounded-2xl ring-2 ring-c-bg-secondary
        shadow-2xl shadow-c-shadow/[var(--o-shadow-strong)]"
			src={$themeApp === 'light' ? '/landing/app-light-1920.webp' : '/landing/app-dark-1920.webp'}
			srcset="
        {$themeApp === 'light'
				? `/landing/app/app-light-512.webp 512w,
          /landing/app/app-light-768.webp 768w,
          /landing/app/app-light-1024.webp 1024w,
          /landing/app/app-light-1440.webp 1440w,
          /landing/app/app-light-1920.webp 1920w`
				: `/landing/app/app-dark-512.webp 512w,
          /landing/app/app-dark-768.webp 768w,
          /landing/app/app-dark-1024.webp 1024w,
          /landing/app/app-dark-1440.webp 1440w,
          /landing/app/app-dark-1920.webp 1920w`}
      "
			sizes="(min-width: 1280px) 1280px, 100vw"
			width="1920"
			height="1200"
			alt="App"
		/>
	</div>
</section>
