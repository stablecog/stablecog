<script lang="ts">
	import { quadOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
</script>

<div
	transition:fade={{ duration: 300, easing: quadOut }}
	class="w-screen h-screen flex justify-center py-16 fixed left-0 
    top-0 bg-c-barrier/80 z-[100] p-4 overflow-auto"
>
	<slot />
</div>
