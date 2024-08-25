<script lang="ts">
	import IconSpeaker from '$components/icons/IconVoiceoverSpeaker.svelte';
	import MuteButton from '$components/voiceover/audioPlayer/MuteButton.svelte';
	import PlayPauseButton from '$components/voiceover/audioPlayer/PlayPauseButton.svelte';
	import Slider from '$components/voiceover/audioPlayer/Slider.svelte';
	import {
		areValuesTooClose,
		convertSecondsToTimestamp,
		toggleMute,
		togglePlay
	} from '$components/voiceover/audioPlayer/helpers';
	import { voiceoverSpeakerIdToDisplayName } from '$ts/constants/voiceover/models';
	import { allAudioPlayers } from '$ts/stores/allPlayers';
	import { onDestroy, onMount } from 'svelte';
	import { voiceovers, type TVoiceoverFullOutput } from '$ts/stores/user/voiceovers';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconSadFaceOutline from '$components/icons/IconSadFaceOutline.svelte';
	import { quadOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';
	import { timestampPlaceholder } from '$components/voiceover/audioPlayer/constants';
	import IconHourglassAnimated from '$components/icons/IconHourglassAnimated.svelte';
	import Morpher from '$components/utils/Morpher.svelte';
	import { flyAndScale } from '$ts/animation/transitions';
	import { lgBreakpoint } from '$components/generationFullScreen/constants';
	import { windowWidth } from '$ts/stores/window';
	import ThreeDotDropdown from '$components/voiceover/audioPlayer/ThreeDotDropdown.svelte';
	import ModalWrapper from '$components/modals/ModalWrapper.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import LL, { locale } from '$i18n/i18n-svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import { getApiUrl } from '$ts/constants/main';
	import { page } from '$app/stores';
	import { logVoiceoverOutputDeleted } from '$ts/helpers/loggers';
	import { appVersion } from '$ts/stores/appVersion';
	import { userSummary } from '$ts/stores/user/summary';
	import type { TUserVoiceoverFullOutputsPage } from '$ts/queries/userVoiceovers';
	import { useQueryClient } from '@tanstack/svelte-query';
	import IconTrashcan from '$components/icons/IconTrashcan.svelte';
	import { sessionStore } from '$ts/constants/supabase';

	export let output: TVoiceoverFullOutput;
	export let hasDeleteButton = false;
	export let hasMute = false;
	export let inHorizontal = false;
	export { classes as class };
	export let noLayoutChange = false;

	let classes = '';

	let playButton: HTMLButtonElement;
	let muteButton: HTMLButtonElement;
	const queryClient = hasDeleteButton ? useQueryClient() : undefined;

	let currentTime = 0;
	let duration: number;
	let sliderValue = 0;
	let audioElement: HTMLAudioElement;
	let isPaused = true;
	let isPlaying = false;
	let isMuted = false;
	let buffered: TimeRanges;

	$: totalTimestamp = duration
		? convertSecondsToTimestamp(duration)
		: output.audio_duration
			? convertSecondsToTimestamp(output.audio_duration)
			: undefined;
	$: currentTimestamp = currentTime ? convertSecondsToTimestamp(currentTime) : undefined;

	$: [currentTime], onCurrentTimeChanged();
	$: [sliderValue], onSliderValueChanged();

	$: isOutputLoadingOrFailed =
		output.voiceover.status === 'failed' ||
		output.voiceover.status === 'to-be-submitted' ||
		output.voiceover.status === 'server-received' ||
		output.voiceover.status === 'server-processing';

	function onCurrentTimeChanged() {
		sliderValue = Math.floor(currentTime * 1000);
	}

	let sliderStoppedAudio = false;
	function onSliderValueChanged() {
		const toBeTime = sliderValue / 1000;
		if (areValuesTooClose(toBeTime, currentTime)) return;
		if (!audioElement.paused) {
			audioElement.pause();
			sliderStoppedAudio = true;
		}
		currentTime = toBeTime;
	}

	function sliderOnPointerUp() {
		if (sliderStoppedAudio && audioElement.paused) {
			audioElement.play();
		}
		sliderStoppedAudio = false;
	}

	function onKeyDown(e: any) {
		if (e.target === playButton || e.target === muteButton) return;
		if (e.key === ' ') {
			togglePlay({ audioElement });
		}
	}

	let isDeleteModalOpen = false;
	const itemsToBeDeletedCount = 1;
	let actionStatus: 'idle' | 'loading' | 'success' | 'error' = 'idle';
	let modalScrollContainer: HTMLDivElement;

	const openDeleteModal = () => (isDeleteModalOpen = true);
	const closeDeleteModal = () => (isDeleteModalOpen = false);

	function onDeleteModalConfirmButtonClicked() {
		if (!output.voiceover.id) return;
		togglePlay({ audioElement, state: 'pause' });
		deleteVoiceoverOutputs([{ output_id: output.id, voiceover_id: output.voiceover.id }]);
	}

	async function deleteVoiceoverOutputs(idObjects: { output_id: string; voiceover_id: string }[]) {
		actionStatus = 'loading';
		try {
			const res = await fetch(`${getApiUrl().origin}/v1/user/audio/voiceover`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$sessionStore?.access_token}`
				},
				body: JSON.stringify({ output_ids: idObjects.map((o) => o.output_id) })
			});
			if (!res.ok) throw new Error('Response not ok');
			console.log('Delete voiceover output response', res);
			queryClient?.setQueryData(['user_voiceover_full_outputs'], (data: any) => ({
				...data,
				pages: data.pages.map((page: TUserVoiceoverFullOutputsPage) => {
					return {
						...page,
						outputs: page.outputs.map((output) =>
							idObjects.map((i) => i.output_id).includes(output.id)
								? { ...output, is_deleted: true }
								: output
						)
					};
				})
			}));
			if ($voiceovers.flatMap((v) => v.outputs).some((o) => o.id === output.id)) {
				$voiceovers = $voiceovers.map((v) => ({
					...v,
					outputs: v.outputs.map((o) => (o.id === output.id ? { ...o, is_deleted: true } : o))
				}));
			}
			for (let i = 0; i < idObjects.length; i++) {
				let idObject = idObjects[i];
				const logProps = {
					'SC - Voiceover Id': idObject.voiceover_id,
					'SC - Output Id': idObject.output_id,
					'SC - Locale': $locale,
					'SC - Page': `${$page.url.pathname}${$page.url.search}`,
					'SC - User Id': $sessionStore?.user.id,
					'SC - Stripe Product Id': $userSummary?.product_id,
					'SC - App Version': $appVersion
				};
				logVoiceoverOutputDeleted(logProps);
			}
		} catch (error) {
			console.log('Error deleting generation output', error);
		}
		closeDeleteModal();
		actionStatus = 'idle';
	}

	onMount(() => {
		$allAudioPlayers.add(audioElement);
	});

	onDestroy(async () => {
		audioElement?.pause();
		$allAudioPlayers.delete(audioElement);
	});
</script>

<div
	in:flyAndScale={{
		duration:
			output.voiceover.created_at &&
			Date.now() - new Date(output.voiceover.created_at).getTime() < 1000
				? 300
				: 0,
		yPercent: $windowWidth < lgBreakpoint ? 0 : -100,
		xPercent: $windowWidth < lgBreakpoint ? -100 : 0
	}}
	on:keydown={onKeyDown}
	tabindex="0"
	role="button"
	class="{inHorizontal ? 'h-full' : ''} w-full bg-c-bg-secondary {noLayoutChange
		? 'flex flex-col items-start rounded-xl px-3 pb-1 pt-1.5'
		: 'flex flex-row items-center rounded-lg px-1 py-1 md:flex-col md:items-start md:rounded-xl md:px-3 md:pb-1 md:pt-1.5'}
		group/audio-player-list-item relative
		z-0 cursor-default overflow-hidden shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] {classes}"
>
	<div
		class="{noLayoutChange
			? 'w-full pb-1'
			: 'pl-0.5 pr-1 md:w-full md:pb-1 md:pl-0 md:pr-0'} flex items-center justify-between gap-2"
	>
		<div class="flex w-full min-w-0 flex-shrink items-center justify-start py-0.5">
			<div
				class="relative z-0 flex
					items-center justify-start overflow-hidden rounded-md bg-c-bg-tertiary ring-2 ring-c-bg-tertiary"
			>
				<div
					class="{noLayoutChange
						? 'h-7 w-7'
						: 'h-10 w-10 md:h-7 md:w-7'} relative z-0 flex-shrink-0 overflow-hidden shadow-lg"
				>
					<IconSpeaker
						class="h-full w-full"
						type={output.voiceover.speaker.id}
						sizes={noLayoutChange ? '28px' : '(min-width: 768px) 28px, 40px'}
					/>
				</div>
				<p
					class="{noLayoutChange ? 'block' : 'hidden md:block'} h-full min-w-0 flex-shrink
					overflow-hidden overflow-ellipsis whitespace-nowrap px-2.5 py-1
					text-sm font-medium text-c-on-bg"
				>
					{$voiceoverSpeakerIdToDisplayName[output.voiceover.speaker.id]}
				</p>
			</div>
		</div>
		<div class="{noLayoutChange ? 'flex' : 'hidden md:flex lg:hidden xl:flex'} -mr-2 items-center">
			<ThreeDotDropdown {output} {hasDeleteButton} onDeleteClicked={openDeleteModal} />
		</div>
	</div>
	{#if !noLayoutChange}
		<p
			class="hidden max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap py-1 text-sm text-c-on-bg lg:block xl:hidden"
		>
			{output.voiceover.prompt.text}
		</p>
	{/if}
	<div
		class="{inHorizontal ? 'h-full' : ''} {noLayoutChange
			? 'w-full'
			: 'md:w-full'} flex min-w-0 flex-1 items-center justify-center"
	>
		<audio
			src={output.audio_file_url}
			aria-label={output.voiceover.prompt.text}
			bind:currentTime
			bind:duration
			bind:this={audioElement}
			bind:muted={isMuted}
			bind:buffered
			preload="none"
			on:playing={() => {
				isPlaying = true;
			}}
			on:play={() => (isPaused = false)}
			on:pause={() => {
				isPaused = true;
				isPlaying = false;
			}}
		/>
		<div class="flex items-center {noLayoutChange ? '-ml-2' : 'md:-ml-2'}">
			<PlayPauseButton
				bind:element={playButton}
				onClick={() => {
					togglePlay({ audioElement });
				}}
				{isPaused}
				{isPlaying}
				disabled={isOutputLoadingOrFailed}
			/>
			{#if hasMute}
				<MuteButton
					bind:element={muteButton}
					onClick={() => toggleMute(audioElement)}
					{isMuted}
					disabled={isOutputLoadingOrFailed}
				/>
			{/if}
		</div>
		<div
			class="flex min-w-0 flex-1 flex-col {noLayoutChange
				? 'pl-2 pr-0.5'
				: '-mb-2.5 pl-1 pr-0.5 md:mb-0 md:pl-2'}"
		>
			<p
				class="{noLayoutChange
					? 'block py-1'
					: 'md:py-1 lg:hidden xl:block'} max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap
				text-xs text-c-on-bg md:text-sm"
			>
				{output.voiceover.prompt.text}
			</p>
			<div
				class="flex w-full items-center {noLayoutChange
					? '-mt-1'
					: '-mt-1.5 md:-mt-1 lg:mt-0 xl:-mt-1'}"
			>
				<div class="h-8 flex-1 self-stretch">
					<div class="relative flex h-full w-full items-center">
						<Slider
							{buffered}
							disabled={isOutputLoadingOrFailed}
							{duration}
							min={0}
							max={Math.floor((duration || output.audio_duration) * 1000)}
							name="Audio Player"
							bind:value={sliderValue}
							step={1}
							onPointerUp={sliderOnPointerUp}
						/>
					</div>
				</div>
				<p
					class="{noLayoutChange
						? 'block'
						: 'hidden md:block lg:hidden xl:block'} pl-3 text-xs text-c-on-bg/50"
				>
					{currentTime && currentTimestamp ? currentTimestamp : timestampPlaceholder}
					<span class="text-c-on-bg/25">/</span>
					{(duration || output.audio_duration) && totalTimestamp
						? totalTimestamp
						: timestampPlaceholder}
				</p>
			</div>
		</div>
	</div>
	{#if !noLayoutChange}
		<div
			class="flex w-auto items-center justify-between md:hidden md:w-full lg:flex lg:pb-0.5 xl:hidden"
		>
			<div class="-mr-0.5 flex items-center lg:-ml-2 lg:mr-0">
				<ThreeDotDropdown {output} {hasDeleteButton} onDeleteClicked={openDeleteModal} />
			</div>
			<div
				class="order-first min-w-0 flex-shrink pl-2 text-right text-xs text-c-on-bg/50 lg:order-last lg:pl-3"
			>
				<p class="min-w-0 flex-shrink overflow-hidden overflow-ellipsis px-0.25">
					{currentTime && currentTimestamp ? currentTimestamp : timestampPlaceholder}
				</p>
				<p class="min-w-0 flex-shrink overflow-hidden overflow-ellipsis px-0.25">
					{(duration || output.audio_duration) && totalTimestamp
						? totalTimestamp
						: timestampPlaceholder}
				</p>
			</div>
		</div>
	{/if}
	<!-- If loading or failed -->
	{#if isOutputLoadingOrFailed}
		<div
			transition:fade={{ duration: 200, easing: quadOut }}
			class="absolute left-0 top-0 flex h-full w-full items-center justify-center {output.voiceover
				.status === 'failed'
				? 'bg-c-bg-secondary'
				: 'bg-c-bg-secondary/90'}"
		>
			{#if output.voiceover.status === 'failed'}
				<IconSadFaceOutline class="h-7 w-7 text-c-on-bg-faded md:h-8 md:w-8" />
			{:else}
				<Morpher
					morphed={output.status === 'to-be-submitted' || output.status === 'server-received'}
				>
					<IconAnimatedSpinner
						slot="0"
						class="h-7 w-7 text-c-on-bg-faded md:h-8 md:w-8"
						loading={true}
					/>
					<IconHourglassAnimated slot="1" class="h-7 w-7 text-c-on-bg-faded md:h-8 md:w-8" />
				</Morpher>
			{/if}
		</div>
	{/if}
	{#if output.is_deleted}
		<div
			transition:fade={{ duration: 200, easing: quadOut }}
			class="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-c-bg-secondary/90"
		>
			<div transition:scale={{ duration: 200, opacity: 0, start: 0, easing: quadOut }}>
				<IconTrashcan class="h-6 w-6 text-c-danger md:h-8 md:w-8" />
			</div>
		</div>
	{/if}
</div>

{#if isDeleteModalOpen}
	<ModalWrapper bind:scrollContainer={modalScrollContainer}>
		<div
			use:clickoutside={{
				callback: () => {
					if (actionStatus === 'loading') {
						return;
					}
					isDeleteModalOpen = false;
				}
			}}
			class="my-auto max-w-full"
		>
			<div
				class="flex w-full max-w-md flex-col rounded-xl bg-c-bg p-5 shadow-2xl shadow-c-shadow/[var(--o-shadow-stronger)] ring-2 ring-c-bg-secondary md:p-6"
			>
				<h1 class="-mt-1 text-xl font-bold">
					{$LL.Shared.BatchEditBar.ConfirmationModal.Delete.Title({
						selectedCount: itemsToBeDeletedCount
					})}
				</h1>
				<p class="mt-3 leading-relaxed text-c-on-bg/75">
					{$LL.Shared.BatchEditBar.ConfirmationModal.Delete.Paragraph({
						selectedCount: itemsToBeDeletedCount
					})}
				</p>
				<div class="mt-6 flex w-full flex-wrap items-stretch justify-end gap-2">
					<div class="-mb-1.5 -mr-2 flex w-full flex-wrap items-stretch justify-end">
						<Button
							disabled={actionStatus === 'loading'}
							onClick={closeDeleteModal}
							size="sm"
							type="no-bg-on-bg"
						>
							{$LL.Shared.BatchEditBar.ConfirmationModal.CancelButton()}</Button
						>
						<Button
							withSpinner
							loading={actionStatus === 'loading'}
							size="sm"
							onClick={onDeleteModalConfirmButtonClicked}
						>
							{$LL.Shared.BatchEditBar.ConfirmationModal.Delete.ConfirmButton()}
						</Button>
					</div>
				</div>
			</div>
		</div>
	</ModalWrapper>
{/if}
