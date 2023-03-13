<script lang="ts">
	export { classes as class };
	export let loading = true;
	let classes = 'w-6 h-6';
</script>

<svg
	class="{classes} {loading ? 'rotation-animation' : ''}"
	width="24"
	height="24"
	viewBox="0 0 24 24"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<circle
		class={loading ? 'path' : ''}
		cx="12"
		cy="12"
		r="9"
		stroke="currentColor"
		stroke-width="4"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>

<style>
	.path {
		stroke-dasharray: 18 10;
		stroke-dashoffset: 0%;
		animation-name: path-animation;
		animation-duration: 1.5s;
		animation-iteration-count: infinite;
	}

	@keyframes path-animation {
		0% {
			stroke-dasharray: 24 12;
		}
		50% {
			stroke-dasharray: 6 12;
			animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
		}
		100% {
			stroke-dasharray: 24 12;
		}
	}

	.rotation-animation {
		animation-name: rotation-animation;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}

	@keyframes rotation-animation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
