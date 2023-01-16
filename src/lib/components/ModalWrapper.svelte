<script lang="ts">
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import { quadOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	export let hasPadding = true;
</script>

<div
	transition:fade|local={{ duration: 300, easing: quadOut }}
	style="width: {$windowWidth}px; height: {$windowHeight}px;"
	class="flex flex-col items-center fixed left-0 
    top-0 bg-c-barrier/95 z-[100] overflow-auto {hasPadding ? 'px-4 py-16' : ''}"
>
	<slot />
</div>
