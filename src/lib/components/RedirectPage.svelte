<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import IconPulsing from '$components/icons/IconPulsing.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import { onMount } from 'svelte';

	export let url: string;
	export let urlIsInternal = false;
	export let redirectingText: string;
	export let title: string;
	export let description: string;
	export let image_url = `${canonicalUrl}/previews${
		$page.url.pathname !== '/' ? $page.url.pathname : 'home'
	}-${previewImageVersion}.png`;

	onMount(async () => {
		if (urlIsInternal) {
			await goto(url);
		} else {
			window.location.href = url;
		}
	});
</script>

<MetaTag {title} {description} {image_url} />

<div class="flex w-full flex-1 justify-center px-8 pb-[calc(7vh+2rem)] pt-8 md:px-24">
	<div class="flex w-full max-w-lg flex-col items-center justify-center">
		<div class="flex w-full flex-col items-center justify-start py-4">
			<IconPulsing class="-m-3 h-26 w-26" />
			<p class="mt-1.5 w-full text-center text-lg font-medium text-c-on-bg/75">{redirectingText}</p>
		</div>
	</div>
</div>
