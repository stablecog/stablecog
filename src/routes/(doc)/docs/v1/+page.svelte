<script lang="ts">
	import DocsPage from '$docroutes/docs/DocsPage.svelte';

	export let data;

	$: data.dirTree?.set([
		...(data.parentItem?.title
			? [{ title: data.parentItem?.title, href: data.parentItem.pathname }]
			: []),
		{ title: data.sidebarItem?.title || '', href: data.sidebarItem?.pathname || '' }
	]);
</script>

<DocsPage
	metadata={data.metadata}
	content={data.content}
	sidebarItem={data.sidebarItem}
	prev={data.metadata.prev}
	next={data.metadata.next}
/>
