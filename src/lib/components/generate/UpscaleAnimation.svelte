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
		style="transform: translateX({!isProcessing ? 0 : -100 + $animation * 100}%)"
		class="w-full h-full bg-c-primary/75 absolute left-0 top-0 filter backdrop-saturate-0"
	/>
</div>
