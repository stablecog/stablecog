<script>
	import Button from '$components/buttons/Button.svelte';
</script>

<div class="w-full flex-1 flex flex-col py-8 px-5">
	<div class="w-full flex flex-col items-center justify-start my-auto">
		<p class="text-5xl font-bold text-c-primary">:(</p>
		<h1 class="text-center font-bold text-4xl mt-8">Something went wrong</h1>
		<p class="max-w-2xl mt-4 text-left leading-relaxed text-c-on-bg/75">
			Don't worry, you can always try again.
		</p>
		<Button href="/pro" withSpinner class=" mt-8">Try Again</Button>
	</div>
</div>
