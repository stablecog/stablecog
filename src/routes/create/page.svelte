<script lang="ts">
	import { browser } from '$app/environment';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import SettingsPanel from '$routes/create/SettingsPanel.svelte';
	import { activeGeneration, generations } from '$ts/stores/user/generation';
	import { windowHeight } from '$ts/stores/window';
	import { onDestroy, onMount } from 'svelte';
	import { navbarHeight } from '$ts/stores/navbarHeight';
	import PromptBar from '$routes/create/PromptBar.svelte';
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
	import GenerationGridInfinite from '$components/grids/GenerationGridInfinite.svelte';

	let topbarHeight: number;
	let leftPanelHeight: number;

	let isCheckCompleted = false;
	let isSignInModalOpen = false;

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
					outputsPage = {
						...outputsPage,
						outputs: outputsPage.outputs.filter(
							(o) => !$generations.map((g) => g.id).includes(o.generation.id)
						)
					};
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
		isCheckCompleted = true;
	});

	onDestroy(() => {
		if (!browser) return;
		document.body.style.overflow = 'auto';
		document.body.style.height = 'auto';
	});
</script>

<svelte:window on:keydown={onKeyDown} />

<div
	style="height: {$windowHeight && $navbarHeight ? $windowHeight - $navbarHeight + 'px' : '100vh'}"
	class="w-full flex flex-row items-stretch overflow-hidden"
>
	<div
		bind:clientHeight={leftPanelHeight}
		class="flex-1 h-full flex flex-col items-center px-5 relative"
	>
		<div bind:clientHeight={topbarHeight} class="w-full max-w-[90rem] pt-2">
			<PromptBar {isCheckCompleted} {openSignInModal} />
		</div>
		<div
			style="height: {leftPanelHeight - topbarHeight}px"
			class="w-full flex-1 flex flex-col py-5"
		>
			<div
				class="w-full flex-1 flex flex-col overflow-hidden rounded-3xl bg-c-bg
        shadow-2xl shadow-c-shadow/[var(--o-shadow-strongest)] border-4 border-c-bg-secondary"
			>
				<div
					bind:this={gridScrollContainer}
					class="w-full px-2 py-2 pb-6 flex flex-col flex-1 overflow-auto"
				>
					{#if userGenerationFullOutputsQuery}
						<GenerationGridInfinite
							pinnedFullOutputs={$generations.flatMap((g) =>
								g.outputs.map((o) => ({ ...o, generation: g }))
							)}
							{gridScrollContainer}
							cardWidthClasses="w-1/2 sm:w-1/3 lg:w-1/4 xl:w-1/5"
							cardType="generate"
							generationsQuery={userGenerationFullOutputsQuery}
							rerenderKey={gridRerenderKey}
						/>
					{:else}
						<div class="m-auto">Create a generation</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
	<div class="w-80 lg:w-96 h-full pr-5 pb-5 pt-2">
		<SettingsPanel />
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
