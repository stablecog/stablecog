<script lang="ts">
	import { page } from '$app/stores';
	import { canonicalUrl } from '$ts/constants/main';
	import { MetaTags } from 'svelte-meta-tags';

	export let title: string;
	export let description: string;
	export let canonical: string | undefined = undefined;
	export let image_url: string | undefined = undefined;
	export let image_width = 1200;
	export let image_height = 630;
	export let article_published_time: string | undefined = undefined;
	export let article_author: string | undefined = undefined;
	export let article_publisher: string | undefined = undefined;

	$: canonicalFallback = canonicalUrl + ($page.url.pathname !== '/' ? $page.url.pathname : '');
</script>

<svelte:head>
	{#if article_author}
		<meta property="article:author" content={article_author} />
	{/if}
	{#if article_publisher}
		<meta property="article:publisher" content={article_publisher} />
	{/if}
	{#if article_published_time}
		<meta property="article:published_time" content={article_published_time} />
	{/if}
</svelte:head>
<MetaTags
	{title}
	{description}
	canonical={canonical || canonicalFallback}
	openGraph={{
		type: 'website',
		url: canonical,
		title: title,
		description: description,
		images: image_url
			? [
					{
						url: image_url,
						width: image_width,
						height: image_height
					}
			  ]
			: undefined
	}}
	twitter={image_url
		? {
				cardType: 'summary_large_image',
				title: title,
				description: description,
				image: image_url
		  }
		: undefined}
/>
