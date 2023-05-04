<script lang="ts">
	import { browser } from '$app/environment';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import SettingsPanel from '$components/generate/SettingsPanel.svelte';
	import {
		activeGeneration,
		generations,
		type TGeneration,
		type TGenerationFullOutput
	} from '$ts/stores/user/generation';

	import { onDestroy, onMount, tick } from 'svelte';
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
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import Navbar from '$components/navigation/Navbar.svelte';
	import SidebarWrapper from '$components/generate/SidebarWrapper.svelte';
	import GenerateStage from '$components/generate/GenerationStage.svelte';
	import { themeApp } from '$ts/stores/theme';
	import GenerationGridInfinite from '$components/grids/GenerationGridInfinite.svelte';
	import { generationAspectRatio, generationNumOutputs } from '$ts/stores/generationSettings.js';
	import { generateSSEId } from '$ts/helpers/generateSSEId.js';
	import { generationModelIdDefault } from '$ts/constants/generationModels.js';
	import { schedulerIdDefault } from '$ts/constants/schedulers.js';
	import type { TIsReadyMap } from '$components/generate/types.js';
	import { lgBreakpoint, mdBreakpoint } from '$components/generationFullScreen/constants.js';
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

	export let data;

	const lowCreditsThreshold = 10;
	let isSignInModalOpen = false;
	let promptBarHeight: number;
	let stageWidth: number;
	let stageHeight: number;
	let horizontalListHeightEstimatedRem = 3.5;
	let horizontalListHeight: number;
	let propmtBarEstimatedHeightRem = 4.25;
	let gridScrollContainer: HTMLElement;
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
		'all',
		'',
		''
	]);

	$: userGenerationFullOutputsQuery =
		browser && $page.data.session?.user.id
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

	$: gridRerenderKey = `generate_page_user_generation_full_outputs_${userGalleryCurrentView}_${
		$generations.length
	}_${$generations.flatMap((g) => g.outputs).length}_${pinnedFullOutputs.length}_${
		$userGenerationFullOutputsQuery?.isInitialLoading
	}_${$userGenerationFullOutputsQuery?.isStale}_${
		$userGenerationFullOutputsQuery?.data?.pages?.[0]?.outputs &&
		$userGenerationFullOutputsQuery.data.pages[0].outputs.length > 0
			? $userGenerationFullOutputsQuery.data.pages[0].outputs[0].id
			: false
	}`;

	$: pinnedFullOutputs = [...$generations]
		.map((g) => ({
			...g,
			outputs: [
				...[
					...g.outputs.filter((o) => o.status !== 'failed-nsfw' || o.status !== 'failed-nsfw')
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
		: [];

	$: activeGenerationOutputs = $activeGeneration?.outputs.map((o) => ({
		...o,
		generation: $activeGeneration!
	}));

	let mounted = false;
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

	$: [mounted, $generationNumOutputs, $generationAspectRatio], addNewGenerationToGenerations();

	function openSignInModal() {
		isSignInModalOpen = true;
	}

	function onKeyDown({ key }: KeyboardEvent) {
		if ($activeGeneration === undefined) return;
		if (key === 'Escape') {
			activeGeneration.set(undefined);
			return;
		}
		if (key === 'ArrowLeft' || key === 'ArrowRight') {
			goToSide(key === 'ArrowLeft' ? 'left' : 'right');
		}
	}

	function goToSide(side: 'left' | 'right') {
		if ($activeGeneration === undefined) return;
		let outputs: TGenerationFullOutput[] | undefined;
		if ($activeGeneration.card_type === 'generate') {
			outputs = generateAllSucceededOutputs;
		} else {
			outputs = activeGenerationOutputs;
		}
		if (!outputs) return;
		outputs = outputs.filter((o) => o.image_url);
		const index = outputs.findIndex((g) => g.id === $activeGeneration?.selected_output.id);
		if (index === -1) return;
		const addition = side === 'left' ? -1 : 1;
		const newIndex = (index + addition + outputs.length) % outputs.length;
		const newOutput = outputs[newIndex];
		activeGeneration.set({
			...newOutput.generation,
			selected_output: newOutput,
			card_type: $activeGeneration.card_type
		});
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

	function onGenerate() {
		closeSettingsSheet();
	}

	onMount(async () => {
		if (!browser) return;
		document.body.style.overflow = 'hidden';
		document.body.style.height = '100%';
		mounted = true;
		await tick();
	});

	onDestroy(() => {
		if (!browser) return;
		document.body.style.overflow = 'auto';
		document.body.style.height = 'auto';
	});
</script>

<svelte:window on:keydown={onKeyDown} />

<GenerationSettingsProvider
	serverData={data}
	bind:isReadyMap
	let:isInferenceStepsValid
	let:supportedSchedulerIdDropdownItems
>
	<div
		id="tooltip-container"
		style="{$windowHeight
			? `height: ${$windowHeight + 'px;'}`
			: 'height: 100vh; height: 100svh;'} {$windowWidth
			? `width: ${$windowWidth + 'px;'}`
			: 'width: 100vw; width: 100svw;'} background-image: url({$themeApp === 'light'
			? '/illustrations/grid-on-light.svg'
			: '/illustrations/grid-on-dark.svg'}); background-size: 24px;"
		class="w-full flex flex-col overflow-hidden relative z-0"
	>
		<Navbar />
		<div class="w-full h-full flex flex-row overflow-hidden pt-2 md:px-4 md:pb-4 gap-4">
			<div class="h-full hidden lg:flex w-36 xl:w-72 lg:pb-[calc(env(safe-area-inset-bottom))]">
				<SidebarWrapper hasGradient>
					{#if !$page.data.session?.user.id}
						<div class="w-full h-full p-2">
							<GenerateGridPlaceholder text={$LL.Generate.Grid.NotSignedIn.Paragraph()} />
						</div>
					{:else if userGenerationFullOutputsQuery}
						<div
							bind:this={gridScrollContainer}
							class="w-full flex flex-col flex-1 min-w-0 overflow-auto px-2 py-2"
						>
							{#if $windowWidth > lgBreakpoint}
								<GenerationGridInfinite
									{pinnedFullOutputs}
									noLoadingSpinnerAlignmentAdjustment
									hasPlaceholder
									cardWidthClasses="w-full lg:w-1/2 xl:w-1/3"
									cardType="generate"
									generationsQuery={userGenerationFullOutputsQuery}
									rerenderKey={gridRerenderKey}
									{gridScrollContainer}
									bottomElementClass="w-full h-16 flex-shrink-0"
								/>
							{/if}
						</div>
					{/if}
				</SidebarWrapper>
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
							class="w-full max-h-[90%] z-40 gap-1 flex flex-col bg-c-bg rounded-t-2xl ring-2 ring-c-bg-secondary 
								md:ring-0 md:rounded-none shadow-c-shadow/[var(--o-shadow-strongest)] shadow-sheet md:shadow-none 
								md:bg-transparent absolute left-0 bottom-0 md:hidden transform transition overflow-hidden md:overflow-auto"
						>
							<div
								class="w-full flex-1 min-w-0 overflow-hidden flex flex-col z-50 transition {$windowWidth &&
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
									: `${promptBarHeight + horizontalListHeight}px`}"
							/>
						</div>
					{/if}
					<!-- Prompt bar -->
					<div
						class="w-full z-50 flex flex-col rounded-2xl overflow-hidden md:overflow-visible md:rounded-none bg-c-bg md:bg-transparent absolute left-0 bottom-0 
							md:bottom-auto md:top-0 order-2"
					>
						<div bind:clientHeight={horizontalListHeight} class="w-full h-14 md:hidden">
							{#if !$page.data.session?.user.id}
								<GenerateHorizontalListPlaceholder
									text={$LL.Generate.Grid.NotSignedIn.Paragraph()}
								/>
							{:else if userGenerationFullOutputsQuery}
								<GenerateHorizontalList
									{pinnedFullOutputs}
									generationsQuery={userGenerationFullOutputsQuery}
									cardType="generate"
								/>
							{/if}
						</div>
						<div
							bind:clientHeight={promptBarHeight}
							class="w-full flex pl-2 pt-2 md:p-0 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] z-50"
						>
							<PromptBar
								{openSignInModal}
								serverData={data}
								{onGenerate}
								{toggleSettingsSheet}
								bind:isReadyMap
								bind:isGenerationSettingsSheetOpen
							/>
						</div>
					</div>
				</div>
				<div
					class="w-full flex flex-col order-first flex-1 min-w-0 pb-44 
					md:pb-0 md:pt-26 lg:pb-8"
				>
					<div
						class="flex-1 min-w-0 flex flex-col items-center justify-center w-full 
						overflow-hidden"
					>
						{#if $page.data.session?.user.id && $userSummary && $userSummary.total_remaining_credits < lowCreditsThreshold}
							<div
								transition:expandCollapse|local={{ duration: 200 }}
								class="w-full flex flex-col justify-start items-center"
							>
								<div class="py-2px px-2 md:px-2px pb-6">
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
									<GenerateStage
										generation={$generations[0]}
										{stageWidth}
										{stageHeight}
										bind:isReadyMap
									/>
								{/if}
							</div>
						</div>
					</div>
					<div class="w-full hidden md:flex lg:hidden pt-11 pb-[calc(env(safe-area-inset-bottom))]">
						<SidebarWrapper>
							<div class="w-full h-20 flex">
								{#if !$page.data.session?.user.id}
									<GenerateHorizontalListPlaceholder
										text={$LL.Generate.Grid.NotSignedIn.Paragraph()}
									/>
								{:else if userGenerationFullOutputsQuery}
									<GenerateHorizontalList
										{pinnedFullOutputs}
										generationsQuery={userGenerationFullOutputsQuery}
										cardType="generate"
									/>
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
			onLeftButtonClicked={() => goToSide('left')}
			onRightButtonClicked={() => goToSide('right')}
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
				<SignInCard isModal={true} redirectTo="/generate" />
			</div>
		</div>
	{/if}
</GenerationSettingsProvider>
