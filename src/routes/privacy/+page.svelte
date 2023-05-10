<script lang="ts">
	import '$css/md-doc.css';
	import { canonicalUrl } from '$ts/constants/main';
	import MetaTag from '$components/MetaTag.svelte';
	import { page } from '$app/stores';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<MetaTag
	title="Privacy Policy | Stablecog"
	description="Check out the privacy policy for Stablecog. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex justify-center items-start pt-4 pb-7 md:pt-7 md:pb-12 px-5 md:px-10">
	<div class="w-full max-w-3xl md-doc">
		{@html data.content}
	</div>
</div>
