<script lang="ts">
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	import GenerationImage from '$components/generationImage/GenerationImage.svelte';
	import GenerationAnimation from '$components/grids/GenerationAnimation.svelte';
	import LL from '$i18n/i18n-svelte';
	import type { TUserGenerationFullOutputsPage } from '$ts/queries/userGenerations';
	import type { TGenerationFullOutput } from '$ts/stores/user/generation';
	import type { CreateInfiniteQueryResult } from '@tanstack/svelte-query';
	import { quadIn, quadOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	export let generationsQuery: CreateInfiniteQueryResult<TUserGenerationFullOutputsPage, unknown>;
	export let pinnedFullOutputs: TGenerationFullOutput[] | undefined = undefined;

	$: outputs = $generationsQuery.data?.pages
		? [
				...(pinnedFullOutputs ?? []),
				...$generationsQuery.data?.pages.flatMap((page) => page.outputs)
		  ]
		: undefined;
</script>

<div class="w-full h-full overflow-auto flex flex-row hide-scrollbar">
	<div class="h-full flex flex-row py-2 pl-2 pr-16 gap-1">
		{#if outputs}
			{#each outputs as output}
				{@const status = output.status}
				{@const animation = output.animation}
				<div class="w-12 h-full relative group overflow-hidden">
					<ImagePlaceholder width={output.generation.width} height={output.generation.height} />
					<div
						class="absolute left-0 top-0 w-full h-full bg-c-bg-secondary transition border-2 border-c-bg-secondary rounded-lg hover:border-c-primary
            z-0 overflow-hidden shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]"
					>
						{#if output.generation.outputs !== undefined}
							{#if status !== 'failed' && status !== 'failed-nsfw'}
								{#if status !== undefined && status !== 'succeeded' && animation !== undefined}
									<div
										out:fade|local={{ duration: 3000, easing: quadIn }}
										class="w-full h-full absolute left-0 top-0"
									>
										<GenerationAnimation {animation} />
									</div>
								{/if}
								{#if status === undefined || status === 'succeeded'}
									<GenerationImage
										cardType="create"
										useUpscaledImage={false}
										generation={{
											...output.generation,
											selected_output: output
										}}
									/>
								{/if}
							{:else}
								<div
									in:fade|local={{ duration: 200, easing: quadOut }}
									class="w-full h-full flex items-center bg-c-bg-secondary justify-center relative"
								>
									<p class="text-sm text-c-on-bg/50 px-5 py-3 text-center leading-relaxed">
										{status === 'failed-nsfw'
											? $LL.Error.ImageWasNSFW()
											: $LL.Error.SomethingWentWrong()}
									</p>
								</div>
							{/if}
						{/if}
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
