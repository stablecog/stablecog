<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import GenerationGridInfinite from '$components/grids/GenerationGridInfinite.svelte';
	import IconFolderOutlined from '$components/icons/IconFolderOutlined.svelte';
	import IconStarOutlined from '$components/icons/IconStarOutlined.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import SignInCard from '$components/SignInCard.svelte';
	import TabBar from '$components/tabBars/TabBar.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	/* import {
		doesUserHaveLegacyGenerations,
		downloadLegacyGenerations
	} from '$ts/helpers/downloadLegacyGenerations'; */
	import {
		getUserGenerationFullOutputs,
		type TUserGenerationFullOutputsPage
	} from '$ts/queries/userGenerations';
	import {
		isUserGalleryEditActive,
		lastFetchedUserGalleryView,
		userGalleryCurrentView,
		type TUserGalleryView
	} from '$ts/stores/user/gallery';
	import { userGenerationFullOutputsQueryKey } from '$ts/stores/user/keys';
	import type { TTab } from '$ts/types/main';
	import { activeGeneration } from '$userStores/generation';
	import { createInfiniteQuery, type CreateInfiniteQueryResult } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';
	/* import SubtleButton from '$components/buttons/SubtleButton.svelte';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconDownload from '$components/icons/IconDownload.svelte';
	import Morpher from '$components/Morpher.svelte'; */

	let totalOutputs: number;
	/* let hasLegacyGenerations = false;
	let legacyGenerationsDownloadStatus: 'idle' | 'downloading' = 'idle'; */

	let userGenerationFullOutputsQuery:
		| CreateInfiniteQueryResult<TUserGenerationFullOutputsPage, unknown>
		| undefined;

	$: userGenerationFullOutputsQueryKey.set([
		'user_generation_full_outputs',
		$userGalleryCurrentView
	]);
	$: userGenerationFullOutputsQuery = $page.data.session?.user.id
		? createInfiniteQuery({
				queryKey: $userGenerationFullOutputsQueryKey,
				queryFn: (lastPage) => {
					return getUserGenerationFullOutputs({
						access_token: $page.data.session?.access_token || '',
						cursor: lastPage?.pageParam,
						is_favorited: $userGalleryCurrentView === 'favorites'
					});
				},
				getNextPageParam: (lastPage: TUserGenerationFullOutputsPage) => {
					if (!lastPage.next) return undefined;
					return lastPage.next;
				},
				onSuccess: () => {
					lastFetchedUserGalleryView.set($userGalleryCurrentView);
				}
		  })
		: undefined;

	$: $userGenerationFullOutputsQuery?.data?.pages, onPagesChanged();
	$: gridRerenderKey = `user_generation_full_outputs_${$userGalleryCurrentView}_${
		$userGenerationFullOutputsQuery?.isInitialLoading
	}_${$userGenerationFullOutputsQuery?.isStale}_${
		$userGenerationFullOutputsQuery?.data?.pages?.[0]?.outputs &&
		$userGenerationFullOutputsQuery.data.pages[0].outputs.length > 0
			? $userGenerationFullOutputsQuery.data.pages[0].outputs[0].id
			: false
	}`;

	let userGalleryTabs: TTab<TUserGalleryView>[];
	$: userGalleryTabs = [
		{
			label: $LL.History.Views.AllTitle(),
			value: 'all',
			icon: IconFolderOutlined
		},
		{
			label: $LL.History.Views.FavoritesTitle(),
			value: 'favorites',
			icon: IconStarOutlined
		}
	];

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
		/* if (key === 'e') {
			isUserGalleryEditActive.set(!$isUserGalleryEditActive);
		} else  */ if ($activeGeneration !== undefined) {
			if (key === 'Escape') {
				activeGeneration.set(undefined);
			}
		}
	}

	/* async function _downloadLegacyGenerations() {
		if (legacyGenerationsDownloadStatus === 'downloading') return;
		legacyGenerationsDownloadStatus = 'downloading';
		try {
			await downloadLegacyGenerations();
		} catch (error) {
			console.log(error);
		} finally {
			legacyGenerationsDownloadStatus = 'idle';
		}
	} */

	onMount(async () => {
		/* try {
			hasLegacyGenerations = await doesUserHaveLegacyGenerations();
		} catch (error) {
			console.log(error);
			hasLegacyGenerations = false;
		} */
	});
