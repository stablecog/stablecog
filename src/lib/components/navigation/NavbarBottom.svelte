<script lang="ts">
	import NavigationTabBar from '$components/navigation/NavigationTabBar.svelte';
	export { classes as class };
	let classes = '';
</script>

<nav class="w-full fixed -bottom-px bg-c-bg left-0 z-50 flex {classes}">
	<NavigationTabBar type="bottom" />
</nav>
