<script lang="ts">
	import { page } from '$app/stores';
	import Morpher from '$components/Morpher.svelte';
	import InsufficientCreditsBadge from '$components/badges/InsufficientCreditsBadge.svelte';
	import Button from '$components/buttons/Button.svelte';
	import NoBgButton from '$components/buttons/NoBgButton.svelte';
	import { mdBreakpoint } from '$components/generationFullScreen/constants';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import IconSettings from '$components/icons/IconSettings.svelte';
	import IconWand from '$components/icons/IconWand.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { maxSeed } from '$ts/constants/main';
	import { voiceoverLocale, voiceoverModelId } from '$ts/constants/voiceover/models';
	import {
		getVoiceoverCreditCost,
		maxVoiceoverCharacterCount,
		voiceoverStabilityHardMin
	} from '$ts/constants/voiceover/rest';
	import { generateSSEId } from '$ts/helpers/generateSSEId';
	import { sseId } from '$ts/stores/user/sse';
	import { userSummary } from '$ts/stores/user/summary';
	import {
		maxOngoingVoiceoversCountReached,
		queueInitialVoiceoverRequest
	} from '$ts/stores/user/voiceovers';
	import {
		voiceoverDenoiseAudio,
		voiceoverPrompt,
		voiceoverPromptLocal,
		voiceoverRemoveSilence,
		voiceoverSeed,
		voiceoverSpeakerId,
		voiceoverStability
	} from '$ts/stores/voiceover/voiceoverSettings';
	import { windowWidth } from '$ts/stores/window';
	import { onMount } from 'svelte';

	export let toggleSettingsSheet: () => void;
	export let isSettingsSheetOpen: boolean;

	$: creditCost = getVoiceoverCreditCost($voiceoverPrompt || '');
	$: doesntHaveEnoughCredits =
		$userSummary !== undefined &&
		$userSummary !== null &&
		$userSummary.total_remaining_credits < creditCost;

	$: [$voiceoverPrompt],
		withCheck(() => {
			if (!voiceoverPrompt) return;
			voiceoverPromptLocal.set($voiceoverPrompt);
		});

	function onSubmit() {
		if ($maxOngoingVoiceoversCountReached) return;
		if (!$sseId) return;
		if (!$voiceoverPrompt) return;
		if (doesntHaveEnoughCredits) return;
		queueInitialVoiceoverRequest({
			model_id: $voiceoverModelId,
			speaker: {
				id: $voiceoverSpeakerId,
				locale: $voiceoverLocale
			},
			prompt: { id: 'prompt', text: $voiceoverPrompt },
			temperature: Math.max(voiceoverStabilityHardMin, $voiceoverStability) / 100,
			num_outputs: 1,
			seed: $voiceoverSeed || Math.round(Math.random() * maxSeed),
			stream_id: $sseId,
			submit_to_gallery: false,
			ui_id: generateSSEId(),
			denoise_audio: $voiceoverDenoiseAudio,
			remove_silence: $voiceoverRemoveSilence
		});
	}

	function withCheck(fn: () => void) {
		if (!mounted) return;
		fn();
	}

	let mounted = false;

	function getNotFadedSpan(text: string) {
		return `<span class="text-c-on-bg/75">${text}</span>`;
	}

	onMount(() => {
		if ($voiceoverPromptLocal) {
			voiceoverPrompt.set($voiceoverPromptLocal);
		}
		mounted = true;
	});
</script>

<form
	on:submit={onSubmit}
	class="w-full max-h-full flex flex-col rounded-xl md:rounded-2xl
	overflow-hidden relative bg-c-bg-secondary"
