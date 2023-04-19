<script lang="ts">
	import { page } from '$app/stores';
	import { flatSidebarShallow } from '$routes/guide/constants.js';
	import '$css/blog.css';
	import MetaTag from '$components/MetaTag.svelte';
	import { canonicalUrl } from '$ts/constants/main.js';
	import GuidePage from '$routes/guide/GuidePage.svelte';

	export let data;

	$: pathname = $page.url.pathname;
	$: index = flatSidebarShallow.findIndex((item) => item.pathname === pathname);
	$: prev = index - 1 >= 0 ? flatSidebarShallow[index - 1] : null;
	$: next = index + 1 < flatSidebarShallow.length ? flatSidebarShallow[index + 1] : null;
</script>

<MetaTag
	title="{data.metadata.title} | Guide"
	description={data.metadata.description}
	imageUrl={data.metadata.preview_image_url}
	canonical="{canonicalUrl}{$page.url.pathname}"
	article_author={data.metadata.author}
	article_publisher={canonicalUrl}
	article_published_time={data.metadata.date}
/>

<GuidePage content={data.content} sidebarItem={data.sidebarItem} {prev} {next} />
