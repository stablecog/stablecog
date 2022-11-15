<script lang="ts">
	export { classes as class };
	export let color: string | undefined = undefined;
	let classes = 'w-6 h-6';
</script>

<svg
	class={classes}
	width="24"
	height="24"
	viewBox="0 0 24 24"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M4 5a1 1 0 0 1 1-1h1a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v1a1 1 0 0 0 2 0V5Zm14-3a1 1 0 1 0 0 2h1a1 1 0 0 1 1 1v1a1 1 0 1 0 2 0V5a3 3 0 0 0-3-3h-1Zm3 15a1 1 0 0 1 1 1v1a3 3 0 0 1-3 3h-1a1 1 0 1 1 0-2h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1ZM4 18a1 1 0 1 0-2 0v1a3 3 0 0 0 3 3h1a1 1 0 1 0 0-2H5a1 1 0 0 1-1-1v-1Zm17-8.5a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Zm-17 1a1 1 0 0 0-2 0v3a1 1 0 1 0 2 0v-3ZM9.5 3a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm1 17a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2h-3Z"
		fill={color ?? 'currentColor'}
	/>
</svg>
