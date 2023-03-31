<script lang="ts">
	export { classes as class };
	export let loading = true;
	let classes = 'w-12 h-12';
</script>

<svg
	class="{classes} {loading ? 'rotation-animation' : ''}"
	width="64"
	height="64"
	viewBox="0 0 64 64"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<circle class={loading ? 'scale-animation' : ''} cx="16" cy="7" r="5" fill="currentColor" />
	<circle
		class="{loading ? 'scale-animation' : ''} delay-animation-25"
		cx="7"
		cy="57"
		r="5"
		fill="currentColor"
	/>
	<circle
		class="{loading ? 'scale-animation' : ''} delay-animation-50"
		cx="9"
		cy="28"
		r="7"
		stroke="currentColor"
		stroke-width="2"
		stroke-dasharray="3 3"
	/>
	<circle
		class="{loading ? 'scale-animation' : ''} delay-animation-75"
		cx="58"
		cy="21"
		r="4"
		stroke="currentColor"
		stroke-width="2"
	/>
	<circle
		class="{loading ? 'scale-animation' : ''} delay-animation-100"
		cx="49"
		cy="49"
		r="7"
		fill="currentColor"
	/>
	<circle class="{loading ? 'scale-animation' : ''} delay-animation-25" cx="41" cy="7" r="5" />
	<circle
		class="{loading ? 'scale-animation' : ''} delay-animation-50"
		cx="20"
		cy="44"
		r="4"
		stroke="currentColor"
		stroke-width="2"
	/>
	<circle
		class="{loading ? 'scale-animation' : ''} delay-animation-75"
		cx="30"
		cy="55"
		r="3"
		stroke="currentColor"
		stroke-width="2"
	/>
	<circle
		class="{loading ? 'scale-animation' : ''} delay-animation-100"
		cx="35.5"
		cy="26.5"
		r="10.5"
		stroke="currentColor"
		stroke-width="2"
		stroke-dasharray="3 3"
	/>
</svg>

<style>
	.scale-animation {
		animation-name: scale-animation;
		animation-duration: 2s;
		animation-iteration-count: infinite;
	}

	.delay-animation-25 {
		animation-delay: -0.25s;
	}
	.delay-animation-50 {
		animation-delay: -0.5s;
	}
	.delay-animation-75 {
		animation-delay: -0.75s;
	}
	.delay-animation-100 {
		animation-delay: -0.1s;
	}

	@keyframes scale-animation {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		50% {
			transform: scale(1);
			opacity: 1;
			animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
		}
		100% {
			transform: scale(0);
			opacity: 0;
		}
	}

	.rotation-animation {
		animation-name: rotation-animation;
		animation-duration: 2.5s;
		animation-iteration-count: infinite;
		animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
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
