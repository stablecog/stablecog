<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import Img from '$components/Img.svelte';
	import Divider from '$components/generationFullScreen/Divider.svelte';
	import type { TGenerationFullScreenModalType } from '$components/generationFullScreen/types';
	import SimpleGrid from '$components/grids/SimpleGrid.svelte';
	import LL from '$i18n/i18n-svelte';
	import { getImgProxySrc, getImgProxySrcSet } from '$ts/helpers/imgproxy';
	import {
		logGalleryModalSimilarClicked,
		logUserProfileModalSimilarClicked
	} from '$ts/helpers/loggers';
	import { getGalleryGenerationFullOutputs } from '$ts/queries/galleryLike/galleryGenerations';
	import { getSomeUsersGenerationFullOutputs } from '$ts/queries/galleryLike/someUsersOutputs';
	import { appVersion } from '$ts/stores/appVersion';
	import {
		activeGeneration,
		type TGenerationFullOutput,
		type TGenerationWithSelectedOutput
	} from '$ts/stores/user/generation';
	import { userSummary } from '$ts/stores/user/summary';
	import { createQuery } from '@tanstack/svelte-query';

	export let generation: TGenerationWithSelectedOutput;
	export let modalType: TGenerationFullScreenModalType;
	export let afterClick: () => void;

	$: outputId = generation.selected_output.id;
	let similarOutputs: TGenerationFullOutput[] | undefined;
	const simpleGridCols = 3;
	const similarOutputsCount = 12;

	$: similarOutputsQuery = browser
		? modalType === 'user-profile'
			? createQuery(['other_user_similar_outputs_short', outputId], () => {
					return getSomeUsersGenerationFullOutputs({
						search: outputId,
						per_page: similarOutputsCount + 1,
						username: generation.user.username
					});
			  })
			: createQuery(['gallery_similar_outputs_short', outputId], () => {
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

{#if !similarOutputs || similarOutputs.length > 0}
	<Divider class="lg:-mt-3" />
	<div class="w-full flex flex-col px-2.5 md:px-3.5 lg:px-4 py-5">
		<p class="font-bold text-2xl px-3">{$LL.GenerationFullscreen.SimilarTitle()}</p>
		<div class="w-full flex flex-col mt-3">
			{#if !similarOutputs}
				<SimpleGrid
					cols={simpleGridCols}
					items={Array.from({ length: similarOutputsCount }).map((i) => 1)}
				>
					<div class="w-full p-2px">
						<svg
							class="w-full rounded-xl bg-c-bg-tertiary border-2 border-c-bg-tertiary
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
								'SC - User Id': $page.data.session?.user.id
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
						class="w-full group rounded-xl"
					>
						<div class="w-full p-2px">
							{#key similarOutput.id}
								<div
									class="w-full rounded-xl overflow-hidden relative z-0 border-2 border-c-bg-tertiary
									shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] transition bg-c-bg-tertiary not-touch:group-hover:border-c-primary"
								>
									<Img
										loading="lazy"
										class="w-full h-auto not-touch:group-hover:scale-105 transition duration-350"
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
