<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { THrefTarget } from '$ts/types/main';
	export let href: string | undefined = undefined;
	export let target: THrefTarget = '_blank';
	export let type: 'sm' | 'md' = 'md';
	export let prefetch: boolean = false;
	export let onClick: (() => void) | undefined = undefined;
	export { classes as class };
	let classes = 'text-c-on-bg/50 -mt-1';
	export let disabled = false;
	export let hoverFrom: 'bottom' | 'top' = 'bottom';
</script>

{#if href}
	<a
		data-sveltekit-prefetch={prefetch && target === '_self' ? '' : 'off'}
		class="max-w-full relative overflow-hidden z-0 px-4 py-3.5 font-semibold transition pointer-events-auto 
		flex items-center gap-1.5 group rounded-xl {!$isTouchscreen ? 'hover:text-c-primary' : ''} {type ===
		'sm'
			? 'text-sm '
			: 'text-base'} {classes}"
		{target}
		{href}
	>
		<div class="w-full h-full absolute left-0 top-0 p-0.5">
			<div class="w-full h-full relative z-0 overflow-hidden rounded-xl">
				<div
					class="w-full h-full origin-left transition transform {hoverFrom === 'top'
						? '-translate-y-full'
						: 'translate-y-full'}
					bg-c-primary/15 rounded-xl {!$isTouchscreen ? 'group-hover:translate-y-0' : ''}"
				/>
			</div>
		</div>
		<slot />
	</a>
{:else}
	<button
		type="button"
		on:click={onClick}
		{disabled}
		class="max-w-full relative overflow-hidden z-0 px-4 py-3.5 font-semibold transition pointer-events-auto 
		flex items-center gap-1.5 group rounded-xl {!$isTouchscreen ? 'hover:text-c-primary' : ''} {type ===
		'sm'
			? 'text-sm '
			: 'text-base'} {classes}"
	>
		<div class="w-full h-full absolute left-0 top-0 p-0.5">
			<div class="w-full h-full relative z-0 overflow-hidden rounded-xl">
				<div
					class="w-full h-full origin-left transition transform {hoverFrom === 'top'
						? '-translate-y-full'
						: 'translate-y-full'}
					bg-c-primary/15 rounded-xl {!$isTouchscreen ? 'group-hover:translate-y-0' : ''}"
				/>
			</div>
		</div>
		<slot />
	</button>
{/if}
