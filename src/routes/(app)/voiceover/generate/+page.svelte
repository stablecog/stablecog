<script lang="ts">
	import { browser } from '$app/environment';
	import LowOnCreditsCard from '$components/cards/LowOnCreditsCard.svelte';
	import SidebarCollapseButton from '$components/generate/SidebarCollapseButton.svelte';
	import SidebarWrapper from '$components/generate/SidebarWrapper.svelte';
	import { mdBreakpoint, xlBreakpoint } from '$components/generationFullScreen/constants.js';
	import IllustrationDeprecated from '$components/illustrations/IllustrationDeprecated.svelte';
	import AutoSize from '$components/utils/AutoSize.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import VoiceoverPromptBar from '$components/voiceover/generate/VoiceoverPromptBar.svelte';
	import VoiceoverSettingsPanel from '$components/voiceover/generate/VoiceoverSettingsPanel.svelte';
	import VoiceoverSettingsProvider from '$components/voiceover/generate/VoiceoverSettingsProvider.svelte';
	import VoiceoverSettingsSheet from '$components/voiceover/generate/VoiceoverSettingsSheet.svelte';
	import {
		listItemGap,
		listItemHeight,
		listItemWidth,
		listPadding
	} from '$components/voiceover/lists/constants.js';
	import VoiceoverListInfinite from '$components/voiceover/lists/VoiceoverListInfinite.svelte';
	import VoiceoverListPlaceholder from '$components/voiceover/lists/VoiceoverListPlaceholder.svelte';
	import LL from '$i18n/i18n-svelte.js';
	import { clickoutside } from '$ts/actions/clickoutside.js';
	import { expandCollapse } from '$ts/animation/transitions.js';
	import { lowOnCreditsThreshold } from '$ts/constants/credits.js';
	import { canonicalUrl } from '$ts/constants/main.js';
	import { sessionStore } from '$ts/constants/supabase';
	import { voiceoverLocale, voiceoverModelId } from '$ts/constants/voiceover/models.js';
	import {
		getUserVoiceoverFullOutputs,
		type TUserVoiceoverFullOutputsPage
	} from '$ts/queries/userVoiceovers';
	import { isSignInModalOpen } from '$ts/stores/isSignInModalOpen.js';
	import { isLeftSidebarHidden, isLeftSidebarHiddenApp } from '$ts/stores/sidebars.js';
	import { userSummary } from '$ts/stores/user/summary.js';
	import {
		voiceovers,
		type TVoiceover,
		type TVoiceoverOutput
	} from '$ts/stores/user/voiceovers.js';
	import {
		voiceoverDenoiseAudio,
		voiceoverRemoveSilence,
		voiceoverSpeakerId,
		voiceoverStability
	} from '$ts/stores/voiceover/voiceoverSettings.js';
	import { windowWidth } from '$ts/stores/window.js';
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import { quadOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	export let data;

	let isCheckCompleted = true;

	let promptBarHeight: number;
	let promptBarEstimatedHeightRem = 6.125;

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
		browser && $sessionStore?.user.id && $userSummary
			? createInfiniteQuery({
					queryKey: userVoiceoverFullOutputsQueryKey,
					queryFn: async ({ pageParam }) => {
						let outputsPage = await getUserVoiceoverFullOutputs({
							access_token: $sessionStore?.access_token || '',
							cursor: pageParam !== undefined ? String(pageParam) : undefined
						});
						return outputsPage;
					},
					getNextPageParam: (lastPage: TUserVoiceoverFullOutputsPage) => {
						if (!lastPage.next) return undefined;
						return lastPage.next;
					},
					initialPageParam: undefined
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

	function openSignInModal() {
		isSignInModalOpen.set(true);
	}
</script>

<MetaTag
	title="Voiceover | Stablecog"
	description="Create voiceovers with AI on Stablecog: Free, multilingual and open-source AI image generator using Stable Diffusion, FLUX, and Kandinsky."
	image_url="{canonicalUrl}/previews/voiceover-v2.png"
/>

<VoiceoverSettingsProvider serverData={data}>
	<div class="relative z-0 flex h-full w-full flex-col overflow-hidden">
		<div
			class="flex h-full w-full flex-row gap-4 overflow-hidden pb-[calc(env(safe-area-inset-bottom)+10.5rem)] pt-1 md:px-4 md:pb-[calc(env(safe-area-inset-bottom)+1rem)] md:pt-2"
		>
			<div class="relative hidden h-full min-w-[2.75rem] flex-col items-start lg:flex">
				{#if !$isLeftSidebarHiddenApp}
					<div
						transition:fly={{
							duration: 250,
							x: $windowWidth > xlBreakpoint ? -200 : -100,
							easing: quadOut
						}}
						class="relative z-10 flex h-full w-36 xl:w-72"
					>
						<SidebarWrapper hasGradient>
							<AutoSize bind:element={listScrollContainerLg} let:clientHeight>
								{#if !$sessionStore?.user.id || !$userSummary}
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
			<div class="flex h-full min-w-0 flex-1 flex-col items-center">
				{#if $windowWidth < mdBreakpoint && isSettingsSheetOpen}
					<div
						transition:fade={{ duration: 200, easing: quadOut }}
						class="fixed left-0 top-0 z-40 h-full w-full bg-c-barrier/70"
					/>
				{/if}
				<div use:clickoutside={{ callback: closeSettingsSheet }} class="w-full">
					<div
						class="absolute bottom-0 left-0 z-50 flex w-full flex-col rounded-2xl
						bg-c-bg md:relative md:z-40 md:overflow-visible md:rounded-none md:bg-transparent"
					>
						<VoiceoverSettingsSheet
							{promptBarEstimatedHeightRem}
							{horizontalListHeightEstimatedRem}
							{promptBarHeight}
							{horizontalListHeight}
							{isCheckCompleted}
							isOpen={isSettingsSheetOpen}
						/>
						<div
							bind:clientHeight={horizontalListHeight}
							class="relative z-40 flex h-17 w-full transform flex-col overflow-hidden rounded-t-2xl
							bg-c-bg transition duration-300 md:hidden {isSettingsSheetOpen
								? 'pointer-events-none translate-y-full opacity-0'
								: 'pointer-events-auto'}"
						>
							<AutoSize hideScroll={true} bind:element={listScrollContainer} let:clientWidth>
								{#if !$sessionStore?.user.id || !$userSummary}
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
							class="z-40 w-full bg-c-bg
							pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:bg-transparent md:pb-3.75"
						>
							<div class="flex w-full flex-col px-2 md:max-h-[15vh] md:min-h-[12rem] md:px-0">
								<VoiceoverPromptBar
									disabled={true}
									{openSignInModal}
									{toggleSettingsSheet}
									{isSettingsSheetOpen}
								/>
							</div>
						</div>
					</div>
				</div>
				{#if $sessionStore?.user.id && $userSummary && $userSummary.total_remaining_credits < lowOnCreditsThreshold}
					<div
						transition:expandCollapse={{ duration: 200 }}
						class="order-first flex w-full flex-col items-center justify-start md:order-last"
					>
						<div class="w-full px-2.5 pb-2.5 md:px-2px md:pb-4">
							<LowOnCreditsCard />
						</div>
					</div>
				{/if}
				<div
					class="relative z-30 order-first my-auto flex min-h-0 w-full flex-1 flex-col justify-start md:z-40 md:order-last"
				>
					<div class="my-auto flex min-h-0 w-full flex-1 flex-col justify-start px-2 pb-4 md:p-0">
						<div
							class="relative my-auto flex min-h-0 w-full flex-shrink flex-col items-center pb-[calc(1vh+1rem)] pt-4 md:pb-[calc(3vh+1rem)] md:pt-8"
						>
							<p class="max-w-md px-5 text-center font-medium opacity-75 md:text-lg">
								{$LL.Shared.FeatureNoLongerAvailableParagraph()}
							</p>
							<div
								class="mt-8 flex max-h-full min-h-0 w-[min(33%,12rem)] max-w-full flex-shrink items-center justify-center"
							>
								<IllustrationDeprecated class="h-auto max-h-full w-auto max-w-full opacity-75" />
							</div>
							<!-- <AudioPlayerWithWaveform voiceover={$voiceovers[0]} /> -->
						</div>
					</div>
					<div class="hidden w-full pt-4 md:block lg:hidden">
						<div class="flex h-30 flex-col">
							<SidebarWrapper>
								<AutoSize hideScroll={true} bind:element={listScrollContainerMd} let:clientWidth>
									{#if !$sessionStore?.user.id || !$userSummary}
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
			<div class="hidden h-full w-72 md:flex">
				<VoiceoverSettingsPanel {isCheckCompleted} />
			</div>
		</div>
	</div>
</VoiceoverSettingsProvider>
