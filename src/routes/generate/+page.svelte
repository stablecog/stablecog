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
	import { createInfiniteQuery, type CreateInfiniteQueryResult } from '@tanstack/svelte-query';
	import {
		getUserGenerationFullOutputs,
		type TUserGenerationFullOutputsPage
	} from '$ts/queries/userGenerations';
	import { createPageUserGenerationFullOutputsQueryKey } from '$ts/stores/user/keys';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import Navbar from '$components/navigation/Navbar.svelte';
	import SidebarWrapper from '$components/generate/SidebarWrapper.svelte';
	import GenerateStage from '$components/generate/GenerationStage.svelte';
	import { themeApp } from '$ts/stores/theme';
	import GenerationGridInfinite from '$components/grids/GenerationGridInfinite.svelte';
	import {
		generationGuidanceScale,
		generationHeight,
		generationInferenceSteps,
		generationNumOutputs,
		generationWidth
	} from '$ts/stores/generationSettings.js';
	import { generateSSEId } from '$ts/helpers/generateSSEId.js';
	import { generationModelIdDefault } from '$ts/constants/generationModels.js';
	import { schedulerIdDefault } from '$ts/constants/schedulers.js';
	import type { TIsReadyMap } from '$components/generate/types.js';
	import { lgBreakpoint, mdBreakpoint } from '$components/generationFullScreen/constants.js';
	import HorizontalList from '$components/generate/HorizontalList.svelte';

	export let data;

	let isSignInModalOpen = false;
	let promptBarHeight: number;
	let stageWidth: number;
	let stageHeight: number;
	let horizontalListImageHeight = 48;
	let horizontalListPaddingTopRem = 0.5;
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
	let userGenerationFullOutputsQuery:
		| CreateInfiniteQueryResult<TUserGenerationFullOutputsPage, unknown>
		| undefined;

	$: createPageUserGenerationFullOutputsQueryKey.set([
		'create_page_user_generation_full_outputs',
		userGalleryCurrentView
	]);

	$: userGenerationFullOutputsQuery = $page.data.session?.user.id
		? createInfiniteQuery({
				queryKey: $createPageUserGenerationFullOutputsQueryKey,
				queryFn: async (lastPage) => {
					let outputsPage = await getUserGenerationFullOutputs({
						access_token: $page.data.session?.access_token || '',
						cursor: lastPage?.pageParam,
						is_favorited: userGalleryCurrentView === 'favorites'
					});
					return outputsPage;
				},
				getNextPageParam: (lastPage: TUserGenerationFullOutputsPage) => {
					if (!lastPage.next) return undefined;
					return lastPage.next;
				}
		  })
		: undefined;

	$: gridRerenderKey = `create_page_user_generation_full_outputs_${userGalleryCurrentView}_${
		$generations.length
	}_${$generations.flatMap((g) => g.outputs).length}_${pinnedFullOutputs.length}_${
		$userGenerationFullOutputsQuery?.isInitialLoading
	}_${$userGenerationFullOutputsQuery?.isStale}_${
		$userGenerationFullOutputsQuery?.data?.pages?.[0]?.outputs &&
		$userGenerationFullOutputsQuery.data.pages[0].outputs.length > 0
			? $userGenerationFullOutputsQuery.data.pages[0].outputs[0].id
			: false
	}`;

	$: pinnedFullOutputs = $generations
		.filter((g) => g.status !== 'pre-submit')
		.flatMap((g) => g.outputs.map((o) => ({ ...o, generation: g })));

	let mounted = false;
	let generationPlaceholder: TGeneration | undefined;
	$: generationPlaceholder = mounted
		? {
				is_placeholder: true,
				ui_id: generateSSEId(),
				submit_to_gallery: false,
				width: Number($generationWidth),
				height: Number($generationHeight),
				prompt: {
					id: '1',
					text: 'placeholder prompt'
				},
				negative_prompt: {
					id: '1',
					text: 'placeholder negative prompt'
				},
				created_at: Date.now(),
				guidance_scale: $generationGuidanceScale,
				inference_steps: Number($generationInferenceSteps),
				model_id: generationModelIdDefault,
				scheduler_id: schedulerIdDefault,
				seed: 1,
				num_outputs: Number($generationNumOutputs),
				status: 'pre-submit',
				outputs: Array.from({ length: Number($generationNumOutputs) }).map((i) => ({
					id: '',
					image_url: ''
				}))
		  }
		: undefined;

	$: [mounted, generationPlaceholder, $generationNumOutputs, $generationWidth, $generationHeight],
		addPlacholderGenerationToGenerations();

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
			let outputs: TGenerationFullOutput[] | undefined;
			if ($activeGeneration.card_type === 'generate') {
				const userGenerationOutputs = $userGenerationFullOutputsQuery?.data?.pages.flatMap(
					(p) => p.outputs
				);
				outputs = [...pinnedFullOutputs, ...(userGenerationOutputs ? userGenerationOutputs : [])];
				console.log(outputs.length);
			} else {
				outputs = $activeGeneration.outputs.map((o) => ({ ...o, generation: $activeGeneration! }));
			}
			if (!outputs) return;
			outputs = outputs.filter((o) => o.image_url);
			const index = outputs.findIndex((g) => g.id === $activeGeneration?.selected_output.id);
			if (index === -1) return;
			const addition = key === 'ArrowLeft' ? -1 : 1;
			const newIndex = (index + addition + outputs.length) % outputs.length;
			const newOutput = outputs[newIndex];
			activeGeneration.set({
				...newOutput.generation,
				selected_output: newOutput,
				card_type: $activeGeneration.card_type
			});
		}
	}

	function addPlacholderGenerationToGenerations() {
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
		if (generationPlaceholder) {
			generations.set([generationPlaceholder]);
		}
	});

	onDestroy(() => {
		if (!browser) return;
		document.body.style.overflow = 'auto';
		document.body.style.height = 'auto';
	});
