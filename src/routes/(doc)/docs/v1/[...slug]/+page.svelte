<script lang="ts">
	import DocsPage from '$docroutes/docs/DocsPage.svelte';

	export let data;
</script>

<DocsPage
	metadata={data.metadata}
	content={data.content}
	sidebarItem={data.sidebarItem}
	prev={data.metadata.prev}
	next={data.metadata.next}
	parentItem={data.parentItem}
	dirTree={data.dirTree}
/>
