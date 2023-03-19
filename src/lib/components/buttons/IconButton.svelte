<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { THrefTarget } from '$ts/types/main';

	export let onClick: (() => void) | undefined = undefined;
	export let href: string | undefined = undefined;
	export let name: string;
	export { classes as class };
	export let prefetch: boolean = true;
	export let target: THrefTarget = '_self';
	export let noPadding = false;
	export let disabled = false;
	export let type: 'on-primary' | 'primary' | 'secondary' = 'primary';
	let classes = '';
</script>

{#if href}
	<a
		data-sveltekit-preload-data={prefetch && target === '_self' ? 'hover' : 'off'}
		{href}
		{target}
		class="group/iconbutton rounded-xl {classes}"
		aria-label={name}
	>
		<div class="rounded-lg relative">
			<div class="w-full h-full rounded-full overflow-hidden z-0 absolute left-0 top-0">
				<div
					class="w-full h-full ease-out transition transform {type === 'on-primary'
						? 'bg-c-on-primary/15'
						: 'bg-c-primary/25'} 
        		absolute left-0 top-0 rounded-xl -translate-x-full {!$isTouchscreen
						? 'group-hover/iconbutton:translate-x-0'
						: ''}"
				/>
			</div>
			<div class={noPadding ? '' : 'p-2'}>
				<slot />
			</div>
		</div>
	</a>
{:else}
	<button
		type="button"
		{disabled}
		on:click={onClick}
		class="group/iconbutton rounded-xl {classes}"
		aria-label={name}
	>
		<div class="rounded-lg relative">
			<div class="w-full h-full rounded-full overflow-hidden z-0 absolute left-0 top-0">
				<div
					class="w-full h-full ease-out transition transform {type === 'secondary'
						? 'bg-c-secondary/25'
						: type === 'on-primary'
						? 'bg-c-on-primary/25'
						: 'bg-c-primary/25'} 
          	absolute left-0 top-0 rounded-xl -translate-x-full {!$isTouchscreen
						? 'group-hover/iconbutton:translate-x-0'
						: ''}"
				/>
			</div>
			<div class={noPadding ? '' : 'p-2'}>
				<slot />
			</div>
		</div>
	</button>
{/if}
