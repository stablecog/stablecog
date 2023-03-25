<script lang="ts">
	export { classes as class };
	export let loading = false;
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
		class={loading ? 'path-animation' : ''}
		d="M5 4V20"
		stroke="currentColor"
		stroke-width="3"
		stroke-linecap="round"
	/>
	<path
		class="{loading ? 'path-animation' : ''} delay-1"
		d="M12 4V20"
		stroke="currentColor"
		stroke-width="3"
		stroke-linecap="round"
	/>
	<path
		class={loading ? 'path-animation' : ''}
		d="M19 4V20"
		stroke="currentColor"
		stroke-width="3"
		stroke-linecap="round"
	/>
</svg>

<style>
	.delay-1 {
		animation-delay: 0.25s;
	}
	.path-animation {
		stroke-dasharray: 16 16;
		stroke-dashoffset: 0;
		animation-name: path-animation-1;
		animation-duration: 0.5s;
		animation-iteration-count: infinite;
		animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
	}

	@keyframes path-animation-1 {
		0% {
			stroke-dasharray: 4 4;
			stroke-dashoffset: 0;
		}
		100% {
			stroke-dasharray: 4 4;
			stroke-dashoffset: 16;
		}
	}
</style>
