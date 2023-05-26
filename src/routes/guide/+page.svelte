<script lang="ts">
	import GuidePage from '$routes/guide/GuidePage.svelte';

	export let data;
</script>

<GuidePage
	metadata={data.metadata}
	content={data.content}
	sidebarItem={data.sidebarItem}
	prev={data.metadata.prev}
	next={data.metadata.next}
/>