</script>

<svelte:window on:keydown={onKeyDown} />

<div
	id="tooltip-container"
	style="{$windowHeight
		? `height: ${$windowHeight + 'px;'}`
		: 'height: 100vh; height: 100svh;'} background-image: url({$themeApp === 'light'
		? '/illustrations/grid-on-light.svg'
		: '/illustrations/grid-on-dark.svg'}); background-size: 24px;"
	class="w-full flex flex-col overflow-hidden"
>
	<Navbar />
	<div class="w-full h-full flex flex-row overflow-hidden pt-2 md:px-4 md:pb-4 gap-4">
		<div class="h-full hidden lg:flex w-36 xl:w-72">
			<SidebarWrapper>
				{#if userGenerationFullOutputsQuery}
					<div
						bind:this={gridScrollContainer}
						class="w-full flex flex-col flex-1 overflow-auto px-2 pt-2 pb-16"
					>
						{#if $windowWidth > lgBreakpoint}
							<GenerationGridInfinite
								{pinnedFullOutputs}
								cardWidthClasses="w-full lg:w-1/2 xl:w-1/3"
								cardType="generate"
								generationsQuery={userGenerationFullOutputsQuery}
								rerenderKey={gridRerenderKey}
								{gridScrollContainer}
							/>
						{/if}
					</div>
				{/if}
			</SidebarWrapper>
		</div>
		<div class="w-full md:w-auto flex flex-col items-center flex-1 h-full gap-4 relative">
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
							? `calc(100% - env(safe-area-inset-bottom) - ${propmtBarEstimatedHeightRem}rem - ${horizontalListPaddingTopRem}rem - ${horizontalListImageHeight}px)`
							: $windowWidth < mdBreakpoint && isGenerationSettingsSheetOpen
							? '0%'
							: `calc(100% - env(safe-area-inset-bottom) - ${
									promptBarHeight + horizontalListHeight
							  }px)`});"
						class="w-full max-h-[90%] z-40 gap-1 flex flex-col bg-c-bg rounded-t-2xl ring-2 ring-c-bg-secondary 
						md:ring-0 md:rounded-none shadow-c-shadow/[var(--o-shadow-strongest)] shadow-sheet md:shadow-none 
						md:bg-transparent absolute left-0 bottom-0 md:hidden transform transition overflow-hidden"
					>
						<div
							class="w-full flex-1 overflow-hidden flex flex-col z-50 transition {$windowWidth &&
							$windowWidth < mdBreakpoint &&
							isGenerationSettingsSheetOpen
								? 'opacity-100'
								: 'opacity-0 pointer-events-none'}"
						>
							<SettingsPanel rounding="top" serverData={data} bind:isReadyMap {openSignInModal} />
						</div>
						<div
							class="flex-shrink-0"
							style="height: calc(env(safe-area-inset-bottom) + {!$windowWidth || !promptBarHeight
								? `calc(${
										propmtBarEstimatedHeightRem + horizontalListPaddingTopRem
								  }rem + ${horizontalListImageHeight}px)`
								: `${promptBarHeight + horizontalListHeight}px`})"
						/>
					</div>
				{/if}
				<!-- Prompt bar -->
				<div
					class="w-full z-50 flex flex-col rounded-2xl overflow-hidden md:rounded-none bg-c-bg md:bg-transparent absolute left-0 bottom-0 
					md:bottom-auto md:top-0 order-2"
				>
					<div bind:clientHeight={horizontalListHeight} class="w-full md:hidden">
						{#if userGenerationFullOutputsQuery}
							<HorizontalList
								imageHeight={horizontalListImageHeight}
								{pinnedFullOutputs}
								generationsQuery={userGenerationFullOutputsQuery}
								cardType="generate"
							/>
						{:else}
							<div class="w-full pt-2">
								<div
									style="height: {horizontalListImageHeight}px"
									class="w-full flex items-center justify-center"
								>
									<p
										class="w-full overflow-hidden px-4 whitespace-nowrap text-sm overflow-ellipsis text-center text-c-on-bg/50"
									>
										Your generations will appear here
									</p>
								</div>
							</div>
						{/if}
					</div>
					<div
						bind:clientHeight={promptBarHeight}
						class="w-full flex pl-2 pt-2 pr-1 md:p-0 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] z-50"
					>
						<PromptBar
							{openSignInModal}
							serverData={data}
							bind:isReadyMap
							{onGenerate}
							bind:isGenerationSettingsSheetOpen
							{toggleSettingsSheet}
						/>
					</div>
				</div>
			</div>
			<div
				class="flex-1 flex flex-col order-first items-center justify-center w-full 
				overflow-hidden pb-[calc(env(safe-area-inset-bottom)+9.5rem)] md:pt-26 md:pb-8 px-2 lg:px-6"
			>
				<div bind:clientWidth={stageWidth} bind:clientHeight={stageHeight} class="flex-1 w-full">
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
		<div class="h-full w-72 hidden md:flex">
			<SettingsPanel serverData={data} bind:isReadyMap {openSignInModal} />
		</div>
	</div>
</div>

{#if $activeGeneration}
	<GenerationFullScreen generation={$activeGeneration} modalType="generate" />
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
