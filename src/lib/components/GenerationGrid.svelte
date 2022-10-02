<script lang="ts">
	import DownloadGenerationButton from '$components/buttons/DownloadGenerationButton.svelte';
	import Masonry from '$components/Masonry.svelte';
	import type { TDBGeneration } from '$ts/constants/indexedDb';
	import { urlFromBase64 } from '$ts/helpers/base64';

	export let generations: TDBGeneration[] = [];

	let updateGrid: () => void;
</script>

<svelte:window on:resize={updateGrid} />
<Masonry items={generations}>
	{#each generations as generation}
		<div class="relative group">
			<img
				class="w-full relative h-auto block rounded-xl border-2 shadow-lg shadow-c-[var(--o-shadow-strong)] border-c-bg-secondary"
				src={generation.imageDataB64}
				alt={generation.prompt}
				width={generation.width}
				height={generation.height}
			/>
			<div class="w-full h-full absolute left-0 top-0 overflow-hidden z-0">
				<div
					class="absolute flex items-end justify-end right-0 top-0 transition transform translate-x-16 group-hover:translate-x-0"
				>
					<DownloadGenerationButton
						class="pr-3 pt-3"
						url={urlFromBase64(generation.imageDataB64)}
						prompt={generation.prompt}
						seed={generation.seed}
					/>
				</div>
			</div>
		</div>
	{/each}
</Masonry>
