<script lang="ts">
	import { page } from '$app/stores';
	import CopyButton from '$components/buttons/CopyButton.svelte';
	import GenerateButton from '$components/buttons/GenerateButton.svelte';
	import IconChatBubbleCancel from '$components/icons/IconChatBubbleCancel.svelte';
	import IconScale from '$components/icons/IconScale.svelte';
	import IconSteps from '$components/icons/IconSteps.svelte';

	import { doesContainTarget } from '$ts/helpers/doesContainTarget';
	import { galleryPreviewUrlFromGenerationId } from '$ts/helpers/galleryPreviewUrlFromGenerationId';
	import { isValue } from '$ts/helpers/isValue';
	import { urlFromImageId } from '$ts/helpers/urlFromImageId';
	import { activeGenerationG } from '$ts/stores/activeGenerationG';
	import type { TGenerationGWithLoaded } from '$ts/types/main';

	export let generation: TGenerationGWithLoaded;

	let promptCopied = false;
	let promptCopiedTimeout: NodeJS.Timeout;
	let rightButtonContainer: HTMLDivElement;
	let loaded = false;

	let imgElement: HTMLImageElement | undefined;
	$: [imgElement], onLoad();
	const onLoad = () => {
		if (imgElement && imgElement?.naturalWidth > 0) {
			loaded = true;
			setTimeout(() => {
				generation.didLoadBefore = true;
			}, 500);
		}
	};
</script>

<img
	loading="lazy"
	bind:this={imgElement}
	on:load={onLoad}
	class="w-full h-full absolute left-0 top-0 transition duration-500 {loaded ||
	generation.didLoadBefore
		? 'opacity-100'
		: 'opacity-0'}"
	src={urlFromImageId(generation.image_id)}
	alt={generation.prompt.text}
	width={generation.width}
	height={generation.height}
/>
<a
	href="/gallery?generation={generation.id}"
	on:click|preventDefault={(e) => {
		if (doesContainTarget(e.target, [rightButtonContainer])) {
			return;
		}
		fetch(galleryPreviewUrlFromGenerationId(generation.id));
		activeGenerationG.set(generation);
		window.history.replaceState({}, '', `/gallery?generation=${generation.id}`);
	}}
	class="w-full h-full absolute left-0 top-0 flex flex-col justify-end items-end overflow-hidden gap-4"
>
	<div
		class="w-full max-h-[max(4rem,min(35%,5.3rem))] transition bg-c-bg/90 text-xs relative z-0 overflow-hidden
		translate-y-full group-focus-within:translate-y-0 group-hover:translate-y-0 pointer-events-none"
	>
		<div
			class="w-full max-h-full overflow-hidden list-fade px-4 py-3 flex flex-col gap-2 cursor-default"
		>
			<p class="w-full font-medium leading-normal transition text-c-on-bg transform">
				{generation.prompt.text}
			</p>
			{#if isValue(generation.negative_prompt)}
				<div class="w-full flex items-start justify-start gap-1.5">
					<IconChatBubbleCancel class="text-c-danger h-4 w-4 mt-0.25" />
					<div class="flex-1 min-w-0">
						<p class="w-full text-c-danger">
							{generation.negative_prompt?.text}
						</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
</a>
<div class="w-full absolute left-0 top-0 flex flex-col justify-start pointer-events-none">
	<div class="w-full flex justify-between items-start gap-8">
		<div
			class="flex-1 min-w-0 overflow-hidden flex flex-row flex-wrap items-start justify-start gap-1 transition transform 
				-translate-x-full group-focus-within:translate-x-0 group-hover:translate-x-0 p-1.5"
		>
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
					{generation.inference_steps}
				</p>
			</div>
		</div>
		<div
			bind:this={rightButtonContainer}
			class="flex flex-row items-end justify-start transition transform 
			translate-x-full group-focus-within:translate-x-0 group-hover:translate-x-0 pointer-events-auto"
		>
			<CopyButton
				class="p-1.5 -mr-1.5"
				stringToCopy={generation.prompt.text}
				bind:copied={promptCopied}
				bind:copiedTimeout={promptCopiedTimeout}
			/>
			<GenerateButton class="p-1.5" {generation} />
		</div>
	</div>
</div>

<style>
	.list-fade {
		mask-image: linear-gradient(to top, transparent, transparent 0.35rem, black 1.1rem);
	}
</style>
