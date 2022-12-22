<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/MetaTag.svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { socialUrls } from '$ts/constants/social';
</script>

<MetaTag
	title="About | Stablecog"
	description="What is Stablecog? Who created it? How can you contact us?"
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex-1 flex flex-col justify-center items-center py-8 px-5">
	<div class="w-full flex flex-col items-start justify-center my-auto max-w-3xl">
		<h1 class="text-3xl font-bold">What is Stablecog?</h1>
		<p class="text-c-on-bg/60 mt-2.5 leading-relaxed">
			Stablecog is a free, multi-lingual and open-source AI image generator that uses <a
				target="_blank"
				href="https://stability.ai/blog/stable-diffusion-public-release"
				class="hover:underline text-c-primary font-semibold">Stable Diffusion</a
			>
			to create images and
			<a
				target="_blank"
				href="https://ai.facebook.com/research/no-language-left-behind"
				class="hover:underline text-c-primary font-semibold">NLLB</a
			> to translate prompts.
		</p>
		<h1 class="text-3xl font-bold mt-10">When was it released?</h1>
		<p class="text-c-on-bg/60 mt-2.5 leading-relaxed">
			Although some beta testing was done beforehand and everything has been <a
				target="_blank"
				href={socialUrls.github}
				class="hover:underline text-c-primary font-semibold">open-source</a
			>
			since the start, it was
			<a
				target="_blank"
				href="https://twitter.com/ngyekta/status/1580297548816056320?s=20&t=_ECO2mQZuwfzl8oG4tcizg"
				class="hover:underline text-c-primary font-semibold">officially announced</a
			> on October 12th, 2022.
		</p>
		<h1 class="text-3xl font-bold mt-10">Who made it?</h1>
		<p class="text-c-on-bg/60 mt-2.5 leading-relaxed">
			I did :) I'm <a
				target="_blank"
				href="https://twitter.com/ngyekta"
				class="hover:underline text-c-primary font-semibold">Yekta</a
			>, a 28 year old software developer from Turkey. I design & build software, usually
			open-source. Recently, a friend of mine,
			<a
				target="_blank"
				href="https://twitter.com/therealbbedward"
				class="hover:underline text-c-primary font-semibold">Brandon</a
			>, also joined the team and will be helping with the backend.
		</p>
		<h1 class="text-3xl font-bold mt-10">How can I contact you?</h1>
		<p class="text-c-on-bg/60 mt-2.5 leading-relaxed">
			You can contact us on <a
				target="_blank"
				href="/twitter"
				class="hover:underline text-c-primary font-semibold">Twitter</a
			>, join our
			<a target="_blank" href="/discord" class="hover:underline text-c-primary font-semibold"
				>Discord</a
			>, or send an email to
			<a
				target="_blank"
				href="mailto:hello@stablecog.com"
				class="hover:underline text-c-primary font-semibold">hello@stablecog.com</a
			>.
		</p>
	</div>
</div>
