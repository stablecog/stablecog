<script lang="ts">
	export { classes as class };
	let classes = 'w-12 h-12';
</script>

<svg
	class="{classes} rotation-animation"
	width="24"
	height="24"
	viewBox="0 0 24 24"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<circle
		class="path"
		cx="50%"
		cy="50%"
		r="40%"
		stroke="currentColor"
		stroke-width="15%"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>

<style>
	.path {
		stroke-dasharray: 50% 90%;
		stroke-dashoffset: 0%;
		animation-name: path-animation;
		animation-duration: 2s;
		animation-iteration-count: infinite;
	}

	@keyframes path-animation {
		0% {
			stroke-dasharray: 80% 30%;
		}
		50% {
			stroke-dasharray: 20% 160%;
			animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
		}
		100% {
			stroke-dasharray: 80% 30%;
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
