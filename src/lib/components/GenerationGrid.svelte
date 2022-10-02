<script lang="ts">
	import DownloadGenerationButton from '$components/buttons/DownloadGenerationButton.svelte';
	import Masonry from '$components/Masonry.svelte';
	import type { TDBGeneration } from '$ts/constants/indexedDb';
	import { heightTabs, widthTabs } from '$ts/constants/main';
	import { urlFromBase64 } from '$ts/helpers/base64';

	export let generations: TDBGeneration[] | undefined = undefined;

	const widths = widthTabs.map((w) => Number(w.value)).filter((i) => i !== 256);
	const heights = heightTabs.map((h) => Number(h.value)).filter((i) => i !== 256);

	const randomWidth = () => widths[Math.floor(Math.random() * widths.length)];
	const randomHeight = () => heights[Math.floor(Math.random() * heights.length)];

	const placeholderArray = Array.from({ length: 15 }, (_, i) => {
		return {
			width: randomWidth(),
			height: randomHeight()
		};
	});
</script>

<Masonry items={generations}>
	{#if generations}
		{#each generations as generation}
			<div class="relative group">
				<div
					class="rounded-xl relative border-4 shadow-lg 
					shadow-c-[var(--o-shadow-strong)] border-c-bg-secondary overflow-hidden"
				>
					<img
						class="w-full h-auto"
						src={generation.imageDataB64}
						alt={generation.prompt}
						width={generation.width}
						height={generation.height}
					/>
				</div>
				<div
					class="w-full h-full absolute left-0 top-0 flex flex-col justify-between items-end rounded-xl overflow-hidden z-0 gap-5"
				>
					<div
						class="flex items-end justify-end right-0 top-0 transition transform translate-x-16 group-hover:translate-x-0"
					>
						<DownloadGenerationButton
							class="pr-3 pt-3"
							url={urlFromBase64(generation.imageDataB64)}
							prompt={generation.prompt}
							seed={generation.seed}
						/>
					</div>
					<div
						class="w-full max-h-[35%] transition bg-c-bg/90 text-xs relative overflow-hidden
						translate-y-full group-hover:translate-y-0"
					>
						<div class="w-full max-h-full overflow-auto list-fade">
							<p
								class="w-full font-medium transition text-c-on-bg px-5 py-4 transform leading-relaxed"
							>
								{generation.prompt}
							</p>
						</div>
					</div>
				</div>
			</div>
		{/each}
	{:else}
		{#each placeholderArray as p}
			<div
				class="bg-c-bg rounded-xl relative border-4 shadow-lg 
				shadow-c-[var(--o-shadow-strong)] border-c-bg-secondary overflow-hidden"
			>
				<div
					class="absolute left-0 top-0 w-full h-full bg-c-on-bg transition animate-pulse-custom"
				/>
				<svg
					class="w-full h-auto"
					width={p.width}
					height={p.height}
					viewBox="0 0 {p.width} {p.height}"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				/>
			</div>
		{/each}
	{/if}
</Masonry>

<style>
	.list-fade {
		mask-image: linear-gradient(to top, transparent, transparent 0.35rem, black 1.25rem);
	}
</style>
