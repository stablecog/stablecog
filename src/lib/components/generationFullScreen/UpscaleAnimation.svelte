<script lang="ts">
	import type { Writable } from 'svelte/store';

	export let animation: Writable<number>;
	export let isProcessing: boolean;
</script>

<div
	class="w-full h-full absolute left-0 top-0 transition transform overflow-hidden z-0 pointer-events-none {!isProcessing
		? 'translate-x-[calc(100%+4px)]'
		: ''}"
>
	<div
		style="transform: translateX({$animation === 1 && !isProcessing
			? 0
			: -100 + $animation * 100}%)"
		class="w-full h-full bg-c-secondary/50 filter backdrop-blur-lg 
    absolute left-0 top-0"
	/>
</div>
