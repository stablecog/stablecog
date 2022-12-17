<script>
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import IconConfetti from '$components/icons/IconConfetti.svelte';
	import LL from '$i18n/i18n-svelte';
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
