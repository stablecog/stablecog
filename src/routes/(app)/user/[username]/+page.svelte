<script lang="ts">
	import { page } from '$app/stores';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import IconSearch from '$components/icons/IconSearch.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { globalSeed } from '$ts/stores/globalSeed';
	import { activeGeneration, type TGenerationFullOutput } from '$ts/stores/user/generation';
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import SearchAndFilterBar from '$components/SearchAndFilterBar.svelte';
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
	import {
		getSomeUserProfileInfiniteQueryKey,
		getSomeUserProfileInfiniteQueryProps
	} from '$routes/(app)/user/[username]/constants.js';
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
	import { getImgProxySrc } from '$ts/helpers/imgproxy.js';
	import { someUserProfileFullOutputsQueryKey } from '$ts/stores/user/queryKeys.js';
	import IconFreePlan from '$components/icons/IconFreePlan.svelte';
	import ProfileCardBadge from '$routes/(app)/user/[username]/ProfileCardBadge.svelte';

	export let data;
	const { searchQuery: searchQueryParam } = data;

	let searchString = searchQueryParam ?? '';

	let modelIdFilters: TAvailableGenerationModelId[] = data.modelIds ?? [];

	$: someUserProfileFullOutputsQueryKey.set(
		getSomeUserProfileInfiniteQueryKey({
			searchString,
			modelIdFilters,
			username: data.username
		})
	);

	$: galleryGenerationFullOutputsQuery = createInfiniteQuery(
		getSomeUserProfileInfiniteQueryProps({
			searchString,
			modelIdFilters,
			username: data.username,
			accessToken: $page.data.session?.access_token
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
		searchString = query;
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

<div class="w-full px-1 flex-1 flex flex-col items-center md:pt-4">
	<div class="w-full px-1 flex justify-center">
		<div
			class="w-full max-w-3xl flex flex-col bg-c-bg-secondary shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]
			rounded-2xl mt-3 relative z-0 overflow-hidden border-2 border-c-bg-secondary"
		>
			<div
				class="w-full h-full pl-16 absolute left-0 top-0 flex items-center justify-center overflow-hidden z-0"
			>
				{#if initialFirstOutput}
					<img
						class="w-full h-auto min-h-full filter blur-xl scale-110 transition ease-in {cardBgNaturalWidth
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
						class="w-full h-full bg-gradient-to-br
						from-c-primary via-c-secondary to-c-primary"
					/>
				{/if}
			</div>
			<div
				class="w-full flex flex-col relative bg-gradient-to-r from-[5rem] from-c-bg-secondary
				to-c-bg-secondary/0 px-2 py-4 md:px-5 md:pt-6.5 md:pb-7"
			>
				<div class="w-full flex-shrink min-w-0 flex flex-col items-start gap-2 px-2 relative">
					<Avatar
						class="w-14 h-14 md:w-16 md:h-16 ring-2 ring-c-on-bg/25 rounded-full transition transform flex-shrink-0
						relative shadow-lg shadow-c-shadow/[var(--o-shadow-stronger)] items-center justify-center overflow-hidden"
						text={data.username}
					/>
					<div class="w-full flex justify-start items-center -mt-0.75 md:-mt-0.25">
						{#if data.username === $userSummary?.username}
							<WithChangeUsernameModal
								afterUsernameChanged={(username) => goto(`/user/${username}`)}
								let:trigger
							>
								<NoBgButton {trigger} class="mt-0 -mx-3.5" hoverFrom="left">
									<div
										class="flex flex-shrink min-w-0 items-center justify-center gap-2.5 -mx-0.5 -my-0.5"
									>
										<h1
											class="max-w-full text-c-on-bg font-bold text-3xl md:text-4xl flex-shrink min-w-0 transition
											whitespace-nowrap overflow-hidden overflow-ellipsis not-touch:group-hover:text-c-primary"
										>
											<span
												class="text-c-on-bg/50 not-touch:group-hover:text-c-primary/50 transition font-semibold"
												>@</span
											>{data.username}
										</h1>
										<IconPen
											class="w-5 h-5 text-c-on-bg/50 not-touch:group-hover:text-c-primary/50 transition relative"
										/>
									</div>
								</NoBgButton>
							</WithChangeUsernameModal>
						{:else}
							<div class="flex-shrink min-w-0 flex items-center justify-start gap-3 py-3">
								<h1
									class="max-w-full text-c-on-bg font-bold text-3xl md:text-4xl flex-shrink min-w-0 transition
									whitespace-nowrap overflow-hidden overflow-ellipsis not-touch:group-hover:text-c-primary"
								>
									<span
										class="text-c-on-bg/50 not-touch:group-hover:text-c-primary/50 transition font-semibold"
										>@</span
									>{data.username}
								</h1>
							</div>
						{/if}
					</div>
				</div>
				<div
					class="w-full flex flex-wrap items-center justify-start gap-3 px-2 mt-2 md:mt-2.5 relative"
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
	<div class="w-full px-1 py-1 md:py-2 flex justify-center mt-2 md:mt-3.5">
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
				<GenerationGridInfinite
					{onLikesChanged}
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
