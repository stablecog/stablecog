<script lang="ts">
	import TryPage from '$docroutes/try/TryPage.svelte';

	export let data;
</script>

<TryPage
	metadata={data.metadata}
	content={data.content}
	sidebarItem={data.sidebarItem}
	prev={data.metadata.prev}
	next={data.metadata.next}
	parentItem={data.parentItem}
	dirTree={data.dirTree}
/>
