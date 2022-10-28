<script lang="ts">
	import { page } from '$app/stores';
	import ToC from '$components/blog/ToC.svelte';
	import Button from '$components/buttons/Button.svelte';
	import LinkButton from '$components/buttons/LinkButton.svelte';
	import IconBack from '$components/icons/IconBack.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import SocialBar from '$components/SocialBar.svelte';
	import '$css/blog.css';
	import { canonicalUrl } from '$ts/constants/main';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	const content = data.content;
	const toc = data.toc;
	const frontmatter = data.frontmatter;
	const { title, description, reading_time, author, author_url } = frontmatter;
	const formattedDate = new Date(frontmatter.date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
</script>

<MetaTag
	title="{title} | Blog"
	{description}
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div
	class="w-full flex-1 flex flex-col transition relative items-center 
	px-5 md:px-12 lg:px-0 pt-5 md:pt-12 pb-16"
>
	<div class="w-full flex flex-row justify-between items-start">
		<ToC {toc} />
		<div class="flex-1 flex flex-col justify-start items-center lg:px-16">
			<div class="max-w-2.5xl flex flex-col items-center mb-8 md:px-5">
				<h1 class="font-extrabold text-center text-4xl leading-tight px-3">{title}</h1>
				<p class="mt-3 text-c-on-bg/40 font-medium text-center leading-relaxed">
					{formattedDate} • {reading_time} min read
				</p>
				{#if author}
					<p class="mt-0.75 text-c-on-bg/40 font-medium text-center leading-relaxed">
						{#if author_url}
							<a class="blog-link" href={author_url} target="_blank">{author}</a>
						{:else}
							<span>{author}</span>
						{/if}
					</p>
				{/if}
			</div>
			<div class="blog max-w-2.5xl w-full flex flex-col justify-start items-start relative">
				{@html content}
			</div>
		</div>
		<ToC {toc} class="hidden 1.5xl:flex opacity-0 pointer-events-none" />
	</div>
	<LinkButton href="/blog" class="mt-5" target={null} prefetch={true}>
		<div class="flex items-center justify-center gap-2.5 px-2 py-1">
			<IconBack
				class="w-6 h-6 transform transition text-c-on-bg/50 group-hover:-translate-x-1
				{!$isTouchscreen ? 'group-hover:text-c-primary' : ''}"
			/>
			<p class="font-bold">Back to Blog</p>
		</div>
	</LinkButton>
	<div class="w-full flex justify-center pt-6 pb-10 md:px-8 lg:px-12">
		<div class="w-full max-w-7xl bg-c-on-bg/5 rounded-full h-2px" />
	</div>
	<div class="w-full max-w-7xl flex flex-col items-center gap-10">
		<div
			class="max-w-full flex flex-col items-center bg-c-bg relative z-0 overflow-hidden
			ring-2 ring-c-bg-secondary rounded-xl shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]"
		>
			<p class="font-bold text-center text-base bg-c-bg-secondary w-full px-5 py-2.5">Join Us</p>
			<div class="flex flex-wrap justify-center items-center p-2">
				<SocialBar size="md" color="normal" />
			</div>
		</div>
		<div class="w-full flex flex-col items-center gap-5">
			<p class="font-bold text-xl text-center max-w-md px-5 leading-normal">
				Start generating beautiful images!
			</p>
			<Button href="/">Start Generating</Button>
		</div>
	</div>
</div>
