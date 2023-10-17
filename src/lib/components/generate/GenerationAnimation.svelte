<script lang="ts">
	import type { Tweened } from 'svelte/motion';
	export let animation: Tweened<number>;
</script>

<div
	style="transform: translateX({-100 + $animation * 100}%)"
	class="w-full h-full bg-c-primary/25 origin-left absolute left-0 top-0
	flex items-center justify-end transform pointer-events-none animate-generation"
>
	<div class="bg-c-primary/75 animate-pulse-fast h-full w-2px" />
</div>
