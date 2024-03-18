<script lang="ts">
	import Button from '$components/primitives/buttons/Button.svelte';
	import NoBgButton from '$components/primitives/buttons/NoBgButton.svelte';
	import BlogPostCard from '$components/docs/BlogPostCard.svelte';
	import ToC from '$components/docs/ToC.svelte';
	import IconBack from '$components/icons/IconBack.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import ScBar from '$components/ScBar.svelte';
	import '$css/blog.css';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { onMount, onDestroy } from 'svelte';

	export let data;

	let observer: IntersectionObserver;
	let headings: NodeListOf<HTMLElement>;
	let activeId: string;

	$: formattedDate = new Date(data.metadata.date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});

	onMount(() => {
		headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeId = entry.target.id;
					}
				});
			},
			{ rootMargin: '0% 0% -80% 0%' }
		);
		headings.forEach((heading) => {
			observer.observe(heading);
		});
	});

	onDestroy(() => {
		if (headings) {
			headings.forEach((heading) => {
				observer.unobserve(heading);
			});
		}
	});
</script>

<MetaTag
	title="{data.metadata.title} | Blog"
	description={data.metadata.description}
	article_author={data.metadata.author}
	article_publisher={canonicalUrl}
	article_published_time={data.metadata.date}
	image_url={data.metadata.preview_image_url}
/>

<div
	class="relative flex w-full flex-1 flex-col items-center px-5
	pb-8 transition md:px-12 lg:px-0"
>
	<div class="flex w-full flex-row items-start justify-between">
		<ToC toc={data.metadata.toc} {activeId} />
		<article class="flex min-w-0 flex-1 flex-col items-center justify-start pt-8 lg:px-16">
			<h1 class="w-full max-w-2.5xl px-3 text-center text-[2rem] font-bold leading-[1.35] md:px-5">
				{data.metadata.title}
			</h1>
			<time
				datetime={data.metadata.date}
				class="mt-3 w-full max-w-2.5xl px-3 text-center font-medium leading-relaxed text-c-on-bg/60 md:px-5"
			>
				{formattedDate}<span class="mx-2">•</span>{data.metadata.reading_time} min read
			</time>
			{#if data.metadata.author}
				<p
					class="mt-0.75 w-full max-w-2.5xl px-3 text-center font-medium leading-relaxed text-c-on-bg/60 md:px-5"
				>
					{#if data.metadata.author_url}
						<a class="blog-link" href={data.metadata.author_url} target="_blank"
							>{data.metadata.author}</a
						>
					{:else}
						<span>{data.metadata.author}</span>
					{/if}
				</p>
			{/if}
			<section
				class="blog relative mt-8 flex w-full max-w-2.5xl flex-col items-start justify-start"
			>
				<svelte:component this={data.Content} />
			</section>
		</article>
		<ToC
			toc={data.metadata.toc}
			{activeId}
			class="pointer-events-none hidden opacity-0 1.5xl:flex"
		/>
	</div>
	<div class="mt-16 flex w-full flex-col items-center gap-5">
		<p class="w-full px-3 text-center text-3xl font-bold">{$LL.Blog.ThanksForReading()}</p>
		<NoBgButton hoverFrom="right" href="/blog" prefetch={true}>
			<div class="flex items-center justify-center gap-2.5 px-2">
				<IconBack
					class="h-6 w-6 transform text-c-on-bg/50 transition group-hover:-translate-x-1
					not-touch:group-hover:text-c-primary"
				/>
				<p class="text-c-on-bg/50 transition not-touch:group-hover:text-c-primary">
					{$LL.Blog.BackToBlogButton()}
				</p>
			</div>
		</NoBgButton>
	</div>
	<div class="flex w-full justify-center pb-10 pt-6 lg:px-5">
		<div class="h-2px w-full rounded-full bg-c-on-bg/5" />
	</div>
	{#if data.similarPosts.length > 0}
		<section id="read-more" class="flex w-full flex-col items-center pb-2 pt-1">
			<h3 class="w-full px-3 text-center text-3xl font-bold">{$LL.Blog.ReadMoreTitle()}</h3>
			<ul class="flex w-full max-w-7xl flex-row flex-wrap justify-center pt-6 lg:px-8">
				{#each data.similarPosts as similarPost}
					<li class="flex w-full max-w-md self-stretch p-2 md:w-1/2 lg:w-1/2 xl:w-1/4">
						<BlogPostCard post={similarPost} />
					</li>
				{/each}
			</ul>
		</section>
		<div class="flex w-full justify-center pb-14 pt-12 lg:px-5">
			<div class="h-2px w-full rounded-full bg-c-on-bg/5" />
		</div>
	{/if}
	<div class="flex w-full max-w-7xl flex-col items-center gap-10">
		<div
			class="relative z-0 flex max-w-full flex-col items-center overflow-hidden rounded-xl
			bg-c-bg shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] ring-2 ring-c-bg-secondary"
		>
			<p class="w-full bg-c-bg-secondary px-5 py-2.5 text-center text-base font-bold">
				{$LL.Shared.JoinUsTitle()}
			</p>
			<div class="flex flex-wrap items-center justify-center p-2">
				<ScBar noGuide noBlog noEmail size="md" color="normal" />
			</div>
		</div>
		<div class="flex w-full flex-col items-center gap-5">
			<p class="text-center text-2xl font-bold">{$LL.Landing.Hero.Title()}</p>
			<Button href="/generate">{$LL.Shared.StartGeneratingButton()}</Button>
		</div>
	</div>
</div>
