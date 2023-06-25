<script lang="ts">
	import { page } from '$app/stores';
	import AutoSize from '$components/AutoSize.svelte';
	import LowOnCreditsCard from '$components/LowOnCreditsCard.svelte';
	import AudioPlayerWithWaveform from '$components/voiceover/audioPlayer/audioPlayerWithWaveform/AudioPlayerWithWaveform.svelte';
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
	import {
		voiceovers,
		type TVoiceoverOutput,
		type TVoiceover
	} from '$ts/stores/user/voiceovers.js';
	import { browser } from '$app/environment';
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import {
		getUserVoiceoverFullOutputs,
		type TUserVoiceoverFullOutputsPage
	} from '$ts/queries/userVoiceovers';
	import VoiceoverSettingsPanel from '$components/voiceover/generate/VoiceoverSettingsPanel.svelte';
	import VoiceoverSettingsProvider from '$components/voiceover/generate/VoiceoverSettingsProvider.svelte';
	import VoiceoverPromptBar from '$components/voiceover/generate/VoiceoverPromptBar.svelte';
	import VoiceoverListInfinite from '$components/voiceover/lists/VoiceoverListInfinite.svelte';
	import VoiceoverListPlaceholder from '$components/voiceover/lists/VoiceoverListPlaceholder.svelte';
	import LL from '$i18n/i18n-svelte.js';
	import {
		listItemGap,
		listItemHeight,
		listItemWidth,
		listPadding
	} from '$components/voiceover/lists/constants.js';
	import {
		voiceoverDenoiseAudio,
		voiceoverRemoveSilence,
		voiceoverSpeakerId,
		voiceoverStability
	} from '$ts/stores/voiceover/voiceoverSettings.js';
	import { voiceoverLocale, voiceoverModelId } from '$ts/constants/voiceover/models.js';
	import MetaTag from '$components/MetaTag.svelte';
	import { canonicalUrl } from '$ts/constants/main.js';
	import { lowOnCreditsThreshold } from '$ts/constants/credits.js';
	import VoiceoverSettingsSheet from '$components/voiceover/generate/VoiceoverSettingsSheet.svelte';
	import SignInModal from '$components/SignInModal.svelte';
	import { searchParamsString } from '$ts/stores/searchParamsString';
	import IconHourglassAnimated from '$components/icons/IconHourglassAnimated.svelte';

	export let data;

	let isCheckCompleted = true;

	let promptBarHeight: number;
	let promptBarEstimatedHeightRem = 6.25;

	let horizontalListHeightEstimatedRem = 4.25;
	let horizontalListHeight: number;

	let listScrollContainer: HTMLDivElement;
	let listScrollContainerMd: HTMLDivElement;
	let listScrollContainerLg: HTMLDivElement;

	let isSettingsSheetOpen = false;

	function closeSettingsSheet() {
		isSettingsSheetOpen = false;
	}

	function toggleSettingsSheet(state?: boolean) {
		if (state !== undefined) {
			isSettingsSheetOpen = state;
			return;
		}
		isSettingsSheetOpen = !isSettingsSheetOpen;
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
		.flatMap((g) => g.outputs.map((o) => ({ ...o, voiceover: g })));

	let placeholderOutput: TVoiceoverOutput = {
		audio_duration: 0,
		audio_file_url: '',
		id: ''
	};

	let voiceoverPlaceholder: TVoiceover;
	$: voiceoverPlaceholder = {
		...placeholderOutput,
		ui_id: 'placeholder',
		id: 'placeholder',
		created_at: '',
		prompt: {
			id: '1',
			text: 'Create amazing art in seconds with AI.'
		},
		seed: 1,
		speaker: {
			id: $voiceoverSpeakerId,
			locale: $voiceoverLocale
		},
		status: 'pre-submit',
		temperature: Math.round($voiceoverStability) / 100,
		submit_to_gallery: false,
		model_id: $voiceoverModelId,
		num_outputs: 1,
		outputs: [placeholderOutput],
		denoise_audio: $voiceoverDenoiseAudio,
		remove_silence: $voiceoverRemoveSilence
	};

	$: [$voiceoverModelId, $voiceoverSpeakerId, $voiceoverLocale], addOrUpdatPlaceholderVoiceover();

	function addOrUpdatPlaceholderVoiceover() {
		if (voiceoverPlaceholder === undefined) return;
		if ($voiceovers.length < 1) {
			voiceovers.update((voi) => [voiceoverPlaceholder, ...voi]);
			return;
		}
		if (
			$voiceovers[0].status === 'to-be-submitted' ||
			$voiceovers[0].status === 'server-received' ||
			$voiceovers[0].status === 'server-processing'
		)
			return;
		if ($voiceovers[0].status === 'pre-submit') {
			voiceovers.update((voi) => [voiceoverPlaceholder, ...voi.slice(1)]);
			return;
		}
		if ($voiceovers[0].status === 'succeeded' || $voiceovers[0].status === 'failed') {
			voiceovers.update((voi) => [voiceoverPlaceholder, ...voi]);
			return;
		}
	}

	let isSignInModalOpen = false;
	function openSignInModal() {
		isSignInModalOpen = true;
	}
</script>

<MetaTag
	title="Voiceover | Stablecog"
	description="Create voiceovers with AI on Stablecog: Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	image_url="{canonicalUrl}/previews/voiceover-v2.png"
/>

<VoiceoverSettingsProvider serverData={data}>
	<div class="w-full h-full flex flex-col overflow-hidden relative z-0">
		<div class="w-full h-full flex flex-row overflow-hidden pt-1 md:pt-2 md:px-4 md:pb-4 gap-4">
			<div class="hidden lg:flex min-w-[2.75rem] flex-col items-start h-full">
				{#if !$isLeftSidebarHiddenApp}
					<div
						transition:fly|local={{
							duration: 250,
							x: $windowWidth > xlBreakpoint ? -200 : -100,
							easing: quadOut
						}}
						class="h-full flex w-36 xl:w-72 lg:pb-[env(safe-area-inset-bottom)] relative z-10"
					>
						<SidebarWrapper hasGradient>
							<AutoSize bind:element={listScrollContainerLg} let:clientHeight>
								{#if !$page.data.session?.user.id || !$userSummary}
									<VoiceoverListPlaceholder text={$LL.Voiceover.List.NotSignedIn.Paragraph()} />
								{:else if userVoiceoverFullOutputsQuery}
									{#if listScrollContainerLg && clientHeight}
										<VoiceoverListInfinite
											{pinnedFullOutputs}
											paddingLeft={listPadding}
											paddingRight={listPadding}
											paddingTop={listPadding}
											gap={listItemGap}
											itemHeight={listItemHeight}
											paddingBottom={80}
											listScrollContainerHeight={clientHeight}
											listScrollContainer={listScrollContainerLg}
											query={userVoiceoverFullOutputsQuery}
										/>
									{/if}
								{/if}
							</AutoSize>
						</SidebarWrapper>
					</div>
				{/if}
				<SidebarCollapseButton
					side="left"
					size="sm"
					isClosed={$isLeftSidebarHiddenApp}
					isClosedClass="-translate-x-6.5"
					onClick={() => {
						const val = !$isLeftSidebarHiddenApp;
						isLeftSidebarHiddenApp.set(val);
						isLeftSidebarHidden.set(val);
					}}
				/>
			</div>
			<div class="flex flex-col items-center flex-1 min-w-0 h-full">
				{#if $windowWidth < mdBreakpoint && isSettingsSheetOpen}
					<div
						transition:fade|local={{ duration: 200, easing: quadOut }}
						class="fixed w-full h-full left-0 top-0 bg-c-barrier/70 z-40"
					/>
				{/if}
				<div use:clickoutside={{ callback: closeSettingsSheet }} class="w-full">
					<div
						class="w-full z-50 flex flex-col rounded-2xl md:overflow-visible md:rounded-none
						bg-c-bg md:bg-transparent relative"
					>
						{#if !$windowWidth || $windowWidth < mdBreakpoint}
							<VoiceoverSettingsSheet
								{promptBarEstimatedHeightRem}
								{horizontalListHeightEstimatedRem}
								{promptBarHeight}
								{horizontalListHeight}
								{isCheckCompleted}
								isOpen={isSettingsSheetOpen}
							/>
						{/if}
						<div
							bind:clientHeight={horizontalListHeight}
							class="w-full h-17 flex flex-col overflow-hidden relative z-40 md:hidden rounded-t-2xl
							bg-c-bg transform transition duration-250 {isSettingsSheetOpen
								? 'translate-y-full pointer-events-none opacity-0'
								: 'pointer-events-auto'}"
						>
							<AutoSize hideScroll={true} bind:element={listScrollContainer} let:clientWidth>
								{#if !$page.data.session?.user.id || !$userSummary}
									<VoiceoverListPlaceholder
										horizontal={true}
										padding={8}
										gap={listItemGap}
										text={$LL.Voiceover.List.NotSignedIn.Paragraph()}
									/>
								{:else if userVoiceoverFullOutputsQuery}
									{#if listScrollContainer && clientWidth}
										<VoiceoverListInfinite
											horizontal={true}
											{pinnedFullOutputs}
											paddingLeft={8}
											paddingTop={8}
											paddingBottom={8}
											gap={listItemGap}
											itemWidth={listItemWidth}
											listScrollContainerWidth={clientWidth}
											{listScrollContainer}
											query={userVoiceoverFullOutputsQuery}
										/>
									{/if}
								{/if}
							</AutoSize>
						</div>
						<div
							bind:clientHeight={promptBarHeight}
							class="w-full bg-c-bg md:bg-transparent
							pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:pb-4 z-40"
						>
							<div class="w-full flex flex-col md:max-h-[30vh] md:min-h-[12rem] px-2 md:px-0">
								<VoiceoverPromptBar {openSignInModal} {toggleSettingsSheet} {isSettingsSheetOpen} />
							</div>
						</div>
					</div>
				</div>
				{#if $page.data.session?.user.id && $userSummary && $userSummary.total_remaining_credits < lowOnCreditsThreshold}
					<div
						transition:expandCollapse|local={{ duration: 200 }}
						class="w-full flex flex-col justify-start items-center order-first md:order-last"
					>
						<div class="w-full px-2.5 md:px-2px pb-2.5 md:pb-4">
							<LowOnCreditsCard />
						</div>
					</div>
				{/if}
				<div
					class="w-full flex flex-col justify-start flex-1 min-h-0 md:pb-[env(safe-area-inset-bottom)] relative z-0 order-first md:order-last"
				>
					<div
						class="w-full flex-1 min-h-0 flex flex-col justify-start overflow-hidden px-2 pb-4 md:p-0"
					>
						<div class="flex-1 min-h-0 w-full flex flex-col overflow-hidden relative">
							<AudioPlayerWithWaveform voiceover={$voiceovers[0]} />
						</div>
					</div>
					<div class="w-full hidden md:block lg:hidden pt-4">
						<div class="h-30 flex flex-col">
							<SidebarWrapper>
								<AutoSize hideScroll={true} bind:element={listScrollContainerMd} let:clientWidth>
									{#if !$page.data.session?.user.id || !$userSummary}
										<VoiceoverListPlaceholder
											horizontal={true}
											text={$LL.Voiceover.List.NotSignedIn.Paragraph()}
										/>
									{:else if userVoiceoverFullOutputsQuery}
										{#if listScrollContainerMd && clientWidth}
											<VoiceoverListInfinite
												horizontal={true}
												{pinnedFullOutputs}
												paddingLeft={listPadding}
												paddingTop={listPadding}
												paddingBottom={listPadding}
												gap={listItemGap}
												itemWidth={listItemWidth}
												listScrollContainerWidth={clientWidth}
												listScrollContainer={listScrollContainerMd}
												query={userVoiceoverFullOutputsQuery}
											/>
										{/if}
									{/if}
								</AutoSize>
							</SidebarWrapper>
						</div>
					</div>
				</div>
			</div>
			<div class="h-full w-72 hidden md:flex md:pb-[env(safe-area-inset-bottom)]">
				<VoiceoverSettingsPanel {isCheckCompleted} />
			</div>
		</div>
	</div>
	{#if isSignInModalOpen && (!$page.data.session?.user.id || !$userSummary)}
		<SignInModal
			redirectTo={$page.url.pathname + $searchParamsString}
			onClickoutside={() => (isSignInModalOpen = false)}
		/>
	{/if}
</VoiceoverSettingsProvider>
