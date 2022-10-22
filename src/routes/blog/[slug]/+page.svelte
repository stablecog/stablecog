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
	export let data: {
		content: string;
		toc: string;
		title: string;
		frontmatter: {
			title: string;
			slug: string;
			author: string;
			author_url?: string;
			date: string;
			reading_time: number;
			description: string;
		};
	};
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
	px-5 md:px-12 lg:pl-6 lg:pr-14 xl:px-6 pt-6 md:pt-12 pb-16"
>
	<div class="flex flex-row justify-center items-start">
		<ToC {toc} />
		<div class="flex flex-col justify-start items-center pt-4">
			<div class="max-w-2xl flex flex-col items-center">
				<h1 class="font-bold text-center text-3.5xl leading-snug px-3">{title}</h1>
				<p class="mt-3 mb-8 text-c-on-bg/40 font-medium text-center leading-relaxed">
					{formattedDate} • {reading_time} min read {#if author}
						• {#if author_url}
							<a class="blog-link" href={author_url} target="_blank">{author}</a>
						{:else}
							<span>{author}</span>
						{/if}
					{/if}
				</p>
			</div>
			<div class="blog max-w-2xl w-full flex flex-col justify-start items-start relative">
				{@html content}
			</div>
		</div>
		<ToC {toc} class="hidden xl:flex opacity-0 pointer-events-none" />
	</div>
	<LinkButton href="/blog" class="mt-5" target={null} prefetch={true}>
		<div class="flex items-center justify-center gap-2.5 px-2 py-1">
			<IconBack
				class="w-6 h-6 transform transition text-c-on-bg/50 group-hover:-translate-x-1
				group-hover:text-c-primary"
			/>
			<p class="font-bold">Back to Blog</p>
		</div>
	</LinkButton>
	<div class="w-full flex justify-center pt-6 pb-10">
		<div class="w-full max-w-7xl bg-c-on-bg/5 rounded-full h-2px" />
	</div>
	<div class="w-full max-w-7xl flex flex-col items-center gap-12">
		<div
			class="max-w-full flex flex-col items-center bg-c-bg relative z-0 overflow-hidden
			ring-2 ring-c-bg-secondary rounded-xl shadow-xl shadow-c-shadow/[var(--o-shadow-strong)]"
		>
			<p
				class="font-bold text-c-on-bg/75 text-center text-base bg-c-bg-secondary w-full px-5 py-2.5"
			>
				Join Us
			</p>
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
