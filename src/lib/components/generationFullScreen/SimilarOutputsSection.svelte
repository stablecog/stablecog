<script lang="ts">
	import { browser } from '$app/environment';
	import Img from '$components/utils/image/Img.svelte';
	import Divider from '$components/generationFullScreen/Divider.svelte';
	import type { TGenerationFullScreenModalType } from '$components/generationFullScreen/types';
	import SimpleGrid from '$components/grids/SimpleGrid.svelte';
	import LL from '$i18n/i18n-svelte';
	import { getImgProxySrc, getImgProxySrcSet } from '$ts/helpers/imgproxy';
	import {
		logGalleryModalSimilarClicked,
		logUserProfileModalSimilarClicked
	} from '$ts/helpers/loggers';
	import { getGalleryFullOutputs } from '$ts/queries/galleryLike/galleryOutputs';
	import { getUserProfileFullOutputs } from '$ts/queries/galleryLike/userProfileOutputs';
	import { appVersion } from '$ts/stores/appVersion';
	import {
		activeGeneration,
		type TGenerationFullOutput,
		type TGenerationWithSelectedOutput
	} from '$ts/stores/user/generation';
	import { userSummary } from '$ts/stores/user/summary';
	import { createQuery } from '@tanstack/svelte-query';
	import { sessionStore } from '$ts/constants/supabase';

	export let generation: TGenerationWithSelectedOutput;
	export let modalType: TGenerationFullScreenModalType;
	export let afterClick: () => void;

	$: outputId = generation.selected_output.id;
	let similarOutputs: TGenerationFullOutput[] | undefined;
	const simpleGridCols = 3;
	const similarOutputsCount = 12;

	$: similarOutputsQuery = browser
		? modalType === 'user-profile'
			? createQuery({
					queryKey: ['user_profile_similar_outputs_short', outputId],
					queryFn: () => {
						return getUserProfileFullOutputs({
							search: outputId,
							per_page: similarOutputsCount + 1,
							username: generation.user.username
						});
					}
				})
			: createQuery({
					queryKey: ['gallery_similar_outputs_short', outputId],
					queryFn: () => {
						return getGalleryFullOutputs({
							search: outputId,
							per_page: similarOutputsCount + 1
						});
					}
				})
		: undefined;

	$: similarOutputs = $similarOutputsQuery?.data?.outputs
		?.filter((o) => o.id !== outputId)
		.slice(0, similarOutputsCount);
</script>

{#if !similarOutputs || similarOutputs.length > 0}
	<Divider class="lg:-mt-3" />
	<div class="flex w-full flex-col px-2.5 py-5 md:px-3.5 lg:px-4">
		<p class="px-3 text-2xl font-bold">{$LL.GenerationFullscreen.SimilarTitle()}</p>
		<div class="mt-3 flex w-full flex-col">
			{#if !similarOutputs}
				<SimpleGrid
					cols={simpleGridCols}
					items={Array.from({ length: similarOutputsCount }).map((i) => 1)}
				>
					<div class="w-full p-2px">
						<svg
							class="w-full rounded-xl border-2 border-c-bg-tertiary bg-c-bg-tertiary
							shadow-lg shadow-c-shadow/[var(--o-shadow-strong)]"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 512 768"
						/>
					</div>
				</SimpleGrid>
			{:else}
				<SimpleGrid cols={simpleGridCols} items={similarOutputs} let:item={similarOutput}>
					<a
						data-sveltekit-preload-data="hover"
						href={`${
							modalType === 'user-profile' ? `/${generation.user.username}` : '/gallery'
						}/o/${similarOutput.id}`}
						on:click|preventDefault={() => {
							const logParams = {
								'SC - App Version': $appVersion,
								'SC - Similar to Output Id': outputId,
								'SC - Clicked Output Id': similarOutput.id,
								'SC - Stripe Product Id': $userSummary?.product_id,
								'SC - User Id': $sessionStore?.user.id
							};
							if (modalType === 'user-profile') {
								logUserProfileModalSimilarClicked(logParams);
							} else {
								logGalleryModalSimilarClicked(logParams);
							}
							afterClick();
							activeGeneration.set({
								...similarOutput.generation,
								selected_output: similarOutput
							});
						}}
						class="group w-full rounded-xl"
					>
						<div class="w-full p-2px">
							{#key similarOutput.id}
								<div
									class="relative z-0 w-full overflow-hidden rounded-xl border-2 border-c-bg-tertiary
									bg-c-bg-tertiary shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] transition not-touch:group-hover:border-c-primary"
								>
									<Img
										loading="lazy"
										class="h-auto w-full transition duration-350 not-touch:group-hover:scale-105"
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
										fade
									/>
								</div>
							{/key}
						</div>
					</a>
				</SimpleGrid>
			{/if}
		</div>
	</div>
{/if}
