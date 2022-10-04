<script lang="ts">
	export let width: number;
	export let height: number;
	export { classes as class };
	let classes = '';
</script>

<svg
	class="w-full h-auto {classes}"
	{width}
	{height}
	viewBox="0 0 {width} {height}"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
/>
