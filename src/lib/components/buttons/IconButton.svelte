<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';

	export let onClick: (() => void) | undefined = undefined;
	export let href: string | undefined = undefined;
	export let name: string;
	export { classes as class };
	export let prefetch: boolean = true;
	export let target: string | null = null;
	export let noPadding = false;
	export let disabled = false;
	let classes = '';
</script>

{#if href}
	<a
		data-sveltekit-prefetch={prefetch ? '' : 'off'}
		{href}
		{target}
		class="group rounded-xl {classes}"
		aria-label={name}
	>
		<div class="rounded-lg relative">
			<div class="w-full h-full rounded-full overflow-hidden z-0 absolute left-0 top-0">
				<div
					class="w-full h-full ease-out transition transform bg-c-primary/25 
        	absolute left-0 top-0 rounded-xl -translate-x-full {!$isTouchscreen
						? 'group-hover:translate-x-0'
						: ''}"
				/>
			</div>
			<div class={noPadding ? '' : 'p-2'}>
				<slot />
			</div>
		</div>
	</a>
{:else}
	<button {disabled} on:click={onClick} class="group rounded-xl {classes}" aria-label={name}>
		<div class="rounded-lg relative">
			<div class="w-full h-full rounded-full overflow-hidden z-0 absolute left-0 top-0">
				<div
					class="w-full h-full ease-out transition transform bg-c-primary/25 
          absolute left-0 top-0 rounded-xl -translate-x-full {!$isTouchscreen
						? 'group-hover:translate-x-0'
						: ''}"
				/>
			</div>
			<div class={noPadding ? '' : 'p-2'}>
				<slot />
			</div>
		</div>
	</button>
{/if}
