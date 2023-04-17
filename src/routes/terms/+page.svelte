<script lang="ts">
	import type { PageServerData } from './$types';
	import '$css/md-doc.css';
	import MetaTag from '$components/MetaTag.svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { page } from '$app/stores';

	export let data: PageServerData;
</script>

<MetaTag
	title="Terms of Service | Synthica"
	description="Check out the terms of service for our free, multilingual and open-source AI image generator."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex justify-center items-start pt-4 pb-7 md:pt-7 md:pb-12 px-5 md:px-10">
	<div class="w-full max-w-3xl md-doc">
		{@html data.content}
	</div>
</div>
