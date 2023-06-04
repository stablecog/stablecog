<script lang="ts">
	import GuidePage from '$docroutes/guide/GuidePage.svelte';

	export let data;

	$: data.dirTree?.set([
		...(data.parentItem?.title
			? [{ title: data.parentItem?.title, href: data.parentItem.pathname }]
			: []),
		{ title: data.sidebarItem?.title || '', href: data.sidebarItem?.pathname || '' }
	]);
</script>

<GuidePage
	metadata={data.metadata}
	content={data.content}
	sidebarItem={data.sidebarItem}
	prev={data.metadata.prev}
	next={data.metadata.next}
/>
