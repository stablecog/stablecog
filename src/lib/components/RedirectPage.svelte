<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import IconPulsing from '$components/icons/IconPulsing.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import { onMount } from 'svelte';

	export let url: string;
	export let redirectingText: string;
	export let title: string;
	export let description: string;
	export let image_url = `${canonicalUrl}/previews${
		$page.url.pathname !== '/' ? $page.url.pathname : 'home'
	}-${previewImageVersion}.png`;

	onMount(async () => {
		await goto(url);
	});
</script>

<MetaTag {title} {description} {image_url} />

<div class="w-full flex-1 flex justify-center px-8 md:px-24 pt-8 pb-[calc(7vh+2rem)]">
	<div class="w-full flex flex-col items-center justify-center max-w-lg">
		<div class="w-full flex flex-col items-center justify-start py-4">
			<IconPulsing class="w-26 h-26 -m-3" />
			<p class="w-full text-c-on-bg/75 font-medium text-lg text-center mt-1.5">{redirectingText}</p>
		</div>
	</div>
</div>
