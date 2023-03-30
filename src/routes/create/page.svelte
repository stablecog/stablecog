<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { navbarHeight } from '$ts/stores/navbarHeight';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import { onDestroy, onMount } from 'svelte';

	let topbarHeight: number;
	let leftPanelHeight: number;

	onMount(() => {
		document.body.style.overflow = 'hidden';
		document.body.style.height = '100%';
	});

	onDestroy(() => {
		document.body.style.overflow = 'auto';
		document.body.style.height = 'auto';
	});
</script>

<div
	style="height: {$windowHeight - $navbarHeight}px"
	class="w-full flex flex-row items-stretch overflow-hidden"
>
	<div bind:clientHeight={leftPanelHeight} class="flex-1 h-full flex flex-col px-6 relative">
		<div bind:clientHeight={topbarHeight} class="w-full flex items-center gap-3 sticky top-0 pt-3">
			<input
				placeholder="Portrait of a cat by Van Gogh"
				style="transition: height 0.1s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), padding 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
				class="w-full bg-c-bg-secondary shadow-lg pr-12 md:pr-17 hide-scrollbar shadow-c-shadow/[var(--o-shadow-normal)] 
        scroll-smooth resize-none transition relative pl-5 md:pl-6 py-5 rounded-xl 
        focus:ring-2 focus:ring-c-primary/30 ring-0 ring-c-primary/20 placeholder:text-c-on-bg/40 {!$isTouchscreen
					? 'enabled:hover:ring-2'
					: ''} text-c-on-bg {!$isTouchscreen ? 'group-hover:ring-2' : ''}"
			/>
			<Button>Generate</Button>
		</div>
		<div style="height: {leftPanelHeight - topbarHeight}px" class="w-full flex flex-col py-6">
			<div
				class="w-full rounded-3xl px-1 py-1 pb-6 flex flex-wrap overflow-auto bg-c-bg
        shadow-2xl shadow-c-shadow/[var(--o-shadow-strongest)] border-4 border-c-bg-secondary"
			>
				{#each Array(50) as item}
					<div class="w-1/4 p-1.5">
						<img
							class="w-full ring-4 ring-c-bg-secondary rounded-xl shadow-xl shadow-c-shadow/[var(--o-shadow-stronger)]"
							src="/example.jpg"
							alt="Cloud Tree"
						/>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<div class="w-96 h-full pr-6 pb-6 pt-2.5">
		<div
			class="w-full h-full bg-c-bg rounded-3xl border-4 border-c-bg-secondary
      shadow-2xl shadow-c-shadow/[var(--o-shadow-strongest)] p-5"
		/>
	</div>
</div>
