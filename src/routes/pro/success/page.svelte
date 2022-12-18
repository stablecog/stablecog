<script>
	import Button from '$components/buttons/Button.svelte';
	import IconConfetti from '$components/icons/IconConfetti.svelte';
	import LL from '$i18n/i18n-svelte';
	import { theme } from '$ts/stores/theme';
	import { onMount } from 'svelte';
	import { portal } from 'svelte-portal';
	// @ts-ignore
	import { Confetti } from 'svelte-confetti';

	$: confettiColorArray =
		$theme === 'light'
			? ['rgb(96,42,204)', 'rgb(210,108,34)', 'rgb(12,150,0)']
			: ['rgb(174,133,235)', 'rgb(255,174,116)', 'rgb(129,209,116)'];

	let mounted = false;
	onMount(() => {
		mounted = true;
	});
</script>

<div class="w-full flex-1 flex flex-col py-8 px-5">
	<div class="w-full flex flex-col items-center justify-start my-auto">
		<IconConfetti class="w-32 h-32 text-c-primary" />
		<h1 class="text-center font-bold text-4xl mt-8">Thanks for becoming a pro!</h1>
		<p class="max-w-2xl mt-4 text-left leading-relaxed text-c-on-bg/75">
			You now have access to everything Stablecog has to offer. If you have any questions, feel free
			to reach out to us on <a
				class="text-c-primary font-bold hover:underline"
				href="/discord"
				target="_blank">Discord</a
			>.
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
			amount="300"
			fallDistance="100vh"
		/>
	</div>
{/if}
