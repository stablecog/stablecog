<script lang="ts">
	import {
		modalBgTransitionProps,
		modalInTransitionProps,
		modalOutTransitionProps
	} from '$ts/animation/constants';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import { fade, fly } from 'svelte/transition';

	export let hasPadding = true;
</script>

<div
	style="width: {$windowWidth}px; height: {$windowHeight}px;"
	class="flex flex-col items-center fixed left-0 
    top-0 bg-c-barrier/90 z-[100]"
/>
<div
	style="width: {$windowWidth}px; height: {$windowHeight}px;"
	class="flex flex-col items-center fixed left-0 top-0 z-[101] overflow-auto {hasPadding
		? 'px-4 py-16'
		: ''}"
>
	<slot />
</div>
