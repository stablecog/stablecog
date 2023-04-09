<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';

	export let title: string;
	export let description: string;
	export let canonical: string;
	export let imageUrl: string | undefined = undefined;
	export let imageWidth = 1200;
	export let imageHeight = 630;
	export let article_published_time: string | undefined = undefined;
	export let article_author: string | undefined = undefined;
	export let article_publisher: string | undefined = undefined;
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
	{canonical}
	openGraph={{
		type: 'website',
		url: canonical,
		title: title,
		description: description,
		images: imageUrl
			? [
					{
						url: imageUrl,
						width: imageWidth,
						height: imageHeight
					}
			  ]
			: undefined
	}}
	twitter={imageUrl
		? {
				cardType: 'summary_large_image',
				title: title,
				description: description,
				image: imageUrl
		  }
		: undefined}
/>
