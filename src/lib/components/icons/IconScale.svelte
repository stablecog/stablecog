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
		d="M2 2.75A.75.75 0 0 1 2.75 2h18.5a.75.75 0 0 1 0 1.5h-2.361l2.839 7.3c.18.463.297.96.192 1.445a3.501 3.501 0 0 1-6.84 0c-.106-.485.012-.982.192-1.444L18.11 3.5H12.75v17h5.5a.75.75 0 0 1 0 1.5H5.75a.75.75 0 0 1 0-1.5h5.5v-17H5.889l2.839 7.3c.18.463.298.96.192 1.445a3.501 3.501 0 0 1-6.84 0c-.106-.485.012-.982.192-1.444L5.11 3.5H2.75A.75.75 0 0 1 2 2.75Zm3.5 3.889L7.39 11.5H3.61L5.5 6.639ZM20.39 11.5 18.5 6.639 16.61 11.5h3.78Z"
		fill={color ?? 'currentColor'}
	/>
</svg>
