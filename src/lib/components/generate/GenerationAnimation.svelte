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
		: 'bg-c-primary/25'} w-full h-full origin-left absolute left-0 top-0
	flex items-center justify-end transform pointer-events-none animate-generation"
>
	<div
		class="{type === 'inpainting'
			? 'bg-c-primary'
			: 'bg-c-primary/75'} animate-pulse-fast h-full w-2px"
	/>
</div>
