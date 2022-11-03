<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import { canonicalUrl } from '$ts/constants/main';
</script>

<MetaTag
	title="Admin | Stablecog"
	description="Free & easy to use AI image generator using Stable Diffusion cogs. Use one of the default servers or connect to your own."
	imageUrl="{canonicalUrl}/previews/home.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>
<div class="w-full flex-1 flex justify-center px-5 pb-[calc(3vh)]">
	<div class="my-auto w-full flex flex-col items-center max-w-xl gap-6">
		<h1 class="font-bold text-2xl">Admin</h1>
		<div class="w-full flex flex-row flex-wrap items-center justify-center gap-4">
			<Button href="admin/servers">Servers</Button>
			<Button href="admin/gallery">Gallery</Button>
		</div>
	</div>
</div>
