<script lang="ts">
	import GuidePage from '$docroutes/guide/GuidePage.svelte';

	export let data;
</script>

<GuidePage
	metadata={data.metadata}
	content={data.content}
	sidebarItem={data.sidebarItem}
	prev={data.metadata.prev}
	next={data.metadata.next}
	dirTree={data.dirTree}
	parentItem={data.parentItem}
/>
