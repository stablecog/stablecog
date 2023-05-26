<script lang="ts">
	import type { Tweened } from 'svelte/motion';
	export let animation: Tweened<number>;
</script>

<div
	style="transform: scaleX({$animation})"
	class="w-full h-full bg-c-primary/25 origin-left absolute left-0 top-0 
	flex items-center justify-center transform pointer-events-none"
/>
