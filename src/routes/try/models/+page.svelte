<script lang="ts">
	import TryPage from '$routes/try/TryPage.svelte';

	export let data;
</script>

<TryPage
	metadata={data.metadata}
	content={data.content}
	sidebarItem={data.sidebarItem}
	prev={data.metadata.prev}
	next={data.metadata.next}
/>
