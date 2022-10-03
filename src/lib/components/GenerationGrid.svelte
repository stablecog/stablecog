<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import DownloadGenerationButton from '$components/buttons/DownloadGenerationButton.svelte';
	import Masonry from '$components/Masonry.svelte';
	import type { TDBGeneration } from '$ts/constants/indexedDb';
	import { heightTabs, widthTabs } from '$ts/constants/main';
	import { urlFromBase64 } from '$ts/helpers/base64';
	import IntersectionObserver from 'svelte-intersection-observer';

	export let generations: TDBGeneration[] | undefined = undefined;

	const widths = widthTabs.map((w) => Number(w.value)).filter((i) => i !== 256);
	const heights = heightTabs.map((h) => Number(h.value)).filter((i) => i !== 256);

	const randomWidth = () => widths[Math.floor(Math.random() * widths.length)];
	const randomHeight = () => heights[Math.floor(Math.random() * heights.length)];

	const placeholderArray = Array.from({ length: 20 }, (_, i) => {
		return {
			width: randomWidth(),
			height: randomHeight()
		};
	});

	let nodes: (HTMLElement | undefined)[] = [];
</script>

{#if generations}
	{#if generations.length > 0}
		<Masonry items={generations}>
			{#each generations as generation, i}
				<IntersectionObserver rootMargin="100%" element={nodes[i]} let:intersecting once>
					<div bind:this={nodes[i]} class="relative group">
						<div
							class="rounded-xl bg-c-bg-secondary relative z-0 overflow-hidden border-4 shadow-lg 
							shadow-c-[var(--o-shadow-strong)] border-c-bg-secondary"
						>
							{#if intersecting}
								{@const url = urlFromBase64(generation.imageDataB64)}
								<img
									class="w-full h-auto"
									src={url}
									alt={generation.prompt}
									width={generation.width}
									height={generation.height}
								/>
								<div
									class="w-full h-full absolute left-0 top-0 flex flex-col justify-between items-end gap-5"
								>
									<div
										class="flex items-end justify-end right-0 top-0 transition transform translate-x-16 group-hover:translate-x-0"
									>
										<DownloadGenerationButton
											class="pr-3 pt-3"
											{url}
											prompt={generation.prompt}
											seed={generation.seed}
										/>
									</div>
									<div
										class="w-full max-h-[35%] transition bg-c-bg/90 text-xs relative z-0 overflow-hidden
										translate-y-full group-hover:translate-y-0"
									>
										<div class="w-full max-h-full overflow-auto list-fade">
											<p
												class="w-full font-medium leading-normal transition text-c-on-bg px-5 py-4 transform"
											>
												{generation.prompt}
											</p>
										</div>
									</div>
								</div>
							{:else}
								<svg
									class="w-full h-auto"
									width={generation.width}
									height={generation.height}
									viewBox="0 0 {generation.width} {generation.height}"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								/>
							{/if}
						</div>
					</div>
				</IntersectionObserver>
			{/each}
		</Masonry>
	{:else}
		<div class="w-full flex-1 flex flex-col justify-center items-center py-8 px-5 gap-6">
			<p class="text-c-on-bg/50">You didn't generate any images yet.</p>
			<Button href="/">Start Generating</Button>
			<div class="h-[8vh]" />
		</div>
	{/if}
{:else}
	<Masonry items={generations}>
		{#each placeholderArray as p}
			<div
				class="bg-c-bg-secondary  rounded-xl relative border-4 shadow-lg 
				shadow-c-[var(--o-shadow-strong)] border-c-bg-secondary overflow-hidden"
			>
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
	</Masonry>
{/if}

<style>
	.list-fade {
		mask-image: linear-gradient(to top, transparent, transparent 0.35rem, black 1.25rem);
	}
</style>
