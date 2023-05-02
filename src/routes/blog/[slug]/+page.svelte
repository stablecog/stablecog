<script lang="ts">
	import { page } from '$app/stores';
	import ToC from '$components/blog/ToC.svelte';
	import Button from '$components/buttons/Button.svelte';
	import NoBgButton from '$components/buttons/NoBgButton.svelte';
	import IconBack from '$components/icons/IconBack.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import ScBar from '$components/ScBar.svelte';
	import '$css/blog.css';
	import { PUBLIC_BUCKET_AUX_URL } from '$env/static/public';
	import LL from '$i18n/i18n-svelte';
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
	imageUrl="{PUBLIC_BUCKET_AUX_URL}/blog/previews/{frontmatter.slug}.jpg"
	canonical="{canonicalUrl}{$page.url.pathname}"
	article_author={author}
	article_publisher={canonicalUrl}
	article_published_time={frontmatter.date}
/>

<div
	class="w-full flex-1 flex flex-col transition relative items-center 
	px-5 md:px-12 lg:px-0 pb-8"
>
	<div class="w-full flex flex-row justify-between items-start">
		<ToC {toc} />
		<article class="flex-1 flex flex-col justify-start items-center lg:px-16 pt-8">
			<h1 class="w-full max-w-2.5xl px-3 md:px-5 font-bold text-center text-[2rem] leading-[1.35]">
				{title}
			</h1>
			<time
				datetime={frontmatter.date}
				class="w-full max-w-2.5xl px-3 md:px-5 mt-3 text-c-on-bg/40 font-medium text-center leading-relaxed"
			>
				{formattedDate} • {reading_time} min read
			</time>
			{#if author}
				<p
					class="w-full max-w-2.5xl px-3 md:px-5 mt-0.75 text-c-on-bg/40 font-medium text-center leading-relaxed"
				>
					{#if author_url}
						<a rel="noreferrer" class="blog-link" href={author_url} target="_blank">{author}</a>
					{:else}
						<span>{author}</span>
					{/if}
				</p>
			{/if}
			<section
				class="blog max-w-2.5xl w-full flex flex-col justify-start items-start relative mt-8"
			>
				{@html content}
			</section>
		</article>
		<ToC {toc} class="hidden 1.5xl:flex opacity-0 pointer-events-none" />
	</div>
	<div class="w-full flex flex-col items-center mt-16 gap-5">
		<div class="max-w-full flex items-center justify-center">
			<p class="font-bold text-3xl">Thanks for reading!</p>
		</div>
		<NoBgButton href="/blog" prefetch={true}>
			<div class="flex items-center justify-center gap-2.5 px-2 py-1">
				<IconBack
					class="w-6 h-6 transform transition text-c-on-bg/50 group-hover:-translate-x-1
					{!$isTouchscreen ? 'group-hover:text-c-primary' : ''}"
				/>
				<p
					class="font-bold transition text-c-on-bg/50 {!$isTouchscreen
						? 'group-hover:text-c-primary'
						: ''}"
				>
					{$LL.Blog.BackToBlogButton()}
				</p>
			</div>
		</NoBgButton>
	</div>
	<div class="w-full flex justify-center pt-6 pb-10 lg:px-5">
		<div class="w-full bg-c-on-bg/5 rounded-full h-2px" />
	</div>
	<div class="w-full max-w-7xl flex flex-col items-center gap-10">
		<div
			class="max-w-full flex flex-col items-center bg-c-bg relative z-0 overflow-hidden
			ring-2 ring-c-bg-secondary rounded-xl shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]"
		>
			<p class="font-bold text-center text-base bg-c-bg-secondary w-full px-5 py-2.5">
				{$LL.Shared.JoinUsTitle()}
			</p>
			<div class="flex flex-wrap justify-center items-center p-2">
				<ScBar size="md" color="normal" />
			</div>
		</div>
		<div class="w-full flex flex-col items-center gap-5">
			<Button href="/">{$LL.Shared.StartGeneratingButton()}</Button>
		</div>
	</div>
</div>
