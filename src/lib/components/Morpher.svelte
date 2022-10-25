<script lang="ts">
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export let morph = false;
	export { classes as class };
	let classes = '';
</script>

<div class="relative {classes}">
	<div class="opacity-0 pointer-events-none">
		<slot name="item-0" />
	</div>
	{#if morph}
		<div
			transition:scale={{ duration: 200, easing: quadOut, opacity: 0, start: 0.5 }}
			class="w-full h-full absolute left-0 top-0"
		>
			<slot name="item-1" />
		</div>
	{:else}
		<div
			transition:scale={{ duration: 200, easing: quadOut, opacity: 0, start: 0.5 }}
			class="w-full h-full absolute left-0 top-0"
		>
			<slot name="item-0" />
		</div>
	{/if}
</div>
