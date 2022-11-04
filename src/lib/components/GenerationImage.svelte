<script lang="ts">
	import CopyButton from '$components/buttons/CopyButton.svelte';
	import DownloadGenerationButton from '$components/buttons/DownloadGenerationButton.svelte';
	import IconChatBubbleCancel from '$components/icons/IconChatBubbleCancel.svelte';
	import IconClock from '$components/icons/IconClock.svelte';
	import IconScale from '$components/icons/IconScale.svelte';
	import IconSteps from '$components/icons/IconSteps.svelte';
	import { urlFromBase64 } from '$ts/helpers/base64';
	import { doesContainTarget } from '$ts/helpers/doesContainTarget';
	import { activeGeneration } from '$ts/stores/activeGeneration';
	import { advancedMode } from '$ts/stores/advancedMode';
	import type { TGenerationUI } from '$ts/types/main';

	export let generation: TGenerationUI;
	export let prioritizeUpscaled = false;
	export let scrollPrompt = false;

	if (generation.imageUrl === undefined) {
		generation.imageUrl = urlFromBase64(generation.imageDataB64);
	}
	if (generation.upscaledImageUrl === undefined && generation.upscaledImageDataB64 !== undefined) {
		generation.upscaledImageUrl = urlFromBase64(generation.upscaledImageDataB64);
	}

	let promptCopied = false;
	let promptCopiedTimeout: NodeJS.Timeout;
	let rightButtonContainer: HTMLDivElement;
</script>

<img
	loading="lazy"
	class="w-full h-full absolute left-0 top-0"
	src={prioritizeUpscaled && generation.upscaledImageUrl
		? generation.upscaledImageUrl
		: generation.imageUrl}
	alt={generation.prompt}
	width={generation.width}
	height={generation.height}
/>
<div
	on:click={(e) => {
		if (doesContainTarget(e.target, [rightButtonContainer])) {
			return;
		}
		if (!generation.imageUrl) {
			generation.imageUrl = urlFromBase64(generation.imageDataB64);
		}
		if (!generation.upscaledImageUrl && generation.upscaledImageDataB64) {
			generation.upscaledImageUrl = urlFromBase64(generation.upscaledImageDataB64);
		}
		activeGeneration.set(generation);
	}}
	class="w-full h-full absolute left-0 top-0 flex flex-col justify-between items-end overflow-hidden gap-4"
>
	<div class="w-full flex justify-between items-start gap-8">
		<div
			class="flex-1 min-w-0 overflow-hidden flex flex-row flex-wrap items-start justify-start gap-1 transition transform 
				-translate-x-full group-focus-within:translate-x-0 group-hover:translate-x-0 p-1.5"
		>
			{#if $advancedMode}
				<div
					class="max-w-full flex items-center text-xs gap-1.5 rounded-lg bg-c-bg pl-2 pr-2.5 py-1.5"
				>
					<IconScale class="w-4 h-4" />
					<p
						class="flex-1 cursor-default whitespace-nowrap flex-shrink min-w-0 overflow-hidden overflow-ellipsis text-left"
					>
						{generation.guidance_scale}
					</p>
				</div>
				<div
					class="max-w-full flex items-center text-xs gap-1.5 rounded-lg bg-c-bg pl-2 pr-2.5 py-1.5"
				>
					<IconSteps class="w-4 h-4" />
					<p
						class="flex-1 cursor-default whitespace-nowrap flex-shrink min-w-0 overflow-hidden overflow-ellipsis text-left"
					>
						{generation.num_inference_steps}
					</p>
				</div>
			{/if}
			{#if generation.duration_ms !== undefined}
				<div
					class="max-w-full flex items-center text-xs gap-1.5 rounded-lg bg-c-bg pl-2 pr-2.5 py-1.5"
				>
					<IconClock class="w-4 h-4" />
					<p
						class="flex-1 cursor-default whitespace-nowrap flex-shrink min-w-0 overflow-hidden overflow-ellipsis text-left"
					>
						{(generation.duration_ms / 1000).toLocaleString('en-US', {
							minimumFractionDigits: 0,
							maximumFractionDigits: 1
						})}s
					</p>
				</div>
			{/if}
		</div>
		<div
			bind:this={rightButtonContainer}
			class="flex flex-row items-end justify-start transition transform 
			translate-x-full group-focus-within:translate-x-0 group-hover:translate-x-0"
		>
			<CopyButton
				class="p-1.5"
				stringToCopy={generation.prompt}
				bind:copied={promptCopied}
				bind:copiedTimeout={promptCopiedTimeout}
			/>
			<DownloadGenerationButton
				class="p-1.5 -ml-1.5"
				url={generation.upscaledImageUrl ?? String(generation.imageUrl)}
				b64={generation.upscaledImageDataB64 ?? generation.imageDataB64}
				prompt={generation.prompt}
				seed={generation.seed}
				guidanceScale={generation.guidance_scale}
				inferenceSteps={generation.num_inference_steps}
			/>
		</div>
	</div>
	<div
		class="w-full max-h-[max(4rem,min(35%,5.3rem))] transition bg-c-bg/90 text-xs relative z-0 overflow-hidden
		translate-y-full group-focus-within:translate-y-0 group-hover:translate-y-0"
	>
		<div
			class="{scrollPrompt
				? 'overflow-auto'
				: 'overflow-hidden'} w-full max-h-full list-fade px-4 py-3 flex flex-col gap-2 cursor-default"
		>
			<p class="w-full font-medium leading-normal transition text-c-on-bg transform">
				{generation.prompt}
			</p>
			{#if generation.negative_prompt !== undefined && generation.negative_prompt !== ''}
				<div class="w-full flex items-start justify-start gap-1.5">
					<IconChatBubbleCancel class="text-c-danger h-4 w-4 mt-0.25" />
					<div class="flex-1 min-w-0">
						<p class="w-full text-c-danger">
							{generation.negative_prompt}
						</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.list-fade {
		mask-image: linear-gradient(to top, transparent, transparent 0.35rem, black 1.1rem);
	}
</style>
