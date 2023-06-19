<script lang="ts">
	import { browser } from '$app/environment';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import SettingsPanel from '$components/generate/SettingsPanel.svelte';
	import { activeGeneration, generations, type TGeneration } from '$ts/stores/user/generation';

	import { onMount, tick } from 'svelte';
	import PromptBar from '$components/generate/PromptBar.svelte';
	import { quadOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import { portal } from 'svelte-portal';
	import { clickoutside } from '$ts/actions/clickoutside';
	import SignInCard from '$components/SignInCard.svelte';
	import { page } from '$app/stores';
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import {
		getUserGenerationFullOutputs,
		type TUserGenerationFullOutputsPage
	} from '$ts/queries/userGenerations';
	import { generatePageUserGenerationFullOutputsQueryKey } from '$ts/stores/user/keys';
	import { windowWidth } from '$ts/stores/window';
	import SidebarWrapper from '$components/generate/SidebarWrapper.svelte';
	import GenerationStage from '$components/generate/GenerationStage.svelte';
	import { generationAspectRatio, generationNumOutputs } from '$ts/stores/generationSettings.js';
	import { generateSSEId } from '$ts/helpers/generateSSEId.js';
	import { generationModelIdDefault } from '$ts/constants/generationModels.js';
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
	import LowOnCreditsCard from '$components/LowOnCreditsCard.svelte';
	import { removeRepeatingOutputs } from '$ts/helpers/removeRepeatingOutputs.js';
	import GenerationSettingsProvider from '$components/generate/GenerationSettingsProvider.svelte';
	import { heightDefault, widthDefault } from '$ts/constants/generationSize.js';
	import { setActiveGenerationToOutputIndex } from '$ts/helpers/goToOutputIndex.js';
	import GenerationGridInfinite2 from '$components/grids/GenerationGridInfinite2.svelte';
	import AutoSize from '$components/AutoSize.svelte';
	import { canonicalUrl } from '$ts/constants/main.js';
	import MetaTag from '$components/MetaTag.svelte';
	import SidebarCollapseButton from '$components/generate/SidebarCollapseButton.svelte';
	import { isLeftSidebarHidden, isLeftSidebarHiddenApp } from '$ts/stores/sidebars.js';
	import { previewImageVersion } from '$ts/constants/previewImageVersion.js';
	import { goto } from '$app/navigation';
	import { searchParamsString } from '$ts/stores/searchParamsString.js';
	import { lowOnCreditsThreshold } from '$ts/constants/credits.js';

	export let data;

	let isSignInModalOpen = false;
	let isJustCreatedGenerationForAnim = false;
	let promptBarHeight: number;
	let stageWidth: number;
	let stageHeight: number;
	let horizontalListHeightEstimatedRem = 4.6;
	let horizontalListHeight: number;
	let propmtBarEstimatedHeightRem = 3.275;
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

	$: generatePageUserGenerationFullOutputsQueryKey.set([
		'user_generation_full_outputs',
		userGalleryCurrentView,
		'',
		''
	]);

	$: userGenerationFullOutputsQuery =
		browser && $page.data.session?.user.id && $userSummary
			? createInfiniteQuery({
					queryKey: $generatePageUserGenerationFullOutputsQueryKey,
					queryFn: async (lastPage) => {
						let outputsPage = await getUserGenerationFullOutputs({
							access_token: $page.data.session?.access_token || '',
							cursor: lastPage?.pageParam
						});
						return outputsPage;
					},
					getNextPageParam: (lastPage: TUserGenerationFullOutputsPage) => {
						if (!lastPage.next) return undefined;
						return lastPage.next;
					}
			  })
			: undefined;

	$: pinnedFullOutputs = [...$generations]
		.map((g) => ({
			...g,
			outputs: [
				...[
					...g.outputs.filter((o) => o.status !== 'failed-nsfw' && o.status !== 'failed')
				].reverse(),
				...g.outputs.filter((o) => o.status === 'failed-nsfw' || o.status === 'failed')
			]
		}))
		.filter((g) => g.status !== 'pre-submit')
		.flatMap((g) => g.outputs.map((o) => ({ ...o, generation: g })));

	$: userGenerationOutputs = $userGenerationFullOutputsQuery?.data?.pages?.flatMap(
		(p) => p.outputs
	);

	$: generateAllSucceededOutputs = userGenerationOutputs
		? removeRepeatingOutputs({
				outputsPinned: pinnedFullOutputs,
				outputs: userGenerationOutputs,
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
			image_url: ''
		}))
	};

	$: [$generationNumOutputs, $generationAspectRatio, isCheckCompleted],
		addNewGenerationToGenerations();

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
		isSignInModalOpen = true;
	}

	function onKeyDown({ key }: KeyboardEvent) {
		if ($activeGeneration === undefined) return;
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

	function addNewGenerationToGenerations() {
		if ($generations && $generations[0] && $generations[0].status === 'pre-submit') return;
		generations.update((gs) => [
			...(generationPlaceholder !== undefined ? [generationPlaceholder] : []),
			...gs
		]);
	}

	function closeSettingsSheet() {
		isGenerationSettingsSheetOpen = false;
	}

	function toggleSettingsSheet() {
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

	onMount(async () => {
		if ($page.url.hash === confirmOtherEmailHash) {
			await goto('/account/change-email?confirm_other_email=true');
		}
		if (data.is_sign_in_modal_open) {
			await tick();
			setTimeout(() => {
				isSignInModalOpen = true;
			});
		}
	});
</script>

<MetaTag
	title="Generate | Stablecog"
	description="Create amazing art in seconds with AI. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	image_url="{canonicalUrl}/previews/home-{previewImageVersion}.png"
/>

<svelte:window on:keydown={onKeyDown} />

<GenerationSettingsProvider
	serverData={data}
	bind:isReadyMap
	let:isInferenceStepsValid
	let:supportedSchedulerIdDropdownItems
>
	<div class="w-full h-full flex flex-col overflow-hidden relative z-0">
		<div class="w-full h-full flex flex-row overflow-hidden pt-2 md:px-4 md:pb-4 gap-4">
			<div class="hidden lg:flex min-w-[2rem] flex-col items-start h-full relative">
				{#if !$isLeftSidebarHiddenApp}
					<div
						transition:fly|local={{
							duration: 250,
							x: $windowWidth > xlBreakpoint ? -200 : -100,
							easing: quadOut
						}}
						class="h-full flex w-36 xl:w-72 lg:pb-[calc(env(safe-area-inset-bottom))] relative z-10"
					>
						<SidebarWrapper hasGradient>
							{#if !$page.data.session?.user.id || !$userSummary}
								<GenerateGridPlaceholder text={$LL.Generate.Grid.NotSignedIn.Paragraph()} />
							{:else if userGenerationFullOutputsQuery}
								<AutoSize bind:element={gridScrollContainer} let:clientWidth let:clientHeight>
									{#if $windowWidth > lgBreakpoint && gridScrollContainer}
										<GenerationGridInfinite2
											paddingLeft={6}
											paddingRight={6}
											paddingTop={6}
											paddingBottom={80}
											{pinnedFullOutputs}
											noLoadingSpinnerAlignmentAdjustment
											hasPlaceholder
											cardType="generate"
											generationsQuery={userGenerationFullOutputsQuery}
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
			<div
				class="flex flex-col items-center flex-1 min-w-0 h-full relative
						lg:pb-[calc(env(safe-area-inset-bottom))]"
			>
				{#if $windowWidth < mdBreakpoint && isGenerationSettingsSheetOpen}
					<div
						transition:fade|local={{ duration: 200, easing: quadOut }}
						class="fixed w-full h-full left-0 top-0 bg-c-barrier/70 z-40"
					/>
				{/if}
				<div use:clickoutside={{ callback: closeSettingsSheet }}>
					{#if !$windowWidth || $windowWidth < mdBreakpoint}
						<div
							style="transform: translateY({!$windowWidth || !promptBarHeight
								? `calc(100% - env(safe-area-inset-bottom) - ${
										propmtBarEstimatedHeightRem + horizontalListHeightEstimatedRem
								  }rem)`
								: $windowWidth < mdBreakpoint && isGenerationSettingsSheetOpen
								? '0%'
								: `calc(100% - ${promptBarHeight + horizontalListHeight}px)`});"
							class="w-full h-[min(calc(100%-3rem),60rem)] z-40 gap-1 flex flex-col bg-c-bg rounded-t-2xl ring-2 ring-c-bg-secondary
										md:ring-0 md:rounded-none {isGenerationSettingsSheetOpen
								? 'shadow-sheet-open shadow-c-shadow/[var(--o-shadow-strongest)]'
								: 'shadow-sheet-closed shadow-c-shadow/[var(--o-shadow-stronger)]'} md:shadow-none
										md:bg-transparent absolute left-0 bottom-0 md:hidden transform transition duration-250 overflow-hidden md:overflow-auto"
						>
							<div
								class="w-full flex-1 h-full overflow-hidden flex flex-col z-50 transition {$windowWidth &&
								$windowWidth < mdBreakpoint &&
								isGenerationSettingsSheetOpen
									? 'opacity-100'
									: 'opacity-0 pointer-events-none'}"
							>
								<SettingsPanel
									rounding="top"
									{openSignInModal}
									{isCheckCompleted}
									{isInferenceStepsValid}
									{supportedSchedulerIdDropdownItems}
								/>
							</div>
							<div
								class="flex-shrink-0 w-full"
								style="height: {!$windowWidth || !promptBarHeight
									? `calc(env(safe-area-inset-bottom) + ${
											propmtBarEstimatedHeightRem + horizontalListHeightEstimatedRem
									  }rem)`
									: `${
											promptBarHeight +
											(isGenerationSettingsSheetOpen && $windowWidth < mdBreakpoint
												? 4
												: horizontalListHeight)
									  }px`}"
							/>
						</div>
					{/if}
					<!-- Prompt bar -->
					<div
						class="w-full z-50 flex flex-col rounded-2xl overflow-hidden md:overflow-visible md:rounded-none bg-transparent md:bg-transparent absolute left-0 bottom-0
								md:bottom-auto md:top-0 order-2 {isGenerationSettingsSheetOpen && $windowWidth < mdBreakpoint
							? 'pointer-events-none'
							: 'pointer-events-auto'}"
					>
						<div
							bind:clientHeight={horizontalListHeight}
							class="w-full h-16 flex flex-col md:hidden bg-c-bg transform transition duration-250 {isGenerationSettingsSheetOpen
								? 'translate-y-full pointer-events-none opacity-0'
								: 'pointer-events-auto'}"
						>
							<AutoSize
								bind:element={listScrollContainer}
								hideScroll
								let:clientWidth
								let:clientHeight
							>
								{#if !$page.data.session?.user.id || !$userSummary}
									<GenerateHorizontalListPlaceholder
										text={$LL.Generate.Grid.NotSignedIn.Paragraph()}
									/>
								{:else if userGenerationFullOutputsQuery}
									{#if $windowWidth < mdBreakpoint && listScrollContainer}
										<GenerateHorizontalList
											{listScrollContainer}
											listScrollContainerWidth={clientWidth}
											listScrollContainerHeight={clientHeight}
											paddingX={8}
											paddingY={6}
											{pinnedFullOutputs}
											generationsQuery={userGenerationFullOutputsQuery}
											cardType="generate"
										/>
									{/if}
								{/if}
							</AutoSize>
						</div>
						<div
							bind:clientHeight={promptBarHeight}
							class="w-full flex pt-0.5 md:pt-0 pl-2 bg-c-bg md:bg-transparent md:pl-0
							pb-[calc(env(safe-area-inset-bottom)+0.75rem)] z-50 pointer-events-auto"
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
					class="w-full flex flex-col order-first flex-1 min-w-0 pb-[calc(env(safe-area-inset-bottom)+10.5rem)]
					md:pb-0 md:pt-26 lg:pb-8 relative z-0"
				>
					<div class="flex-1 min-w-0 flex flex-col items-center justify-center w-full">
						{#if $page.data.session?.user.id && $userSummary && $userSummary.total_remaining_credits < lowOnCreditsThreshold}
							<div
								transition:expandCollapse|local={{ duration: 200 }}
								class="w-full flex flex-col justify-start items-center"
							>
								<div class="py-2px px-2.5 md:px-2px pb-6">
									<LowOnCreditsCard />
								</div>
							</div>
						{/if}
						<div class="w-full flex-1 min-w-0 flex flex-col px-2 lg:px-6">
							<div
								bind:clientWidth={stageWidth}
								bind:clientHeight={stageHeight}
								class="flex-1 min-w-0 w-full"
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
						</div>
					</div>
					<div class="w-full hidden md:flex lg:hidden pt-11 pb-[calc(env(safe-area-inset-bottom))]">
						<SidebarWrapper borderSize="sm">
							<div class="w-full h-20 flex flex-col">
								{#if !$page.data.session?.user.id || !$userSummary}
									<GenerateHorizontalListPlaceholder
										text={$LL.Generate.Grid.NotSignedIn.Paragraph()}
									/>
								{:else if userGenerationFullOutputsQuery}
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
												generationsQuery={userGenerationFullOutputsQuery}
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
			<div class="h-full w-72 hidden md:flex md:pb-[calc(env(safe-area-inset-bottom))]">
				<SettingsPanel
					{openSignInModal}
					{isCheckCompleted}
					{isInferenceStepsValid}
					{supportedSchedulerIdDropdownItems}
				/>
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

	{#if isSignInModalOpen && !$page.data.session?.user.id}
		<div
			use:portal={'body'}
			transition:fade|local={{ duration: 300, easing: quadOut }}
			class="w-full h-full bg-c-barrier/80 fixed left-0 top-0 px-3 z-[10000]"
		/>
		<div
			use:portal={'body'}
			transition:fly|local={{ duration: 200, y: 50, easing: quadOut }}
			class="w-full h-full flex flex-col items-center fixed left-0 top-0 px-3 py-20 z-[10001] overflow-auto"
		>
			<div
				use:clickoutside={{ callback: () => (isSignInModalOpen = false) }}
				class="flex justify-center my-auto"
			>
				<SignInCard isModal={true} redirectTo={'/generate' + $searchParamsString} />
			</div>
		</div>
	{/if}
</GenerationSettingsProvider>
