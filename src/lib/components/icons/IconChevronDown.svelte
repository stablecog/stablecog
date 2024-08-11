<script lang="ts">
	export let strokeWidth = 1.5;
	export { classes as class };
	export { styles as style };
	let classes = 'w-6 h-6';
	let styles: string | undefined = undefined;
</script>

<svg
	style={styles}
	class={classes}
	xmlns="http://www.w3.org/2000/svg"
	fill="none"
	viewBox="0 0 24 24"
	stroke-width={strokeWidth}
	stroke="currentColor"
>
	<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
</svg>
