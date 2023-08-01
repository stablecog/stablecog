<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import IconSearch from '$components/icons/IconSearch.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { globalSeed } from '$ts/stores/globalSeed';
	import { activeGeneration } from '$ts/stores/user/generation';
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import SearchAndFilterBar from '$components/SearchAndFilterBar.svelte';
	import IconSadFace from '$components/icons/IconSadFace.svelte';
	import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
	import { setActiveGenerationToOutputIndex } from '$ts/helpers/goToOutputIndex';
	import GenerationGridInfinite2 from '$components/grids/GenerationGridInfinite2.svelte';
	import { windowWidth } from '$ts/stores/window';
	import {
		lgBreakpoint,
		mdBreakpoint,
		xlBreakpoint,
		xxlBreakpoint
	} from '$components/generationFullScreen/constants';
	import { getOtherUserProfileInfiniteQueryProps } from '$routes/(app)/user/[username]/constants.js';
	import Avatar from '$components/avatar/Avatar.svelte';
	import IconBirthday from '$components/icons/IconBirthday.svelte';
	import IconStar from '$components/icons/IconStar.svelte';
	import { getTitleFromProductId } from '$ts/helpers/stripe/plan.js';
	import IconHeart from '$components/icons/IconHeart.svelte';
	import { userSummary } from '$ts/stores/user/summary.js';
	import { goto } from '$app/navigation';
	import IconPen from '$components/icons/IconPen.svelte';
	import WithChangeUsernameModal from '$components/WithChangeUsernameModal.svelte';
	import NoBgButton from '$components/buttons/NoBgButton.svelte';
	import { getPreviewImageUrlForUserProfile } from '$ts/helpers/getPreviewImageUrl.js';

	export let data;
	const { searchQuery: searchQueryParam } = data;

	let searchString = searchQueryParam ?? '';

	let modelIdFilters: TAvailableGenerationModelId[] = data.modelIds ?? [];

	$: galleryGenerationFullOutputsQuery = browser
		? createInfiniteQuery(
				getOtherUserProfileInfiniteQueryProps({
					searchString,
					modelIdFilters,
					seed: $globalSeed,
					username: data.username
				})
		  )
		: undefined;

	$: outputs = $galleryGenerationFullOutputsQuery?.data?.pages.flatMap((page) => page.outputs);
	$: outputIndex = outputs
		? outputs.findIndex((g) => g.id === $activeGeneration?.selected_output.id)
		: -1;
	$: leftIndex = outputIndex > 0 ? outputIndex - 1 : -1;
	$: rightIndex = outputs && outputIndex < outputs?.length - 1 ? outputIndex + 1 : -1;

	function setSearchQuery(query: string) {
		searchString = query;
	}

	function onKeyDown({ key }: KeyboardEvent) {
		if (!$activeGeneration) return;
		if (key === 'Escape') {
			activeGeneration.set(undefined);
			return;
		}
		if (key === 'ArrowLeft' && leftIndex !== -1) {
			setActiveGenerationToOutputIndex(outputs, leftIndex);
			return;
		}
		if (key === 'ArrowRight' && rightIndex !== -1) {
			setActiveGenerationToOutputIndex(outputs, rightIndex);
			return;
		}
	}

	$: dateFormatter = new Intl.DateTimeFormat($locale, {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
</script>

<MetaTag
	title="@{data.username} | Stablecog"
	description="Check out the profile of @{data.username} on Stablecog: Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	image_url={getPreviewImageUrlForUserProfile(data.username)}
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<svelte:window on:keydown={onKeyDown} />

<div class="w-full px-1 flex-1 flex flex-col items-center md:pt-4.5">
	<div class="w-full max-w-3xl flex flex-col items-center">
		<div
			class="w-full flex-shrink min-w-0 flex flex-col items-center gap-2 px-4 md:px-3 py-2 md:py-3"
		>
			<Avatar
				class="w-16 h-16 ring-2 ring-c-on-bg/25 rounded-full transition transform flex-shrink-0
					relative shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] items-center justify-center overflow-hidden"
				text={data.username}
			/>
			<div class="w-full flex justify-center items-center">
				{#if data.username === $userSummary?.username}
					<WithChangeUsernameModal
						afterUsernameChanged={(username) => goto(`/user/${username}`)}
						let:trigger
					>
						<NoBgButton {trigger} class="mt-0">
							<div class="flex items-center justify-center gap-2.5 -mx-0.5 -my-0.5">
								<p
									class="max-w-full text-c-on-bg font-bold text-2xl md:text-3xl flex-shrink min-w-0 transition
								whitespace-nowrap overflow-hidden overflow-ellipsis not-touch:group-hover:text-c-primary"
								>
									<span
										class="text-c-on-bg/50 not-touch:group-hover:text-c-primary/50 transition font-semibold"
										>@</span
									>{data.username}
								</p>
								<IconPen
									class="w-5 h-5 text-c-on-bg/50 not-touch:group-hover:text-c-primary/50 transition relative"
								/>
							</div>
						</NoBgButton>
					</WithChangeUsernameModal>
				{:else}
					<div class="flex items-center justify-center gap-3 py-3">
						<p
							class="max-w-full text-c-on-bg font-bold text-2xl md:text-3xl flex-shrink min-w-0 transition
							whitespace-nowrap overflow-hidden overflow-ellipsis not-touch:group-hover:text-c-primary"
						>
							<span
								class="text-c-on-bg/50 not-touch:group-hover:text-c-primary/50 transition font-semibold"
								>@</span
							>{data.username}
						</p>
					</div>
				{/if}
			</div>
		</div>
		<div class="w-full flex flex-wrap items-center justify-center gap-3 px-2">
			<div
				class="flex items-center justify-center gap-1.5 ring-2
				px-3 py-1 rounded-lg bg-c-primary/15 ring-c-primary/30"
			>
				{#if data.userMetadata.active_product_id}
					<IconStar class="w-5 h-5 -ml-1 flex-shrink-0 text-c-primary" />
				{:else}
					<IconHeart class="w-5 h-5 -ml-1 flex-shrink-0 text-c-primary" />
				{/if}
				<p
					class="font-medium flex flex-shrink min-w-0 overflow-ellipsis overflow-hidden text-c-primary"
				>
					{getTitleFromProductId($LL, data.userMetadata.active_product_id)}
				</p>
			</div>
			<div
				class="flex items-center justify-center gap-1.5 bg-c-bg-secondary ring-2 ring-c-bg-tertiary
				px-3 py-1 rounded-lg"
			>
				<IconBirthday class="w-5 h-5 -ml-1 flex-shrink-0 text-c-on-bg/75" />
				<p
					class="font-medium flex flex-shrink min-w-0 text-c-on-bg/75 overflow-ellipsis overflow-hidden"
				>
					{dateFormatter.format(new Date(data.userMetadata.created_at))}
				</p>
			</div>
		</div>
	</div>
	<div class="w-full px-1 py-1 md:py-2 flex justify-center mt-7">
		<div class="w-full flex max-w-3xl justify-center">
			<SearchAndFilterBar bind:modelIdFilters bind:searchString />
		</div>
	</div>
	<div class="w-full pb-3 pt-1 md:pt-3 relative flex flex-col flex-1">
		{#if $galleryGenerationFullOutputsQuery?.isInitialLoading}
			<div
				class="w-full flex flex-col text-c-on-bg/60 flex-1 py-6 px-4 justify-center items-center text-center"
			>
				<div
					in:scale={{
						duration: 200,
						easing: quadOut,
						opacity: 0,
						start: 0.5
					}}
					class="w-12 h-12"
				>
					<IconAnimatedSpinner class="w-full h-full" />
				</div>
				<p class="mt-2 opacity-0">
					{$LL.Gallery.SearchingTitle()}
				</p>
				<div class="h-[2vh]" />
			</div>
		{:else if $galleryGenerationFullOutputsQuery?.isError || ($galleryGenerationFullOutputsQuery?.data && !$galleryGenerationFullOutputsQuery?.data?.pages)}
			<div class="w-full flex-1 flex flex-col items-center py-8 px-5">
				<div class="flex flex-col my-auto items-center gap-2">
					<IconSadFace class="w-16 h-16 text-c-on-bg/50" />
					<p class="text-c-on-bg/50">{$LL.Error.SomethingWentWrong()}</p>
				</div>
			</div>
		{:else if $galleryGenerationFullOutputsQuery?.data?.pages.length === 1 && $galleryGenerationFullOutputsQuery.data.pages[0].outputs.length === 0}
			<div
				class="w-full flex flex-col text-c-on-bg/60 flex-1 py-6 px-4 justify-center items-center text-center"
			>
				<div class="w-16 h-16">
					<IconSearch class="w-full h-full" />
				</div>
				<p class="mt-2">
					{$LL.Gallery.NoMatchingGenerationTitle()}
				</p>
				<div class="h-[2vh]" />
			</div>
		{:else if galleryGenerationFullOutputsQuery !== undefined && $windowWidth}
			<div class="w-full flex-1 mt-1 md:mt-0.5 flex flex-col">
				<GenerationGridInfinite2
					cardType="other-user-profile"
					generationsQuery={galleryGenerationFullOutputsQuery}
					cols={$windowWidth >= xxlBreakpoint
						? 6
						: $windowWidth >= xlBreakpoint
						? 5
						: $windowWidth >= lgBreakpoint
						? 4
						: $windowWidth >= mdBreakpoint
						? 3
						: 2}
					{setSearchQuery}
				/>
			</div>
		{/if}
	</div>
</div>

{#if $activeGeneration && $galleryGenerationFullOutputsQuery?.isInitialLoading === false}
	<GenerationFullScreen
		onLeftButtonClicked={leftIndex !== -1
			? () => setActiveGenerationToOutputIndex(outputs, leftIndex)
			: undefined}
		onRightButtonClicked={rightIndex !== -1
			? () => setActiveGenerationToOutputIndex(outputs, rightIndex)
			: undefined}
		generation={$activeGeneration}
		{setSearchQuery}
		modalType="other-user-profile"
	/>
{/if}
