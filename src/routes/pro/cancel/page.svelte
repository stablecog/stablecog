<script>
	import Button from '$components/buttons/Button.svelte';
	import IconSadFace from '$components/icons/IconSadFace.svelte';
</script>

<div class="w-full flex-1 flex flex-col py-8 px-5">
	<div class="w-full flex flex-col items-center justify-start my-auto">
		<IconSadFace class="w-32 h-32 text-c-primary" />
		<h1 class="text-center font-bold text-4xl mt-8">You've cancelled</h1>
		<p class="max-w-xl mt-4 text-left leading-relaxed text-c-on-bg/75">
			You've cancelled the subscription process. If it was a mistake, you can try again.
		</p>
		<Button href="/pro" withSpinner class=" mt-8">Try Again</Button>
	</div>
</div>
