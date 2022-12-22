<script>
	import Button from '$components/buttons/Button.svelte';
	import IconConfetti from '$components/icons/IconConfetti.svelte';
	import LL from '$i18n/i18n-svelte';
	import { theme } from '$ts/stores/theme';
	import { onMount } from 'svelte';
	import { portal } from 'svelte-portal';
	import { Confetti } from 'svelte-confetti';
	import MetaTag from '$components/MetaTag.svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { page } from '$app/stores';

	$: confettiColorArray =
		$theme === 'light'
			? ['rgb(96,42,204)', 'rgb(210,108,34)', 'rgb(12,150,0)']
			: ['rgb(174,133,235)', 'rgb(255,174,116)', 'rgb(129,209,116)'];

	let mounted = false;
	onMount(() => {
		mounted = true;
	});
</script>

<MetaTag
	title="Succeeded | Stablecog"
	description="Become a pro member on Stablecog to unlock all of its features."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex-1 flex flex-col py-8 px-5">
	<div class="w-full flex flex-col items-center justify-start my-auto">
		<IconConfetti class="w-32 h-32 text-c-primary" />
		<h1 class="text-center font-bold text-4xl mt-8">{$LL.Pro.Success.PageTitle()}</h1>
		<p class="max-w-2xl mt-4 text-center leading-relaxed text-c-on-bg/75">
			{@html $LL.Pro.Success.PageParagraph({ platform: '__discord__' }).replace(
				'__discord__',
				`<a class="text-c-primary font-bold hover:underline" href="/discord" target="_blank">Discord</a>`
			)}
		</p>
		<Button href="/" withSpinner class=" mt-8">{$LL.Shared.StartGeneratingButton()}</Button>
	</div>
</div>

{#if mounted}
	<div
		use:portal={'body'}
		class="fixed -bottom-16 left-0 h-[calc(100vh+4rem)] w-screen flex justify-center items-end overflow-hidden pointer-events-none"
	>
		<Confetti
			y={[0, 10]}
			x={[-4, 4]}
			colorArray={confettiColorArray}
			duration={6000}
			delay={[0, 1000]}
			amount="400"
			fallDistance="100vh"
		/>
	</div>
{/if}
