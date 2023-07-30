<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import SimpleGrid from '$components/grids/SimpleGrid.svelte';
	import LL from '$i18n/i18n-svelte';
	import { getImgProxySrc, getImgProxySrcSet } from '$ts/helpers/imgproxy';
	import { logGalleryModalSimilarClicked } from '$ts/helpers/loggers';
	import { getGalleryGenerationFullOutputs } from '$ts/queries/galleryGenerations';
	import { appVersion } from '$ts/stores/appVersion';
	import { activeGeneration, type TGenerationFullOutput } from '$ts/stores/user/generation';
	import { userSummary } from '$ts/stores/user/summary';
	import { createQuery } from '@tanstack/svelte-query';

	export let outputId: string;
	export let afterClick: () => void;

	let similarOutputs: TGenerationFullOutput[] | undefined;
	const simpleGridCols = 3;
	const similarOutputsCount = 12;

	$: similarOutputsQuery = browser
		? createQuery(['similar_outputs', outputId], () => {
				return getGalleryGenerationFullOutputs({
					search: outputId,
					per_page: similarOutputsCount + 1
				});
		  })
		: undefined;

	$: similarOutputs = $similarOutputsQuery?.data?.outputs
		?.filter((o) => o.id !== outputId)
		.slice(0, similarOutputsCount);
</script>

<div class="w-full flex flex-col px-2.5 md:px-3.5 lg:px-4 pt-5 pb-8">
	<p class="font-bold text-2xl px-3">{$LL.GenerationFullscreen.SimilarTitle()}</p>
	<div class="w-full flex flex-col mt-3">
		{#if !similarOutputs}
			<SimpleGrid
				cols={simpleGridCols}
				items={Array.from({ length: similarOutputsCount }).map((i) => 1)}
			>
				<div class="w-full pb-[150%] relative">
					<div class="absolute left-0 top-0 w-full h-full p-2px">
						<div
							class="w-full h-full rounded-xl bg-c-bg-tertiary shadow-lg shadow-c-shadow/[var(--o-shadow-strong)]"
						/>
					</div>
				</div>
			</SimpleGrid>
		{:else}
			<SimpleGrid cols={simpleGridCols} items={similarOutputs} let:item={similarOutput}>
				<button
					on:click={() => {
						logGalleryModalSimilarClicked({
							'SC - App Version': $appVersion,
							'SC - Similar to Output Id': outputId,
							'SC - Clicked Output Id': similarOutput.id,
							'SC - Stripe Product Id': $userSummary?.product_id,
							'SC - User Id': $page.data.session?.user.id
						});
						afterClick();
						activeGeneration.set({
							...similarOutput.generation,
							selected_output: similarOutput
						});
					}}
					class="w-full group rounded-xl"
				>
					<div class="w-full p-2px">
						{#key similarOutput.id}
							<img
								loading="lazy"
								class="w-full h-auto rounded-xl overflow-hidden border-2 border-c-bg-tertiary
                shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] transition bg-c-bg-tertiary not-touch:group-hover:border-c-primary"
								sizes={`(min-width: 1024px) calc(400px / ${simpleGridCols}), calc(min(700px, 100vw) / ${simpleGridCols})`}
								src={getImgProxySrc({
									src: similarOutput.upscaled_image_url ?? similarOutput.image_url,
									preset: '256w'
								})}
								srcset={getImgProxySrcSet({
									src: similarOutput.upscaled_image_url ?? similarOutput.image_url
								})}
								width={similarOutput.generation.width}
								height={similarOutput.generation.height}
								alt={similarOutput.generation.prompt.text}
							/>
						{/key}
					</div>
				</button>
			</SimpleGrid>
		{/if}
	</div>
</div>
