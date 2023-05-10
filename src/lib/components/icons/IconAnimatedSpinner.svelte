<script lang="ts">
	export { classes as class };
	export let loading = true;
	let classes = 'w-6 h-6';
</script>

<div class="{classes} {loading ? 'animated-spinner-rotation-animation' : ''}">
	<svg
		class="w-full h-full"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle
			class={loading ? 'animated-spinner-path' : ''}
			cx="12"
			cy="12"
			r="9"
			stroke="currentColor"
			stroke-width="4"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
</div>
