<script lang="ts">
	import CopyButton from '$components/buttons/CopyButton.svelte';
	import DownloadGenerationButton from '$components/buttons/DownloadGenerationButton.svelte';
	import IconChatBubbleCancel from '$components/icons/IconChatBubbleCancel.svelte';
	import IconClock from '$components/icons/IconClock.svelte';
	import IconCopy from '$components/icons/IconCopy.svelte';
	import IconScale from '$components/icons/IconScale.svelte';
	import IconSeed from '$components/icons/IconSeed.svelte';
	import IconSteps from '$components/icons/IconSteps.svelte';
	import IconTickOnly from '$components/icons/IconTickOnly.svelte';
	import { advancedMode } from '$ts/stores/advancedMode';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { TGenerationBase } from '$ts/types/main';
	import { copy } from 'svelte-copy';

	export let generation: TGenerationBase;
	export let src: string;

	let seedCopied = false;
	let seedCopiedTimeout: NodeJS.Timeout;
	let promptCopied = false;
	let promptCopiedTimeout: NodeJS.Timeout;
	let seedButtonElement: HTMLButtonElement;

	const onSeedCopy = () => {
		seedCopied = true;
		seedButtonElement.blur();
		clearTimeout(seedCopiedTimeout);
		seedCopiedTimeout = setTimeout(() => {
			seedCopied = false;
		}, 2000);
		clearTimeout(promptCopiedTimeout);
		promptCopied = false;
	};
</script>

<img
	class="w-full h-full absolute left-0 top-0"
	{src}
	alt={generation.prompt}
	width={generation.width}
	height={generation.height}
/>
<div
	class="w-full h-full absolute left-0 top-0 flex flex-col justify-between items-end gap-5 overflow-hidden"
>
	<div class="w-full flex justify-between">
		<div
			class="flex-1 min-w-0 overflow-hidden flex flex-col items-start justify-start gap-1 transition transform 
				-translate-x-full group-focus-within:translate-x-0 group-hover:translate-x-0 p-1.5"
		>
			{#if $advancedMode}
				<button
					bind:this={seedButtonElement}
					use:copy={generation.seed.toString()}
					on:svelte-copy={onSeedCopy}
					class="max-w-full flex items-center text-c-on-bg text-xs gap-1.5 rounded-lg bg-c-bg 
					pl-2 pr-2.5 py-1.5 overflow-hidden relative z-0 group-2"
				>
					<IconSeed class="w-4 h-4 relative" />
					<p class="flex-1 flex-shrink min-w-0 overflow-hidden overflow-ellipsis relative">
						{generation.seed}
					</p>
					<div
						class="w-full h-full absolute left-0 top-0 pointer-events-none 
						transition rounded-lg {!$isTouchscreen ? 'bg-c-bg' : ''} {seedCopied
							? 'opacity-100 translate-x-0'
							: !$isTouchscreen
							? 'opacity-0 -translate-x-[20%] group-2-hover:translate-x-0 group-2-hover:opacity-100'
							: ''}"
					>
						{#if !$isTouchscreen}
							<div
								class="w-full h-full absolute left-0 top-0 rounded-md flex items-center transition justify-center
								{seedCopied ? 'scale-x-75 scale-y-25 opacity-0' : 'scale-100 opacity-100'} bg-c-primary transform"
							>
								<div class="w-5 h-5 relative">
									<IconCopy
										class="w-full h-full absolute left-0 top-0 transition text-c-on-primary"
									/>
								</div>
							</div>
						{/if}
						<div
							class="w-full h-full absolute left-0 top-0 rounded-md transition
							{!seedCopied ? 'scale-x-75 scale-y-25 opacity-0' : 'scale-100 opacity-100'} p-0.75 transform"
						>
							<div class="w-full h-full bg-c-success rounded-md flex items-center justify-center">
								<div class="w-5 h-5 relative">
									<IconTickOnly
										class="w-full h-full absolute left-0 top-0 transition text-c-on-primary"
									/>
								</div>
							</div>
						</div>
					</div>
				</button>
				<div
					class="max-w-full flex items-center text-xs gap-1.5 rounded-lg bg-c-bg pl-2 pr-2.5 py-1.5"
				>
					<IconScale class="w-4 h-4" />
					<p class="flex-1 flex-shrink min-w-0 overflow-hidden overflow-ellipsis">
						{generation.guidance_scale}
					</p>
				</div>
				<div
					class="max-w-full flex items-center text-xs gap-1.5 rounded-lg bg-c-bg pl-2 pr-2.5 py-1.5"
				>
					<IconSteps class="w-4 h-4" />
					<p class="flex-1 flex-shrink min-w-0 overflow-hidden overflow-ellipsis">
						{generation.num_inference_steps}
					</p>
				</div>
			{/if}
			{#if generation.duration_ms !== undefined}
				<div
					class="max-w-full flex items-center text-xs gap-1.5 rounded-lg bg-c-bg pl-2 pr-2.5 py-1.5"
				>
					<IconClock class="w-4 h-4" />
					<p class="flex-1 flex-shrink min-w-0 overflow-hidden overflow-ellipsis">
						{(generation.duration_ms / 1000).toLocaleString('en-US', {
							minimumFractionDigits: 0,
							maximumFractionDigits: 1
						})}s
					</p>
				</div>
			{/if}
		</div>
		<div
			class="flex flex-col items-end justify-start transition transform 
			translate-x-full group-focus-within:translate-x-0 group-hover:translate-x-0"
		>
			<DownloadGenerationButton
				class="p-1.5"
				url={src}
				prompt={generation.prompt}
				seed={generation.seed}
				guidanceScale={generation.guidance_scale}
				inferenceSteps={generation.num_inference_steps}
			/>
			<CopyButton
				class="p-1.5 -mt-1.5"
				stringToCopy={generation.prompt}
				bind:copied={promptCopied}
				bind:copiedTimeout={promptCopiedTimeout}
				onCopied={() => {
					clearTimeout(seedCopiedTimeout);
					seedCopied = false;
				}}
			/>
		</div>
	</div>
	<div
		class="w-full max-h-[35%] transition bg-c-bg/90 text-xs relative z-0 overflow-hidden
		translate-y-full group-focus-within:translate-y-0 group-hover:translate-y-0"
	>
		<div class="w-full max-h-full overflow-auto list-fade px-4 py-3 flex flex-col gap-2">
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
