<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';

	export let onClick: (() => void) | undefined = undefined;
	export let href: string | undefined = undefined;
</script>

{#if href}
	<a data-sveltekit-prefetch {href} class="group">
		<div class="rounded-full relative">
			<div class="w-full h-full rounded-full overflow-hidden z-0 absolute left-0 top-0">
				<div
					class="w-full h-full ease-out transition transform bg-c-primary/25 
        absolute left-0 top-0 rounded-xl -translate-x-full {!$isTouchscreen
						? 'group-hover:translate-x-0'
						: ''}"
				/>
			</div>
			<div class="p-2">
				<slot />
			</div>
		</div>
	</a>
{:else}
	<button on:click={onClick} class="group">
		<div class="rounded-full relative">
			<div class="w-full h-full rounded-full overflow-hidden z-0 absolute left-0 top-0">
				<div
					class="w-full h-full ease-out transition transform bg-c-primary/25 
          absolute left-0 top-0 rounded-xl -translate-x-full {!$isTouchscreen
						? 'group-hover:translate-x-0'
						: ''}"
				/>
			</div>
			<div class="p-2">
				<slot />
			</div>
		</div>
	</button>
{/if}
