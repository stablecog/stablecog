<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import GenerationGridInfinite from '$components/grids/GenerationGridInfinite.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import SignInCard from '$components/SignInCard.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import {
		getUserGenerationFullOutputs,
		type TUserGenerationFullOutputsPage
	} from '$ts/queries/userGenerations';
	import { activeGeneration } from '$userStores/generation';
	import { createInfiniteQuery, type CreateInfiniteQueryResult } from '@tanstack/svelte-query';

	let totalOutputs: number;

	let userGenerationFullOutputsQuery:
		| CreateInfiniteQueryResult<TUserGenerationFullOutputsPage, unknown>
		| undefined;

	$: userGenerationFullOutputsQuery = $page.data.session?.user.id
		? createInfiniteQuery({
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
		  })
		: undefined;

	$: $userGenerationFullOutputsQuery?.data?.pages, onPagesChanged();

	const onPagesChanged = () => {
		if (!$page.data.session?.user.id || !$userGenerationFullOutputsQuery) return;
		if (!$userGenerationFullOutputsQuery.data?.pages) return;
		for (let i = 0; i < $userGenerationFullOutputsQuery.data.pages.length; i++) {
			let page = $userGenerationFullOutputsQuery.data.pages[i];
			if (page.total_count !== undefined) {
				totalOutputs = page.total_count;
			}
		}
	};

	function onKeyDown({ key }: KeyboardEvent) {
		if ($activeGeneration !== undefined) {
			if (key === 'Escape') {
				activeGeneration.set(undefined);
			}
		}
	}
</script>

<MetaTag
	title="History | Stablecog"
	description="See your generation history on Stablecog (free and multi-lingual AI image generator)."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<svelte:window on:keydown={onKeyDown} />

<div class="w-full flex-1 flex flex-col items-center px-2 gap-2 md:py-6 md:px-8">
	{#if !$page.data.session?.user.id}
		<div class="w-full flex-1 max-w-7xl flex justify-center px-2 py-4 md:py-2">
			<div class="my-auto flex flex-col">
				<SignInCard redirectTo="/history" />
				<div class="w-full h-[1vh]" />
			</div>
		</div>
	{:else}
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
			{#if userGenerationFullOutputsQuery !== undefined}
				{#if $userGenerationFullOutputsQuery?.data?.pages.length === 1 && $userGenerationFullOutputsQuery.data.pages[0].outputs.length === 0}
					<div class="w-full flex-1 flex flex-col items-center py-8 px-5">
						<div class="flex flex-col my-auto items-center gap-6">
							<p class="text-c-on-bg/50">{$LL.History.NoGenerationsYet()}</p>
							<Button href="/">{$LL.Shared.StartGeneratingButton()}</Button>
							<div class="h-[1vh]" />
						</div>
					</div>
				{:else}
					<GenerationGridInfinite
						generationsQuery={userGenerationFullOutputsQuery}
						cardType="history"
					/>
				{/if}
			{/if}
		</div>
	{/if}
</div>

{#if $activeGeneration}
	<GenerationFullScreen generation={$activeGeneration} modalType="history" />
{/if}
