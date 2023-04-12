<script lang="ts">
	import { browser } from '$app/environment';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import SettingsPanel from '$routes/admin/create/SettingsPanel.svelte';
	import { activeGeneration, generations } from '$ts/stores/user/generation';

	import { onDestroy, onMount } from 'svelte';
	import PromptBar from '$routes/admin/create/PromptBar.svelte';
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
	import SidebarWrapper from '$routes/admin/create/SidebarWrapper.svelte';
	import GenerateStage from '$routes/admin/create/GenerationStage.svelte';
	import { themeApp } from '$ts/stores/theme';
	import GenerationGridInfinite from '$components/grids/GenerationGridInfinite.svelte';
	import { isValue } from '$ts/helpers/isValue';
	import {
		generationAspectRatio,
		generationModelId,
		generationNumOutputs,
		generationSchedulerId,
		imageSize,
		modelId,
		numOutputs,
		prompt,
		promptInputValue,
		schedulerId
	} from '$ts/stores/generationSettings';
	import { availableGenerationModelIds, generationModels } from '$ts/constants/generationModels';
	import { availableSchedulerIds } from '$ts/constants/schedulers';
	import { aspectRatioTabs } from '$ts/constants/generationSize';
	import { numOutputsMax, numOutputsMin } from '$ts/constants/main';
	import { mdBreakpoint } from '$components/generationFullScreen/constants';
	import VerticalGenerationList from '$routes/admin/create/VerticalGenerationList.svelte';

	let isCheckCompleted = false;
	let isSignInModalOpen = false;
	let isSettingsPanelModalOpen = false;

	let stageWidth: number;
	let stageHeight: number;

	let stageWidthMobile: number;
	let stageHeightMobile: number;

	let gridScrollContainer: HTMLElement;

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
	}_${$generations.flatMap((g) => g.outputs).length}_${
		$userGenerationFullOutputsQuery?.isInitialLoading
	}_${$userGenerationFullOutputsQuery?.isStale}_${
		$userGenerationFullOutputsQuery?.data?.pages?.[0]?.outputs &&
		$userGenerationFullOutputsQuery.data.pages[0].outputs.length > 0
			? $userGenerationFullOutputsQuery.data.pages[0].outputs[0].id
			: false
	}`;

	$: pinnedFullOutputs = $generations
		.filter((g, i) => i !== 0)
		.flatMap((g) => g.outputs.map((o) => ({ ...o, generation: g })));

	function openSignInModal() {
		isSignInModalOpen = true;
	}

	function openSettingsPanelModal() {
		isSettingsPanelModalOpen = true;
	}

	function onKeyDown({ key }: KeyboardEvent) {
		if ($activeGeneration === undefined) return;
		if (key === 'Escape') {
			activeGeneration.set(undefined);
			return;
		}
		if (key === 'ArrowLeft' || key === 'ArrowRight') {
			const outputs = $activeGeneration.outputs;
			const index = outputs.findIndex((g) => g.id === $activeGeneration?.selected_output.id);
			if (index === -1) return;
			const addition = key === 'ArrowLeft' ? -1 : 1;
			const newIndex =
				(index + addition + $activeGeneration.outputs.length) % $activeGeneration.outputs.length;
			activeGeneration.set({
				...$activeGeneration,
				selected_output: $activeGeneration.outputs[newIndex]
			});
		}
	}

	onMount(() => {
		if (!browser) return;
		document.body.style.overflow = 'hidden';
		document.body.style.height = '100%';
		if (isValue($prompt) && $prompt !== null) {
			promptInputValue.set($prompt);
		}
		const aspectRatioIndex = aspectRatioTabs
			.map((a) => a.value)
			.findIndex((i) => i === $imageSize?.aspectRatio?.toString());
		if (aspectRatioIndex >= 0) {
			generationAspectRatio.set(aspectRatioTabs[aspectRatioIndex].value);
		}
		if (isValue($modelId) && availableGenerationModelIds.includes($modelId)) {
			generationModelId.set($modelId);
		}
		if (isValue($schedulerId) && availableSchedulerIds.includes($schedulerId)) {
			generationSchedulerId.set($schedulerId);
		}
		if (
			// @ts-ignore
			!generationModels[$generationModelId].supportedSchedulerIds.includes($generationSchedulerId)
		) {
			generationSchedulerId.set(generationModels[$generationModelId].supportedSchedulerIds[0]);
		}
		if (isValue($numOutputs) && $numOutputs >= numOutputsMin && $numOutputs <= numOutputsMax) {
			generationNumOutputs.set($numOutputs);
		}
		isCheckCompleted = true;
	});

	onDestroy(() => {
		if (!browser) return;
		document.body.style.overflow = 'auto';
		document.body.style.height = 'auto';
	});

	function withCheck(fn: () => void) {
		if (!isCheckCompleted) return;
		fn();
	}
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
	<!-- Main part desktop -->
	<div class="w-full h-full hidden md:flex flex-row overflow-hidden pt-2 px-4 pb-4 gap-4">
		<div class="h-full w-40 xl:w-80">
			<SidebarWrapper>
				<div bind:this={gridScrollContainer} class="w-full flex-1 overflow-auto px-2 pt-2 pb-16">
					{#if userGenerationFullOutputsQuery && $windowWidth >= mdBreakpoint}
						<GenerationGridInfinite
							{pinnedFullOutputs}
							cardWidthClasses="w-full lg:w-1/2 xl:w-1/3"
							cardType="create"
							generationsQuery={userGenerationFullOutputsQuery}
							rerenderKey={gridRerenderKey}
							{gridScrollContainer}
						/>
					{/if}
				</div>
			</SidebarWrapper>
		</div>
		<div class="flex flex-col items-center flex-1 h-full gap-4">
			<PromptBar {openSignInModal} {isCheckCompleted} {withCheck} />
			<div class="flex-1 flex flex-col items-center justify-center w-full overflow-hidden p-6">
				<div bind:clientWidth={stageWidth} bind:clientHeight={stageHeight} class="flex-1 w-full">
					{#if stageWidth && stageHeight}
						<GenerateStage generation={$generations[0]} {stageWidth} {stageHeight} />
					{/if}
				</div>
			</div>
		</div>
		<div class="h-full w-80">
			<SettingsPanel {withCheck} {isCheckCompleted} />
		</div>
	</div>
	<!-- Main part mobile -->
	<div class="w-full h-full flex md:hidden flex-col overflow-hidden gap-4">
		<div class="w-full flex-1 flex flex-col px-4 pb-2">
			<div
				bind:clientWidth={stageWidthMobile}
				bind:clientHeight={stageHeightMobile}
				class="w-full flex-1"
			>
				{#if stageWidthMobile && stageHeightMobile}
					<GenerateStage
						generation={$generations[0]}
						stageWidth={stageWidthMobile}
						stageHeight={stageHeightMobile}
					/>
				{/if}
			</div>
		</div>
		<div
			class="w-full bg-c-bg rounded-t-xl shadow-navbar shadow-c-shadow/[var(--o-shadow-stronger)] 
			ring-2 ring-c-bg-secondary pb-[env(safe-area-inset-bottom)] overflow-hidden z-10"
		>
			<div class="w-full h-14 flex flex-row overflow-hidden relative">
				{#if userGenerationFullOutputsQuery}
					<VerticalGenerationList
						generationsQuery={userGenerationFullOutputsQuery}
						{pinnedFullOutputs}
					/>
				{/if}
				<div class="h-full w-12 bg-gradient-to-r from-c-bg/0 to-c-bg absolute right-0 top-0 z-10" />
			</div>
			<PromptBar {openSignInModal} {isCheckCompleted} {withCheck} {openSettingsPanelModal} />
		</div>
	</div>
</div>

{#if $activeGeneration}
	<GenerationFullScreen generation={$activeGeneration} modalType="generate" />
{/if}

{#if $windowWidth <= mdBreakpoint}
	<div
		use:portal={'body'}
		class="w-full h-full fixed left-0 top-0 flex flex-col justify-end z-[10000] transition {isSettingsPanelModalOpen
			? 'bg-c-barrier/80 opacity-100'
			: 'opacity-0 pointer-events-none'}"
	/>
	<div
		class="w-full h-full flex flex-col justify-end fixed left-0 top-0 transition z-[10001] {isSettingsPanelModalOpen
			? 'translate-y-0'
			: 'translate-y-full pointer-events-none'}"
	>
		<div
			use:clickoutside={{ callback: () => (isSettingsPanelModalOpen = false) }}
			style="max-height: {$windowHeight * 0.8}px"
			class="w-full flex flex-col h-full max-h-[80vh]"
		>
			<SettingsPanel {withCheck} {isCheckCompleted} rounding="top" />
		</div>
	</div>
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
			<SignInCard isModal={true} redirectTo="/create" />
		</div>
	</div>
{/if}