</script>

<MetaTag
	title="History | Stablecog"
	description="See your generation history on Stablecog (free and multi-lingual AI image generator)."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<svelte:window on:keydown={onKeyDown} />

<div class="w-full flex-1 flex flex-col items-center px-1 gap-2 md:py-6 md:px-8">
	{#if !$page.data.session?.user.id}
		<div class="w-full flex-1 max-w-7xl flex justify-center px-2 py-4 md:py-2">
			<div class="my-auto flex flex-col">
				<SignInCard redirectTo="/history" />
				<div class="w-full h-[1vh]" />
			</div>
		</div>
	{:else}
		<div class="w-full max-w-7xl flex justify-center px-1">
			<div class="w-full flex flex-wrap gap-4 items-center justify-between py-2 md:py-3 rounded-xl">
				<div
					class="w-full flex flex-col md:flex-row gap-5 items-start md:items-center justify-start md:justify-between"
				>
					<div class="flex gap-2 items-center px-3 md:px-3">
						<p class="font-bold text-1.5xl md:text-2xl">
							{$userGalleryCurrentView === 'favorites'
								? $LL.History.Views.FavoritesTitle()
								: $LL.History.GenerationsTitle()}
						</p>
						<p class="text-sm md:text-base text-c-on-bg/50 font-semibold mt-0.5 md:mt-1">
							({totalOutputs !== undefined ? totalOutputs.toLocaleString($locale) : '...'})
						</p>
					</div>
					<div
						class="w-full md:w-auto flex flex-1 items-center justify-end gap-4 px-0.5 -mt-1 -mb-2 md:-my-2"
					>
						<TabBar
							dontScale
							hasTitle={false}
							name="Tabs"
							tabs={userGalleryTabs}
							bind:value={$userGalleryCurrentView}
							class="flex-1 md:max-w-[19rem]"
						/>
						<!-- {#if hasLegacyGenerations}
							<SubtleButton
								loading={legacyGenerationsDownloadStatus === 'downloading'}
								onClick={_downloadLegacyGenerations}
								class="-my-1"
							>
								<Morpher morphed={legacyGenerationsDownloadStatus === 'downloading'}>
									<div slot="item-0" class="flex items-center justify-center gap-1.5">
										<IconDownload class="w-5 h-5 -ml-0.5" />
										<p>{$LL.History.DownloadLegacyGenerationsButton()}</p>
									</div>
									<div slot="item-1" class="flex items-center justify-center gap-1.5">
										<IconAnimatedSpinner class="w-5 h-5" />
									</div>
								</Morpher>
							</SubtleButton>
						{/if} -->
					</div>
				</div>
			</div>
		</div>
		<div class="w-full flex-1 max-w-7xl flex flex-col">
			{#if userGenerationFullOutputsQuery !== undefined}
				{#if $userGalleryCurrentView === 'favorites' && $userGenerationFullOutputsQuery?.data?.pages.length === 1 && $userGenerationFullOutputsQuery.data.pages[0].outputs.length === 0}
					<div class="w-full flex-1 flex flex-col items-center py-8 px-5">
						<div class="flex flex-col my-auto items-center gap-4">
							<IconStarOutlined class="w-16 h-16 text-c-on-bg/50" />
							<p class="text-c-on-bg/50 text-center">{$LL.History.NoFavoritesYet()}</p>
							<div class="h-[1vh]" />
						</div>
					</div>
				{:else if $userGenerationFullOutputsQuery?.data?.pages.length === 1 && $userGenerationFullOutputsQuery.data.pages[0].outputs.length === 0}
					<div class="w-full flex-1 flex flex-col items-center py-8 px-5">
						<div class="flex flex-col my-auto items-center gap-6">
							<p class="text-c-on-bg/50 text-center">{$LL.History.NoGenerationsYet()}</p>
							<Button href="/">{$LL.Shared.StartGeneratingButton()}</Button>
							<div class="h-[1vh]" />
						</div>
					</div>
				{:else}
					<GenerationGridInfinite
						rerenderKey={gridRerenderKey}
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
