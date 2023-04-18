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
	import { windowHeight } from '$ts/stores/window';
	import Navbar from '$components/navigation/Navbar.svelte';
	import SidebarWrapper from '$routes/admin/create/SidebarWrapper.svelte';
	import GenerateStage from '$routes/admin/create/GenerationStage.svelte';
	import { themeApp } from '$ts/stores/theme';
	import GenerationGridInfinite from '$components/grids/GenerationGridInfinite.svelte';
	import type { TIsReadyMap } from '$routes/admin/create/types.js';

	export let data;

	let isSignInModalOpen = false;

	let stageWidth: number;
	let stageHeight: number;

	let gridScrollContainer: HTMLElement;

	let isReadyMap: TIsReadyMap = {
		promptBar: false,
		generationStage: false,
		generationSettings: false
	};

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
	<!-- Main part desktop -->
	<div class="w-full h-full flex flex-row overflow-hidden pt-2 px-4 pb-4 gap-4">
		<div class="h-full w-40 xl:w-80">
			{#if userGenerationFullOutputsQuery}
				<SidebarWrapper>
					<div
						bind:this={gridScrollContainer}
						class="w-full flex flex-col flex-1 overflow-auto px-2 pt-2 pb-16"
					>
						<GenerationGridInfinite
							{pinnedFullOutputs}
							cardWidthClasses="w-full lg:w-1/2 xl:w-1/3"
							cardType="create"
							generationsQuery={userGenerationFullOutputsQuery}
							rerenderKey={gridRerenderKey}
							{gridScrollContainer}
						/>
					</div>
				</SidebarWrapper>
			{/if}
		</div>
		<div class="flex flex-col items-center flex-1 h-full gap-4">
			<PromptBar {openSignInModal} serverData={data} bind:isReadyMap />
			<div class="flex-1 flex flex-col items-center justify-center w-full overflow-hidden p-6">
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
		<div class="h-full w-80">
			<SettingsPanel serverData={data} bind:isReadyMap />
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
			<SignInCard isModal={true} redirectTo="/create" />
		</div>
	</div>
{/if}