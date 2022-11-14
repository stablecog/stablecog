<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';

	export let title: string;
	export let description: string;
	export let canonical: string;
	export let imageUrl: string | undefined = undefined;
	export let imageWidth = 1200;
	export let imageHeight = 630;
</script>

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
