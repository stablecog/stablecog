<script lang="ts">
	import LL from '$i18n/i18n-svelte';
	import type { TGenerationFullOutput } from '$ts/stores/user/generation';
	import SimpleGrid from '$components/grids/SimpleGrid.svelte';
	import {
		logOutputPageSimilarClicked,
		logUserProfileExploreSimilarClicked
	} from '$ts/helpers/loggers.js';
	import { appVersion } from '$ts/stores/appVersion.js';
	import { userSummary } from '$ts/stores/user/summary';
	import { getImgProxySrc, getImgProxySrcSet } from '$ts/helpers/imgproxy';
	import Img from '$components/utils/image/Img.svelte';
	import type { TGenerationFullScreenModalType } from '$components/generationFullScreen/types';
	import { sessionStore } from '$ts/constants/supabase';

	export let similarOutputs: TGenerationFullOutput[];
	export let output: TGenerationFullOutput;
	export let modalType: TGenerationFullScreenModalType;

	const simpleGridCols = 3;
</script>

{#if similarOutputs.length > 0}
	<div class="w-full flex flex-col mt-5">
		<p class="max-w-full font-semibold text-3xl">
			{$LL.GenerationFullscreen.SimilarTitle()}
		</p>
		<div class="w-[calc(100%+8px)] flex flex-row justify-start items-start -m-4px mt-3.5">
			<SimpleGrid cols={simpleGridCols} items={similarOutputs} let:item={similarOutput}>
				<a
					on:click={() => {
						const sharedProps = {
							'SC - App Version': $appVersion,
							'SC - Similar to Output Id': output.id,
							'SC - Clicked Output Id': similarOutput.id,
							'SC - Stripe Product Id': $userSummary?.product_id,
							'SC - User Id': $sessionStore?.user.id
						};
						if (modalType === 'user-profile') {
							logUserProfileExploreSimilarClicked(sharedProps);
						} else {
							logOutputPageSimilarClicked(sharedProps);
						}
					}}
					href={modalType === 'user-profile'
						? `/${output.generation.user.username}/o/${similarOutput.id}`
						: `/gallery/o/${similarOutput.id}`}
					data-sveltekit-preload-data="hover"
					class="w-full group"
				>
					<div class="w-full p-2px">
						{#key similarOutput.id}
							<div
								class="w-full rounded-xl overflow-hidden border-2 border-c-bg-secondary relative z-0
                shadow-lg shadow-c-shadow/[var(--o-shadow-stronger)] transition bg-c-bg-secondary not-touch:group-hover:border-c-primary"
							>
								<Img
									loading="lazy"
									class="w-full h-auto not-touch:group-hover:scale-105 transition duration-350"
									sizes={`(min-width: 1024px) calc(28rem / ${simpleGridCols}), calc(min(36rem, 100vw) / ${simpleGridCols})`}
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
		</div>
	</div>
{/if}
