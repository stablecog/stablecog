<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import GenerationImage from '$components/GenerationImage.svelte';
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
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
							class="rounded-xl bg-c-bg-secondary relative z-0 overflow-hidden border-4 
							shadow-xl shadow-c-shadow/[var(--o-shadow-normal)] border-c-bg-secondary"
						>
							<ImagePlaceholder width={generation.width} height={generation.height} />
							{#if intersecting}
								{@const url = urlFromBase64(generation.imageDataB64)}
								<GenerationImage
									prompt={generation.prompt}
									width={generation.width}
									height={generation.height}
									seed={generation.seed}
									guidanceScale={generation.guidance_scale}
									inferenceSteps={generation.num_inference_steps}
									src={url}
								/>
							{/if}
						</div>
					</div>
				</IntersectionObserver>
			{/each}
		</Masonry>
	{:else}
		<div class="w-full flex-1 flex flex-col justify-center items-center pt-8 pb-12 px-5 gap-6">
			<p class="text-c-on-bg/50">You didn't generate any images yet.</p>
			<Button href="/">Start Generating</Button>
			<div class="h-[2vh]" />
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
