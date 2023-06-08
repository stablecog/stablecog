<script lang="ts">
	import { page } from '$app/stores';
	import AutoSize from '$components/AutoSize.svelte';
	import LowOnCreditsCard from '$components/LowOnCreditsCard.svelte';
	import AudioPlayerWithWaveform from '$components/voiceover/audioPlayer/AudioPlayerWithWaveform.svelte';
	import SidebarCollapseButton from '$components/generate/SidebarCollapseButton.svelte';
	import SidebarWrapper from '$components/generate/SidebarWrapper.svelte';
	import { mdBreakpoint, xlBreakpoint } from '$components/generationFullScreen/constants.js';
	import { clickoutside } from '$ts/actions/clickoutside.js';
	import { expandCollapse } from '$ts/animation/transitions.js';
	import { isLeftSidebarHidden, isLeftSidebarHiddenApp } from '$ts/stores/sidebars.js';
	import { userSummary } from '$ts/stores/user/summary.js';
	import { windowWidth } from '$ts/stores/window.js';
	import { quadOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import { voiceovers } from '$ts/stores/user/voiceovers.js';
	import { PUBLIC_BUCKET_URL, PUBLIC_BUCKET_VOICEOVER_URL } from '$env/static/public';
	import { browser } from '$app/environment';
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import {
		getUserVoiceoverFullOutputs,
		type TUserVoiceoverFullOutputsPage
	} from '$ts/queries/userVoiceovers';
	import VoiceoverSettingsPanel from '$components/voiceover/generate/VoiceoverSettingsPanel.svelte';
	import VoiceoverSettingsProvider from '$components/voiceover/generate/VoiceoverSettingsProvider.svelte';
	import VoiceoverPromptBar from '$components/voiceover/generate/VoiceoverPromptBar.svelte';
	import { voiceoverSpeakerId } from '$ts/stores/voiceover/voiceoverSettings.js';
	import {
		voiceoverSpeakerIdToDisplayName,
		voiceoverSpeakers
	} from '$ts/constants/voiceover/models.js';
	import { onMount } from 'svelte';
	import VoiceoverVerticalListInfinite from '$components/voiceover/VoiceoverVerticalListInfinite.svelte';

	export let data;

	const examplePrompt =
		'Create amazing art in seconds with AI. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky.';

	const lowOnCreditsThreshold = 10;

	let stageWidth: number;
	let stageHeight: number;

	let promptBarHeight: number;
	let propmtBarEstimatedHeightRem = 3.75;

	let horizontalListHeightEstimatedRem = 4.6;
	let horizontalListHeight: number;

	let listScrollContainer: HTMLDivElement;
	let listScrollContainerMd: HTMLDivElement;
	let listScrollContainerLg: HTMLDivElement;

	let isGenerationSettingsSheetOpen = false;

	function closeSettingsSheet() {
		isGenerationSettingsSheetOpen = false;
	}

	function toggleSettingsSheet() {
		isGenerationSettingsSheetOpen = !isGenerationSettingsSheetOpen;
	}

	$: userVoiceoverFullOutputsQueryKey = ['user_voiceover_full_outputs'];

	$: userVoiceoverFullOutputsQuery =
		browser && $page.data.session?.user.id && $userSummary
			? createInfiniteQuery({
					queryKey: userVoiceoverFullOutputsQueryKey,
					queryFn: async (lastPage) => {
						let outputsPage = await getUserVoiceoverFullOutputs({
							access_token: $page.data.session?.access_token || '',
							cursor: lastPage?.pageParam
						});
						return outputsPage;
					},
					getNextPageParam: (lastPage: TUserVoiceoverFullOutputsPage) => {
						if (!lastPage.next) return undefined;
						return lastPage.next;
					}
			  })
			: undefined;

	$: pinnedFullOutputs = [...$voiceovers]
		.map((g) => ({
			...g,
			outputs: [
				...[...g.outputs.filter((o) => o.status !== 'failed')].reverse(),
				...g.outputs.filter((o) => o.status === 'failed')
			]
		}))
		.filter((g) => g.status !== 'pre-submit')
		.flatMap((g) => g.outputs.map((o) => ({ ...o, generation: g })));

	$: userVoiceoverOutputs = $userVoiceoverFullOutputsQuery?.data?.pages?.flatMap((p) => p.outputs);
</script>

<VoiceoverSettingsProvider>
	<div class="w-full h-full flex flex-col overflow-hidden relative z-0">
		<div class="w-full h-full flex flex-row overflow-hidden pt-2 md:px-4 md:pb-4 gap-4">
			<div class="hidden lg:flex min-w-[2rem] flex-col items-start h-full relative">
				{#if !$isLeftSidebarHiddenApp}
					<div
						transition:fly|local={{
							duration: 200,
							x: $windowWidth > xlBreakpoint ? -250 : -150,
							easing: quadOut
						}}
						class="h-full flex w-36 xl:w-72 lg:pb-[calc(env(safe-area-inset-bottom))] relative z-10"
					>
						<SidebarWrapper hasGradient>
							{#if userVoiceoverFullOutputsQuery}
								<AutoSize bind:element={listScrollContainerLg} let:clientHeight>
									{#if listScrollContainerLg && clientHeight}
										<VoiceoverVerticalListInfinite
											paddingLeft={6}
											paddingRight={6}
											paddingTop={6}
											paddingBottom={80}
											listScrollContainerHeight={clientHeight}
											listScrollContainer={listScrollContainerLg}
											query={userVoiceoverFullOutputsQuery}
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
				<div use:clickoutside={{ callback: closeSettingsSheet }} class="w-full">
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
											md:bg-transparent absolute left-0 bottom-0 md:hidden transform transition overflow-hidden md:overflow-auto"
						>
							<div
								class="w-full flex-1 h-full overflow-hidden flex flex-col z-50 transition {$windowWidth &&
								$windowWidth < mdBreakpoint &&
								isGenerationSettingsSheetOpen
									? 'opacity-100'
									: 'opacity-0 pointer-events-none'}"
							>
								<!-- Settings Panel -->
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
						class="w-full z-50 flex flex-col rounded-2xl overflow-hidden md:overflow-visible md:rounded-none
						bg-c-bg md:bg-transparent pb-4"
					>
						<div
							bind:clientHeight={horizontalListHeight}
							class="w-full h-16 flex flex-col md:hidden"
						>
							<AutoSize bind:element={listScrollContainer} hideScroll>
								<div class="w-full h-full" />
							</AutoSize>
						</div>
						<div bind:clientHeight={promptBarHeight} class="w-full flex px-2 md:px-0 z-50 relative">
							<VoiceoverPromptBar />
						</div>
					</div>
				</div>
				<div
					class="w-full flex flex-col flex-1 min-w-0 pb-[env(safe-area-inset-bottom)] relative z-0"
				>
					<div class="flex-1 min-w-0 flex flex-col items-center justify-center w-full">
						{#if $page.data.session?.user.id && $userSummary && $userSummary.total_remaining_credits < lowOnCreditsThreshold}
							<div
								transition:expandCollapse|local={{ duration: 200 }}
								class="w-full flex flex-col justify-start items-center"
							>
								<div class="py-2px px-2 md:px-2px pb-6">
									<LowOnCreditsCard />
								</div>
							</div>
						{/if}
						<div class="w-full flex-1 min-h-0 flex flex-col justify-start overflow-hidden">
							<div class="flex-1 min-h-0 w-full flex flex-col overflow-hidden relative">
								<AudioPlayerWithWaveform
									src={$voiceovers?.[0]?.status === 'succeeded'
										? $voiceovers[0].outputs[0].audio_file_url.replace(
												PUBLIC_BUCKET_URL,
												PUBLIC_BUCKET_VOICEOVER_URL
										  )
										: '/audio/example.mp3'}
									label={$voiceovers?.[0]?.status === 'succeeded'
										? $voiceovers[0].prompt.text
										: examplePrompt}
									title={$voiceovers?.[0]?.status === 'succeeded'
										? $voiceovers[0].prompt.text
										: examplePrompt}
									status={$voiceovers?.[0]?.status === 'succeeded' ? 'succeeded' : 'idle'}
								/>
							</div>
						</div>
					</div>
					<div class="w-full hidden md:block lg:hidden pt-4">
						<div class="h-24 flex flex-col">
							<SidebarWrapper borderSize="sm">
								<div class="w-full flex flex-col h-20" />
							</SidebarWrapper>
						</div>
					</div>
				</div>
			</div>
			<div class="h-full w-72 hidden md:flex md:pb-[calc(env(safe-area-inset-bottom))]">
				<VoiceoverSettingsPanel openSignInModal={() => null} isCheckCompleted={true} />
			</div>
		</div>
	</div>
</VoiceoverSettingsProvider>
