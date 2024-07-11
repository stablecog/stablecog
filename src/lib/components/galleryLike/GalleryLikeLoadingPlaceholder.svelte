<script>
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import LL from '$i18n/i18n-svelte';

	export let canShowLoader;
</script>

<div
	class="flex w-full flex-1 flex-col items-center justify-center px-4 py-6 text-center text-c-on-bg/60"
>
	{#if canShowLoader}
		<IconAnimatedSpinner class="h-12 w-12" />
		<p class="mt-2 opacity-0">{$LL.Gallery.SearchingTitle()}</p>
		<div class="h-[2vh]" />
	{/if}
</div>
