<script lang="ts">
	import type { Writable } from 'svelte/store';

	export let animation: Writable<number>;
	export let isProcessing: boolean;
</script>

<div class="pointer-events-none absolute left-0 top-0 z-0 h-full w-full overflow-hidden">
	<div
		class="pointer-events-none absolute left-0 top-0 z-0 h-full w-full transform overflow-hidden transition {!isProcessing
			? 'translate-x-[calc(100%+4px)]'
			: ''}"
	>
		<div
			style="transform: translateX({!isProcessing ? 0 : -100 + $animation * 100}%)"
			class="absolute left-0 top-0 flex h-full w-full items-center justify-end bg-c-primary/50 filter
			backdrop-saturate-0"
		>
			<div class="h-full w-2px animate-pulse-fast bg-c-primary" />
		</div>
	</div>
</div>
