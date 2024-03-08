<script lang="ts">
	import type { TGenerateMode } from '$ts/stores/generate/generateMode';
	import type { Tweened } from 'svelte/motion';

	export let type: TGenerateMode = 'regular';
	export let animation: Tweened<number>;
</script>

<div
	style="transform: translateX({-100 + $animation * 100}%)"
	class="{type === 'inpainting'
		? 'bg-c-primary/40'
		: 'bg-c-primary/25'} animate-generation pointer-events-none absolute left-0 top-0 flex
	h-full w-full origin-left transform items-center justify-end"
>
	<div
		class="{type === 'inpainting'
			? 'bg-c-primary'
			: 'bg-c-primary/75'} h-full w-2px animate-pulse-fast"
	/>
</div>
