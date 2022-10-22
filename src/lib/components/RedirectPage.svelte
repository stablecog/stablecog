<script lang="ts">
	import { page } from '$app/stores';
	import IconPulsing from '$components/icons/IconPulsing.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { onMount } from 'svelte';

	export let url: string;
	export let redirectingText: string;
	export let title: string;
	export let description: string;

	onMount(() => {
		window.location.assign(url);
	});
</script>

<MetaTag
	{title}
	{description}
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex-1 flex justify-center px-8 md:px-24 pt-8 pb-[calc(7vh+2rem)]">
	<div class="w-full flex flex-col items-center justify-center max-w-lg">
		<div class="w-full flex flex-col items-center justify-start py-4">
			<IconPulsing />
			<p class="w-full text-c-on-bg/40 text-center mt-1.5">{redirectingText}</p>
		</div>
	</div>
</div>
