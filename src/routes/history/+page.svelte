<script lang="ts">
	import { page } from '$app/stores';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import GenerationGridInfinite from '$components/grids/GenerationGridInfinite.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import {
		getUserGenerationFullOutputs,
		type TUserGenerationFullOutputsPage
	} from '$ts/queries/userGenerations';
	import { activeGeneration } from '$ts/stores/generation';
	import { createInfiniteQuery } from '@tanstack/svelte-query';

	let totalOutputs: number;

	$: userGenerationFullOutputsQuery = createInfiniteQuery({
		queryKey: ['user_generation_full_outputs'],
		queryFn: (lastPage) => {
			return getUserGenerationFullOutputs({
				access_token: $page.data.session?.access_token || '',
				cursor: lastPage?.pageParam
			});
		},
		getNextPageParam: (lastPage: TUserGenerationFullOutputsPage) => {
			if (!lastPage.next) return undefined;
			return lastPage.next;
		}
	});

	$: $userGenerationFullOutputsQuery.data?.pages, onPagesChanged();

	const onPagesChanged = () => {
		if (!$userGenerationFullOutputsQuery.data?.pages) return;
		for (let i = 0; i < $userGenerationFullOutputsQuery.data.pages.length; i++) {
			let page = $userGenerationFullOutputsQuery.data.pages[i];
			if (page.total_count !== undefined) {
				totalOutputs = page.total_count;
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

<div class="w-full flex-1 flex flex-col items-center px-2 gap-2 md:py-6 md:px-8">
	<div class="w-full max-w-7xl flex justify-center px-1.5">
		<div class="w-full flex flex-wrap gap-4 items-center px-2 py-2 md:px-4 md:py-3 rounded-xl">
			<div class="flex gap-2 items-center">
				<p class="font-bold text-xl md:text-2xl">
					{$LL.History.GenerationsTitle()}
				</p>
				<p class="text-sm md:text-base text-c-on-bg/50 font-semibold mt-0.5 md:mt-1">
					({totalOutputs !== undefined ? totalOutputs : '...'})
				</p>
			</div>
		</div>
	</div>
	<div class="w-full flex-1 max-w-7xl flex flex-col">
		<GenerationGridInfinite generationsQuery={userGenerationFullOutputsQuery} />
	</div>
</div>

{#if $activeGeneration}
	<GenerationFullScreen generation={$activeGeneration} />
{/if}
