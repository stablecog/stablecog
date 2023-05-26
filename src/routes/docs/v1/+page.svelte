<script lang="ts">
	import DocsPage from '$routes/docs/DocsPage.svelte';

	export let data;
</script>

<DocsPage
	metadata={data.metadata}
	content={data.content}
	sidebarItem={data.sidebarItem}
	prev={data.metadata.prev}
	next={data.metadata.next}
/>
