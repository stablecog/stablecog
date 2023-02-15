<script lang="ts">
	import { page } from '$app/stores';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import GenerationGridInfinite from '$components/GenerationGridInfinite.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import {
		getUserGenerations,
		type TUserGenerationOutputsWithGenerationsPage
	} from '$ts/queries/userGenerations';
	import { activeGeneration, activeGenerationOutputIndex } from '$ts/stores/generation';
	import { createInfiniteQuery } from '@tanstack/svelte-query';

	let totalGenerations: number;

	$: userGenerationsQuery = createInfiniteQuery({
		queryKey: ['user_generations'],
		queryFn: (lastPage) => {
			return getUserGenerations({
				access_token: $page.data.session?.access_token || '',
				cursor: lastPage?.pageParam
			});
		},
		getNextPageParam: (lastPage: TUserGenerationOutputsWithGenerationsPage) => {
			if (!lastPage.next) return undefined;
			return lastPage.next;
		}
	});

	$: $userGenerationsQuery.data?.pages, onPagesChanged();

	const onPagesChanged = () => {
		if (!$userGenerationsQuery.data?.pages) return;
		for (let i = 0; i < $userGenerationsQuery.data.pages.length; i++) {
			let page = $userGenerationsQuery.data.pages[i];
			if (page.total_count !== undefined) {
				totalGenerations = page.total_count;
			}
		}
	};
</script>

<MetaTag
	title="History | Stablecog"
	description="See your generation history on Stablecog (free and multi-lingual AI image generator)."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex-1 flex flex-col items-center px-2 gap-2 md:pt-6 pb-8 md:px-8">
	<div class="w-full max-w-7xl flex justify-center px-1.5">
		<div class="w-full flex flex-wrap gap-4 items-center px-2 py-2 md:px-4 md:py-3 rounded-xl">
			<div class="flex gap-2 items-center">
				<p class="font-bold text-xl md:text-2xl">
					{$LL.History.GenerationsTitle()}
				</p>
				<p class="text-sm md:text-base text-c-on-bg/50 font-semibold mt-0.5 md:mt-1">
					({totalGenerations !== undefined ? totalGenerations : '...'})
				</p>
			</div>
		</div>
	</div>
	<div class="w-full flex-1 max-w-7xl flex flex-col">
		<GenerationGridInfinite generationsQuery={userGenerationsQuery} />
	</div>
</div>

{#if $activeGeneration && $activeGenerationOutputIndex !== undefined}
	<GenerationFullScreen
		generation={$activeGeneration}
		generationOutputIndex={$activeGenerationOutputIndex}
	/>
{/if}
