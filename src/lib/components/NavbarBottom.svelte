<script lang="ts">
	import NavigationTabBar from '$components/NavigationTabBar.svelte';
	export { classes as class };
	let classes = '';
</script>

<nav class="w-full fixed -bottom-px left-0 z-50 h-18 flex {classes}">
	<NavigationTabBar type="bottom" />
</nav>
