<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	export let href: string | undefined = undefined;
	export let target: string | null = '_blank';
	export let type: 'sm' | 'md' = 'md';
	export let prefetch: boolean = false;
	export let onClick: (() => void) | undefined = undefined;
	export { classes as class };
	export let disabled = false;
	let classes = '';
</script>

{#if href}
	<a
		data-sveltekit-prefetch={prefetch ? '' : 'off'}
		class="max-w-full relative overflow-hidden z-0 text-c-on-bg/50 px-4 py-3.5 -mt-1 font-semibold transition pointer-events-auto 
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
					class="w-full h-full origin-left transition transform translate-y-full
					bg-c-primary/25 rounded-xl {!$isTouchscreen ? 'group-hover:translate-y-0' : ''}"
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
		class="max-w-full relative overflow-hidden z-0 text-c-on-bg/50 px-4 py-3.5 -mt-1 font-semibold transition pointer-events-auto 
		flex items-center gap-1.5 group rounded-xl {!$isTouchscreen ? 'hover:text-c-primary' : ''} {type ===
		'sm'
			? 'text-sm '
			: 'text-base'} {classes}"
	>
		<div class="w-full h-full absolute left-0 top-0 p-0.5">
			<div class="w-full h-full relative z-0 overflow-hidden rounded-xl">
				<div
					class="w-full h-full origin-left transition transform translate-y-full
					bg-c-primary/25 rounded-xl {!$isTouchscreen ? 'group-hover:translate-y-0' : ''}"
				/>
			</div>
		</div>
		<slot />
	</button>
{/if}
