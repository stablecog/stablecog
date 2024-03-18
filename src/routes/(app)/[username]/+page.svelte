<script lang="ts">
	import { page } from '$app/stores';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import IconSearch from '$components/icons/IconSearch.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { activeGeneration, type TGenerationFullOutput } from '$ts/stores/user/generation';
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import SearchAndFilterBar from '$components/galleryLike/SearchAndFilterBar.svelte';
	import IconSadFace from '$components/icons/IconSadFace.svelte';
	import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
	import { setActiveGenerationToOutputIndex } from '$ts/helpers/goToOutputIndex';
	import GenerationGridInfinite from '$components/grids/GenerationGridInfinite.svelte';
	import { windowWidth } from '$ts/stores/window';
	import {
		lgBreakpoint,
		mdBreakpoint,
		xlBreakpoint,
		xl2Breakpoint,
		xl3Breakpoint
	} from '$components/generationFullScreen/constants';
	import Avatar from '$components/avatar/Avatar.svelte';
	import IconBirthday from '$components/icons/IconBirthday.svelte';
	import IconStar from '$components/icons/IconStar.svelte';
	import { getTitleFromProductId } from '$ts/helpers/stripe/plan.js';
	import IconHeart from '$components/icons/IconHeart.svelte';
	import { userSummary } from '$ts/stores/user/summary.js';
	import { goto } from '$app/navigation';
	import IconPen from '$components/icons/IconPen.svelte';
	import WithChangeUsernameModal from '$components/utils/WithChangeUsernameModal.svelte';
	import NoBgButton from '$components/primitives/buttons/NoBgButton.svelte';
	import { getPreviewImageUrlForUserProfile } from '$ts/helpers/getPreviewImageUrl.js';
	import { getImgProxySrc } from '$ts/helpers/imgproxy.js';
	import { someUserProfileFullOutputsQueryKey } from '$ts/stores/user/queryKeys.js';
	import IconFreePlan from '$components/icons/IconFreePlan.svelte';
	import {
		getSomeUserProfileInfiniteQueryKey,
		getSomeUserProfileInfiniteQueryProps,
		someUserGalleryAspectRatioFilters,
		someUserGalleryModelIdFilters,
		someUserGallerySearchString
	} from '$routes/(app)/[username]/constants.js';
	import ProfileCardBadge from '$routes/(app)/[username]/ProfileCardBadge.svelte';
	import { hydrated } from '$ts/stores/hydrated.js';
	import { sessionStore } from '$ts/constants/supabase';

	export let data;

	if (!hydrated) {
		someUserGalleryModelIdFilters.set(data.modelIdFilters);
		someUserGalleryAspectRatioFilters.set(data.aspectRatioFilters);
		someUserGallerySearchString.set(data.searchString);
	}

	$: someUserProfileFullOutputsQueryKey.set(
		getSomeUserProfileInfiniteQueryKey({
			searchString: $someUserGallerySearchString,
			modelIdFilters: $someUserGalleryModelIdFilters,
			aspectRatioFilters: $someUserGalleryAspectRatioFilters,
			username: data.username
		})
	);

	$: galleryGenerationFullOutputsQuery = createInfiniteQuery(
		getSomeUserProfileInfiniteQueryProps({
			searchString: $someUserGallerySearchString,
			modelIdFilters: $someUserGalleryModelIdFilters,
			aspectRatioFilters: $someUserGalleryAspectRatioFilters,
			username: data.username,
			accessToken: $sessionStore?.access_token
		})
	);

	let initialFirstOutput: TGenerationFullOutput;
	let isFirstSet = false;
	let cardBgNaturalWidth: number;
	$: outputs = $galleryGenerationFullOutputsQuery?.data?.pages
		.flatMap((page) => page.outputs)
		.filter((i) => i !== undefined);
	$: outputs, setInitialFirstOutput();
	$: outputIndex = outputs
		? outputs.findIndex((g) => g.id === $activeGeneration?.selected_output.id)
		: -1;
	$: leftIndex = outputIndex > 0 ? outputIndex - 1 : -1;
	$: rightIndex = outputs && outputIndex < outputs?.length - 1 ? outputIndex + 1 : -1;

	function setSearchQuery(query: string) {
		someUserGallerySearchString.set(query);
	}

	function setInitialFirstOutput() {
		if (outputs && outputs.length > 0 && !isFirstSet) {
			initialFirstOutput = outputs[0];
			isFirstSet = true;
		}
	}

	function onKeyDown({ key }: KeyboardEvent) {
		if (!$activeGeneration) return;
		if (key === 'Escape') {
			activeGeneration.set(undefined);
			window.history.back();
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

	$: numberFormatter = new Intl.NumberFormat($locale, {
		style: 'decimal',
		notation: 'compact',
		maximumFractionDigits: 1
	});

	$: likes = data.userMetadata.likes;

	function onLikesChanged({
		newLikeCount,
		newIsLikedByUser,
		action
	}: {
		newLikeCount: number;
		newIsLikedByUser: boolean;
		action: 'like' | 'unlike';
	}) {
		if (data.userMetadata.username === $userSummary?.username) return;
		if (action === 'like') {
			likes++;
		} else {
			likes--;
		}
	}
</script>

<MetaTag
	title="@{data.username} | Stablecog"
	description="Check out the profile of @{data.username} on Stablecog: Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	image_url={getPreviewImageUrlForUserProfile(data.username)}
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<svelte:window on:keydown={onKeyDown} />

<div class="flex w-full flex-1 flex-col items-center px-1 md:pt-4">
	<div class="flex w-full justify-center px-1">
		<div
			class="relative z-0 mt-3 flex w-full max-w-3xl flex-col
			overflow-hidden rounded-2xl border-2 border-c-bg-secondary bg-c-bg-secondary shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]"
		>
			<div
				class="absolute left-0 top-0 z-0 flex h-full w-full items-center justify-center overflow-hidden pl-16"
			>
				{#if initialFirstOutput}
					<img
						class="h-auto min-h-full w-full scale-110 blur-xl filter transition ease-in {cardBgNaturalWidth
							? 'opacity-100'
							: 'opacity-0'}"
						src={getImgProxySrc({
							src: initialFirstOutput.image_url,
							preset: '32w'
						})}
						width={initialFirstOutput.generation.width}
						height={initialFirstOutput.generation.height}
						bind:naturalWidth={cardBgNaturalWidth}
						alt="Profile Background"
					/>
				{:else if $galleryGenerationFullOutputsQuery?.isSuccess}
					<div
						class="h-full w-full bg-gradient-to-br
						from-c-primary via-c-secondary to-c-primary"
					/>
				{/if}
			</div>
			<div
				class="relative flex w-full flex-col bg-gradient-to-r from-c-bg-secondary from-[5rem]
				to-c-bg-secondary/0 px-2 py-4 md:px-5 md:pb-7 md:pt-6.5"
			>
				<div
					class="relative flex w-full min-w-0 flex-shrink flex-col items-start justify-start gap-2 px-2"
				>
					<Avatar
						class="relative h-14 w-14 flex-shrink-0 transform items-center justify-center overflow-hidden rounded-full shadow-lg
						shadow-c-shadow/[var(--o-shadow-stronger)] ring-2 ring-c-on-bg/25 transition md:h-16 md:w-16"
						text={data.username}
					/>
					<div class="-mt-0.75 flex w-full items-center justify-start">
						{#if data.username === $userSummary?.username}
							<WithChangeUsernameModal
								afterUsernameChanged={(username) => goto(`/${username}`)}
								let:trigger
							>
								<NoBgButton {trigger} class="-mx-3.5 mt-0" hoverFrom="left">
									<div
										class="-mx-0.5 -my-1 flex min-w-0 flex-shrink items-center justify-center gap-2.5"
									>
										<h1
											class="min-w-0 max-w-full flex-shrink overflow-hidden overflow-ellipsis whitespace-nowrap text-3xl font-bold
											text-c-on-bg transition not-touch:group-hover:text-c-primary md:text-4xl"
										>
											<span
												class="font-semibold text-c-on-bg/50 transition not-touch:group-hover:text-c-primary/50"
												>@</span
											>{data.username}
										</h1>
										<IconPen
											class="relative h-5 w-5 text-c-on-bg/50 transition not-touch:group-hover:text-c-primary/50"
										/>
									</div>
								</NoBgButton>
							</WithChangeUsernameModal>
						{:else}
							<div class="flex min-w-0 flex-shrink items-center justify-start gap-3 py-3">
								<h1
									class="min-w-0 max-w-full flex-shrink overflow-hidden overflow-ellipsis whitespace-nowrap text-3xl font-bold
									text-c-on-bg transition not-touch:group-hover:text-c-primary md:text-4xl"
								>
									<span
										class="font-semibold text-c-on-bg/50 transition not-touch:group-hover:text-c-primary/50"
										>@</span
									>{data.username}
								</h1>
							</div>
						{/if}
					</div>
				</div>
				<div
					class="relative mt-2 flex w-full flex-wrap items-center justify-start gap-3 px-2 md:mt-2.5"
				>
					<ProfileCardBadge
						icon={data.userMetadata.active_product_id ? IconStar : IconFreePlan}
						text={getTitleFromProductId($LL, data.userMetadata.active_product_id)}
						type="primary"
					/>
					<ProfileCardBadge icon={IconHeart} text={numberFormatter.format(likes)} />
					<ProfileCardBadge
						icon={IconBirthday}
						text={dateFormatter.format(new Date(data.userMetadata.created_at))}
					/>
				</div>
			</div>
		</div>
	</div>
	<div class="mt-2 flex w-full justify-center px-1 py-1 md:mt-3.5 md:py-2">
		<div class="flex w-full max-w-3xl justify-center">
			<SearchAndFilterBar
				bind:modelIdFilters={$someUserGalleryModelIdFilters}
				bind:searchString={$someUserGallerySearchString}
				bind:aspectRatioFilters={$someUserGalleryAspectRatioFilters}
			/>
		</div>
	</div>
	<div class="relative flex w-full flex-1 flex-col pb-3 pt-1 md:pt-3">
		{#if $galleryGenerationFullOutputsQuery?.isInitialLoading}
			<div
				class="flex w-full flex-1 flex-col items-center justify-center px-4 py-6 text-center text-c-on-bg/60"
			>
				<div
					in:scale={{
						duration: 200,
						easing: quadOut,
						opacity: 0,
						start: 0.5
					}}
					class="h-12 w-12"
				>
					<IconAnimatedSpinner class="h-full w-full" />
				</div>
				<p class="mt-2 opacity-0">
					{$LL.Gallery.SearchingTitle()}
				</p>
				<div class="h-[2vh]" />
			</div>
		{:else if $galleryGenerationFullOutputsQuery?.isError || ($galleryGenerationFullOutputsQuery?.data && !$galleryGenerationFullOutputsQuery?.data?.pages)}
			<div class="flex w-full flex-1 flex-col items-center px-5 py-8">
				<div class="my-auto flex flex-col items-center gap-2">
					<IconSadFace class="h-16 w-16 text-c-on-bg/50" />
					<p class="text-c-on-bg/50">{$LL.Error.SomethingWentWrong()}</p>
				</div>
			</div>
		{:else if $galleryGenerationFullOutputsQuery?.data?.pages.length === 1 && $galleryGenerationFullOutputsQuery.data.pages[0].outputs.length === 0}
			<div
				class="flex w-full flex-1 flex-col items-center justify-center px-4 py-6 text-center text-c-on-bg/60"
			>
				<div class="h-16 w-16">
					<IconSearch class="h-full w-full" />
				</div>
				<p class="mt-2">
					{$LL.Gallery.NoMatchingGenerationTitle()}
				</p>
				<div class="h-[2vh]" />
			</div>
		{:else if galleryGenerationFullOutputsQuery !== undefined && $windowWidth}
			<div class="mt-1 flex w-full flex-1 flex-col md:mt-0.5">
				<GenerationGridInfinite
					cardType="user-profile"
					generationsQuery={galleryGenerationFullOutputsQuery}
					cols={$windowWidth > xl3Breakpoint
						? 7
						: $windowWidth > xl2Breakpoint
							? 6
							: $windowWidth > xlBreakpoint
								? 5
								: $windowWidth > lgBreakpoint
									? 4
									: $windowWidth > mdBreakpoint
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
		{onLikesChanged}
		modalType="user-profile"
	/>
{/if}
