<script lang="ts">
	export { classes as class };
	export let strokeWidth = 1.5;
	let classes = 'w-6 h-6';
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	fill="none"
	viewBox="0 0 24 24"
	stroke-width={strokeWidth}
	stroke="currentColor"
	class={classes}
>
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
	/>
</svg>
