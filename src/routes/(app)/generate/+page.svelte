<script lang="ts">
	import { browser } from '$app/environment';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import SettingsPanel from '$components/generate/SettingsPanel.svelte';
	import { activeGeneration, generations, type TGeneration } from '$ts/stores/user/generation';
	import { onMount, tick } from 'svelte';
	import PromptBar from '$components/generate/PromptBar.svelte';
	import { quadOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { page } from '$app/stores';
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import { generatePageHistoryFullOutputsQueryKey } from '$ts/stores/user/queryKeys.js';
	import { windowWidth } from '$ts/stores/window';
	import SidebarWrapper from '$components/generate/SidebarWrapper.svelte';
	import GenerationStage from '$components/generate/GenerationStage.svelte';
	import { generationAspectRatio, generationNumOutputs } from '$ts/stores/generationSettings.js';
	import { generateSSEId } from '$ts/helpers/generateSSEId.js';
	import { generationModelIdDefault, generationModels } from '$ts/constants/generationModels.js';
	import { schedulerIdDefault } from '$ts/constants/schedulers.js';
	import type { TIsReadyMap } from '$components/generate/types.js';
	import {
		lgBreakpoint,
		mdBreakpoint,
		xlBreakpoint
	} from '$components/generationFullScreen/constants.js';
	import GenerateHorizontalList from '$components/generate/GenerateHorizontalList.svelte';
	import LL from '$i18n/i18n-svelte.js';
	import GenerateGridPlaceholder from '$components/generate/GenerateGridPlaceholder.svelte';
	import GenerateHorizontalListPlaceholder from '$components/generate/GenerateHorizontalListPlaceholder.svelte';
	import { expandCollapse } from '$ts/animation/transitions.js';
	import { userSummary } from '$ts/stores/user/summary.js';
	import LowOnCreditsCard from '$components/cards/LowOnCreditsCard.svelte';
	import { removeRepeatingOutputs } from '$ts/helpers/removeRepeatingOutputs.js';
	import GenerationSettingsProvider from '$components/generate/GenerationSettingsProvider.svelte';
	import { heightDefault, widthDefault } from '$ts/constants/generationSize.js';
	import { setActiveGenerationToOutputIndex } from '$ts/helpers/goToOutputIndex.js';
	import GenerationGridInfinite from '$components/grids/GenerationGridInfinite.svelte';
	import AutoSize from '$components/utils/AutoSize.svelte';
	import { canonicalUrl } from '$ts/constants/main.js';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import SidebarCollapseButton from '$components/generate/SidebarCollapseButton.svelte';
	import { isLeftSidebarHidden, isLeftSidebarHiddenApp } from '$ts/stores/sidebars.js';
	import { previewImageVersion } from '$ts/constants/previewImageVersion.js';
	import { goto } from '$app/navigation';
	import { lowOnCreditsThreshold } from '$ts/constants/credits.js';
	import SettingsSheet from '$components/generate/SettingsSheet.svelte';
	import { isSignInModalOpen } from '$ts/stores/isSignInModalOpen.js';
	import { writable } from 'svelte/store';
	import WithChangeUsernameModal from '$components/utils/WithChangeUsernameModal.svelte';
	import InpaintingCanvas from '$components/canvas/inpainting/InpaintingCanvas.svelte';
	import { generateMode } from '$ts/stores/generate/generateMode.js';
	import { baseOutputForInpainting } from '$components/canvas/stores/baseOutputForInpainting.js';
	import { sessionStore } from '$ts/constants/supabase';
	import { getModelPreviewImageUrl } from '$ts/helpers/getPreviewImageUrl.js';
	import { metaDescriptionDefault } from '$ts/constants/meta.js';
	import { getHistoryFullOutputs } from '$ts/queries/galleryLike/historyOutputs.js';
	import type { TGalleryFullOutputsPage } from '$ts/queries/galleryLike/types.js';

	export let data;

	let isJustCreatedGenerationForAnim = false;
	let promptBarHeight: number;
	let stageWidth: number;
	let stageHeight: number;
	let horizontalListHeightEstimatedRem = 4.6;
	let horizontalListHeight: number;
	let promptBarEstimatedHeightRem = 3.275;
	let gridScrollContainer: HTMLDivElement;
	let listScrollContainer: HTMLDivElement;
	let listScrollContainerMd: HTMLDivElement;
	let isReadyMap: TIsReadyMap = {
		promptBar: false,
		generationStage: false,
		generationSettings: false
	};
	let isGenerationSettingsSheetOpen = false;
	const userGalleryCurrentView: string = 'all';

	$: isCheckCompleted =
		isReadyMap.generationSettings && isReadyMap.generationStage && isReadyMap.promptBar;

	$: generatePageHistoryFullOutputsQueryKey.set([
		'user_generation_full_outputs',
		userGalleryCurrentView,
		'',
		''
	]);

	$: historyFullOutputsQueryKey =
		$sessionStore?.user.id && $userSummary
			? createInfiniteQuery({
					queryKey: $generatePageHistoryFullOutputsQueryKey,
					queryFn: async ({ pageParam }) => {
						let outputsPage = await getHistoryFullOutputs({
							access_token: $sessionStore?.access_token || '',
							cursor: pageParam !== undefined ? String(pageParam) : undefined
						});
						return outputsPage;
					},
					getNextPageParam: (lastPage: TGalleryFullOutputsPage) => {
						if (!lastPage.next) return undefined;
						return lastPage.next;
					},
					initialPageParam: undefined
				})
			: undefined;

	$: pinnedFullOutputs = [...$generations]
		.map((g) => ({
			...g,
			outputs: [
				...[
					...g.outputs.filter(
						(o) =>
							o.status !== 'failed-nsfw' &&
							o.status !== 'failed-nsfw-prompt' &&
							o.status !== 'failed'
					)
				].reverse(),
				...g.outputs.filter(
					(o) =>
						o.status === 'failed-nsfw' || o.status === 'failed' || o.status === 'failed-nsfw-prompt'
				)
			]
		}))
		.filter((g) => g.status !== 'pre-submit')
		.flatMap((g) => g.outputs.map((o) => ({ ...o, generation: g })));

	$: historyOutputs = $historyFullOutputsQueryKey?.data?.pages?.flatMap((p) => p.outputs);

	$: generateAllSucceededOutputs = historyOutputs
		? removeRepeatingOutputs({
				outputsPinned: pinnedFullOutputs,
				outputs: historyOutputs,
				onlySucceeded: true
			})
		: undefined;

	$: activeGenerationOutputs = $activeGeneration?.outputs.map((o) => ({
		...o,
		generation: $activeGeneration!
	}));

	let generationPlaceholder: TGeneration = {
		is_placeholder: true,
		ui_id: generateSSEId(),
		submit_to_gallery: false,
		width: Number(widthDefault),
		height: Number(heightDefault),
		prompt: {
			id: '1',
			text: 'placeholder prompt'
		},
		negative_prompt: {
			id: '1',
			text: 'placeholder negative prompt'
		},
		created_at: '',
		guidance_scale: 1,
		inference_steps: 1,
		model_id: generationModelIdDefault,
		scheduler_id: schedulerIdDefault,
		seed: 1,
		num_outputs: Number($generationNumOutputs),
		status: 'pre-submit',
		outputs: Array.from({ length: Number($generationNumOutputs) }).map((i) => ({
			id: '',
			image_url: '',
			is_public: false,
			was_auto_submitted: false,
			like_count: 0
		})),
		user: {
			username: $userSummary?.username || ''
		}
	};

	if ($generations && $generations.length === 0) {
		generations.update((gs) => [generationPlaceholder, ...gs]);
	}

	$: [$generationNumOutputs, $generationAspectRatio], addNewGenerationToGenerations();

	$: outputs =
		$activeGeneration?.card_type === 'generate'
			? generateAllSucceededOutputs
			: activeGenerationOutputs;
	$: outputIndex = outputs
		? outputs.findIndex((g) => g.id === $activeGeneration?.selected_output.id)
		: -1;
	$: leftIndex = outputIndex > 0 ? outputIndex - 1 : -1;
	$: rightIndex = outputs && outputIndex < outputs?.length - 1 ? outputIndex + 1 : -1;

	function openSignInModal() {
		isSignInModalOpen.set(true);
	}

	function onKeyDown({ key }: KeyboardEvent) {
		if ($activeGeneration === undefined) return;
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

	function addNewGenerationToGenerations() {
		if (!isCheckCompleted) return;
		const gen0Status =
			$generations && $generations[0] && $generations[0].status
				? $generations[0].status
				: undefined;
		if (gen0Status === 'pre-submit') return;
		generations.update((gs) => [generationPlaceholder, ...gs]);
	}

	function closeSettingsSheet() {
		isGenerationSettingsSheetOpen = false;
	}

	function toggleSettingsSheet(state?: boolean) {
		if (state !== undefined) {
			isGenerationSettingsSheetOpen = state;
			return;
		}
		isGenerationSettingsSheetOpen = !isGenerationSettingsSheetOpen;
	}

	function afterGenerate() {
		closeSettingsSheet();
		resetPlaceholderUiId();
	}

	function resetPlaceholderUiId() {
		generationPlaceholder.ui_id = generateSSEId();
	}

	const confirmOtherEmailHash =
		'#message=Confirmation+link+accepted.+Please+proceed+to+confirm+link+sent+to+the+other+email';

	onMount(() => {
		if ($page.url.hash === confirmOtherEmailHash) {
			goto('/account/change-email?confirm_other_email=true');
		}
		if (data.is_sign_in_modal_open) {
			tick();
			setTimeout(() => {
				openSignInModal();
			});
		}
	});

	const isSetUsernameModalOpen = writable(false);
	$: $userSummary, onUserSummaryChanged();

	function onUserSummaryChanged() {
		if (!browser) return;
		if (!$userSummary) return;
		if ($userSummary.username_changed_at !== undefined) return;
		isSetUsernameModalOpen.set(true);
	}

	$: meta = {
		title:
			data.model_id !== null && generationModels[data.model_id]?.name
				? `Generate with ${generationModels[data.model_id].name} | Stablecog`
				: 'Generate | Stablecog',
		description:
			data.model_id !== null && generationModels[data.model_id]?.name
				? `Create AI art with ${
						generationModels[data.model_id].name
					} on Stablecog: Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky.`
				: metaDescriptionDefault,
		image_url: data.model_id
			? getModelPreviewImageUrl(data.model_id)
			: `${canonicalUrl}/previews/home-${previewImageVersion}.png`
	};
</script>

<MetaTag {...meta} />

<svelte:window on:keydown={onKeyDown} />

<GenerationSettingsProvider serverData={data} bind:isReadyMap let:supportedSchedulerIdDropdownItems>
	<div class="relative z-0 flex h-full w-full flex-col overflow-hidden">
		<div
			class="flex h-full w-full flex-row gap-4 overflow-hidden pt-1 md:px-4 md:pb-[calc(env(safe-area-inset-bottom)+1rem)] md:pt-2"
		>
			<div class="relative hidden h-full min-w-[2rem] flex-col items-start lg:flex">
				{#if !$isLeftSidebarHiddenApp}
					<div
						transition:fly={{
							duration: 250,
							x: $windowWidth > xlBreakpoint ? -200 : -100,
							easing: quadOut
						}}
						class="relative z-10 flex h-full w-36 xl:w-72"
					>
						<!-- Desktop Sidebar -->
						<SidebarWrapper hasGradient>
							{#if !$sessionStore?.user.id || !$userSummary}
								<GenerateGridPlaceholder text={$LL.Generate.Grid.NotSignedIn.Paragraph()} />
							{:else if historyFullOutputsQueryKey}
								<AutoSize bind:element={gridScrollContainer} let:clientWidth let:clientHeight>
									{#if $windowWidth > lgBreakpoint && gridScrollContainer}
										<GenerationGridInfinite
											paddingLeft={6}
											paddingRight={6}
											paddingTop={6}
											paddingBottom={6}
											hasExtraPadding
											{pinnedFullOutputs}
											noLoadingSpinnerAlignmentAdjustment
											hasPlaceholder
											cardType="generate"
											generationsQuery={historyFullOutputsQueryKey}
											cols={$windowWidth > xlBreakpoint ? 3 : 2}
											{gridScrollContainer}
											gridScrollContainerWidth={clientWidth}
											gridScrollContainerHeight={clientHeight}
											hasGridScrollContainer
										/>
									{/if}
								</AutoSize>
							{/if}
						</SidebarWrapper>
					</div>
				{/if}
				<SidebarCollapseButton
					side="left"
					isClosed={$isLeftSidebarHiddenApp}
					onClick={() => {
						const val = !$isLeftSidebarHiddenApp;
						isLeftSidebarHiddenApp.set(val);
						isLeftSidebarHidden.set(val);
					}}
				/>
			</div>
			<div class="relative flex h-full min-w-0 flex-1 flex-col items-center">
				{#if $windowWidth < mdBreakpoint && isGenerationSettingsSheetOpen}
					<div
						transition:fade={{ duration: 200, easing: quadOut }}
						class="fixed left-0 top-0 z-40 h-full w-full bg-c-barrier/70"
					/>
				{/if}
				<div use:clickoutside={{ callback: closeSettingsSheet }}>
					<SettingsSheet
						{promptBarEstimatedHeightRem}
						{horizontalListHeightEstimatedRem}
						{promptBarHeight}
						{horizontalListHeight}
						{openSignInModal}
						{isCheckCompleted}
						isOpen={isGenerationSettingsSheetOpen}
						{supportedSchedulerIdDropdownItems}
					/>
					<!-- Prompt bar -->
					<div
						class="absolute bottom-0 left-0 z-50 order-2 flex w-full flex-col overflow-hidden rounded-2xl bg-transparent md:bottom-auto md:top-0
								md:overflow-visible md:rounded-none md:bg-transparent {isGenerationSettingsSheetOpen &&
						$windowWidth < mdBreakpoint
							? 'pointer-events-none'
							: 'pointer-events-auto'}"
					>
						<div
							bind:clientHeight={horizontalListHeight}
							class="w-full transform bg-c-bg pb-0.5 transition duration-300 md:hidden {isGenerationSettingsSheetOpen
								? 'pointer-events-none translate-y-full opacity-0'
								: 'pointer-events-auto'}"
						>
							<div class="flex h-16 w-full flex-col">
								<AutoSize
									bind:element={listScrollContainer}
									hideScroll
									let:clientWidth
									let:clientHeight
								>
									{#if !$sessionStore?.user.id || !$userSummary}
										<GenerateHorizontalListPlaceholder
											text={$LL.Generate.Grid.NotSignedIn.Paragraph()}
										/>
									{:else if historyFullOutputsQueryKey}
										{#if $windowWidth < mdBreakpoint && listScrollContainer}
											<GenerateHorizontalList
												{listScrollContainer}
												listScrollContainerWidth={clientWidth}
												listScrollContainerHeight={clientHeight}
												paddingX={8}
												paddingY={6}
												{pinnedFullOutputs}
												generationsQuery={historyFullOutputsQueryKey}
												cardType="generate"
											/>
										{/if}
									{/if}
								</AutoSize>
							</div>
						</div>
						<div
							bind:clientHeight={promptBarHeight}
							class="pointer-events-auto z-50 flex w-full bg-c-bg pb-[calc(env(safe-area-inset-bottom)+0.75rem)]
							pl-2 md:bg-transparent md:pl-0"
						>
							<PromptBar
								{openSignInModal}
								serverData={data}
								{afterGenerate}
								{toggleSettingsSheet}
								bind:isReadyMap
								bind:isGenerationSettingsSheetOpen
								bind:isJustCreatedGenerationForAnim
							/>
						</div>
					</div>
				</div>
				<div
					class="relative z-0 order-first flex w-full min-w-0 flex-1
					flex-col pb-[calc(env(safe-area-inset-bottom)+10.5rem)] md:pb-0 md:pt-25 lg:pb-8"
				>
					<div class="flex w-full min-w-0 flex-1 flex-col items-center justify-center">
						{#if $sessionStore?.user.id && $userSummary && $userSummary.total_remaining_credits < lowOnCreditsThreshold}
							<div
								transition:expandCollapse={{ duration: 200 }}
								class="flex w-full flex-col items-center justify-start"
							>
								<div class="px-2.5 py-2px pb-6 md:px-2px">
									<LowOnCreditsCard />
								</div>
							</div>
						{/if}
						<div class="flex min-h-0 w-full min-w-0 flex-1 flex-col px-2 lg:px-6">
							{#if $baseOutputForInpainting && $generateMode === 'inpainting'}
								<InpaintingCanvas baseOutput={$baseOutputForInpainting} />
							{:else}
								<div
									bind:clientWidth={stageWidth}
									bind:clientHeight={stageHeight}
									class="w-full min-w-0 flex-1"
								>
									{#if stageWidth && stageHeight}
										{#key $generations[0].ui_id}
											<GenerationStage
												generation={$generations[0]}
												{stageWidth}
												{stageHeight}
												bind:isReadyMap
											/>
										{/key}
									{/if}
								</div>
							{/if}
						</div>
					</div>
					<div class="hidden w-full pt-11 md:flex lg:hidden">
						<SidebarWrapper borderSize="sm">
							<div class="flex h-20 w-full flex-col">
								{#if !$sessionStore?.user.id || !$userSummary}
									<GenerateHorizontalListPlaceholder
										text={$LL.Generate.Grid.NotSignedIn.Paragraph()}
									/>
								{:else if historyFullOutputsQueryKey}
									<AutoSize
										bind:element={listScrollContainerMd}
										hideScroll
										let:clientWidth
										let:clientHeight
									>
										{#if listScrollContainerMd && $windowWidth >= mdBreakpoint && $windowWidth < lgBreakpoint}
											<GenerateHorizontalList
												listScrollContainer={listScrollContainerMd}
												listScrollContainerWidth={clientWidth}
												listScrollContainerHeight={clientHeight}
												{pinnedFullOutputs}
												generationsQuery={historyFullOutputsQueryKey}
												cardType="generate"
												paddingX={6}
												paddingY={6}
											/>
										{/if}
									</AutoSize>
								{/if}
							</div>
						</SidebarWrapper>
					</div>
				</div>
			</div>
			<div class="hidden h-full w-72 md:flex">
				<SettingsPanel {openSignInModal} {isCheckCompleted} {supportedSchedulerIdDropdownItems} />
			</div>
		</div>
	</div>

	{#if $activeGeneration}
		<GenerationFullScreen
			onLeftButtonClicked={leftIndex !== -1
				? () => setActiveGenerationToOutputIndex(outputs, leftIndex)
				: undefined}
			onRightButtonClicked={rightIndex !== -1
				? () => setActiveGenerationToOutputIndex(outputs, rightIndex)
				: undefined}
			generation={$activeGeneration}
			modalType="generate"
		/>
	{/if}

	{#if $isSetUsernameModalOpen}
		<WithChangeUsernameModal type="set" isOpen={isSetUsernameModalOpen} />
	{/if}
</GenerationSettingsProvider>