>
	<div class="w-full flex-1 min-h-0 flex flex-col relative">
		<textarea
			bind:value={$voiceoverPrompt}
			placeholder={$LL.Voiceover.PromptBar.PromptInput.Placeholder()}
			class="md:hidden w-full h-full bg-c-bg-secondary rounded-t-xl md:rounded-t-2xl resize-none px-3 md:px-5 py-2.5 md:py-4
			relative text-base md:text-lg placeholder:text-c-on-bg/40"
			rows="3"
			maxlength={maxVoiceoverCharacterCount}
		/>
		<textarea
			bind:value={$voiceoverPrompt}
			placeholder={$LL.Voiceover.PromptBar.PromptInput.Placeholder()}
			class="hidden md:block w-full h-full bg-c-bg-secondary rounded-t-xl md:rounded-t-2xl resize-none px-3 md:px-5 py-2.5 md:py-4
			relative text-base md:text-lg pb-6 placeholder:text-c-on-bg/40"
			rows="7"
			maxlength={maxVoiceoverCharacterCount}
		/>
		<div
			class="w-full absolute left-0 bottom-0 h-4 bg-gradient-to-t from-c-bg-secondary to-c-bg-secondary/0 pointer-events-none"
		/>
	</div>
	<div
		class="w-full rounded-b-xl md:rounded-b-2xl pointer-events-none
   	 	flex justify-end items-stretch md:items-center px-2 pt-2 pb-2.5 md:px-3 md:pt-2 md:pb-4 bg-c-bg-secondary gap-4"
	>
		<div
			class="flex flex-col items-end justify-center font-medium text-right text-xs md:text-sm pointer-events-auto"
		>
			<p class="text-c-on-bg/75">
				{($voiceoverPrompt || '').length.toLocaleString($locale)}<span class="text-c-on-bg/50"
					>/{maxVoiceoverCharacterCount.toLocaleString($locale)}</span
				>
			</p>
			<p class="mt-0.5 text-c-on-bg/50">
				{@html $LL.Voiceover.PromptBar.CreditCost({
					creditCost: getNotFadedSpan(creditCost.toLocaleString($locale))
				})}
			</p>
		</div>
		<NoBgButton
			size="sm"
			noPadding
			paddingClassForHoverEffect="px-1"
			onClick={toggleSettingsSheet}
			class="self-stretch md:hidden px-3 py-2 -ml-3 -mr-3"
			hoverFrom="bottom"
			name={isSettingsSheetOpen
				? $LL.Generate.HideSettingsButton()
				: $LL.Generate.ShowSettingsButton()}
		>
			<Morpher morphed={$windowWidth < mdBreakpoint && isSettingsSheetOpen}>
				<div slot="0" class="w-8 h-8">
					<IconSettings
						class="transition not-touch:group-hover:text-c-primary
						w-full h-full {$windowWidth < mdBreakpoint && isSettingsSheetOpen ? 'rotate-180' : 'rotate-0'}"
					/>
				</div>
				<div slot="1" class="w-8 h-8">
					<IconChevronDown
						class="transition transform not-touch:group-hover:text-c-primary
						w-full h-full {$windowWidth < mdBreakpoint && !isSettingsSheetOpen ? '-rotate-180' : 'rotate-0'}"
					/>
				</div>
			</Morpher>
		</NoBgButton>
		<div class="relative flex justify-end w-12 h-12 md:w-auto md:h-auto">
			<Button
				withSpinner
				noPadding
				noRounding
				fadeOnDisabled={doesntHaveEnoughCredits}
				loading={$maxOngoingVoiceoversCountReached}
				disabled={doesntHaveEnoughCredits}
				class="pointer-events-auto w-full h-full md:w-auto md:h-auto md:px-8 md:py-3.5 rounded-lg md:rounded-xl"
			>
				<span class="hidden md:block">{$LL.Voiceover.PromptBar.GenerateButton()}</span>
				<IconWand class="w-7 h-7 md:hidden" />
			</Button>
			{#if doesntHaveEnoughCredits && $userSummary && $page.data.session?.user.id}
				<InsufficientCreditsBadge
					neededCredits={creditCost}
					remainingCredits={$userSummary.total_remaining_credits}
				/>
			{/if}
		</div>
	</div>
</form>
