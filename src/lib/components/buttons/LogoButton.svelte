<script lang="ts">
	import Logo from '$components/Logo.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';

	export { classes as class };
	let classes = '';
</script>

<a
	aria-label="Go to Home"
	href="/"
	data-sveltekit-preload-data="hover"
	class="touch-manipulation px-2 py-2 md:px-3 md:py-4.5 self-stretch flex items-center justify-center relative rounded-lg md:rounded-xl z-0 group {classes}"
>
	<div class="w-full h-full absolute left-0 top-0 pointer-events-none p-1.5">
		<div class="w-full h-full rounded-lg md:rounded-xl relative z-0 overflow-hidden">
			<div
				class="w-full h-full origin-left rounded-lg md:rounded-xl transition transform -translate-x-full
    		bg-c-primary/25 {!$isTouchscreen ? 'group-hover:translate-x-0' : ''}"
			/>
		</div>
	</div>
	<Logo class="w-9 h-9" />
</a>
