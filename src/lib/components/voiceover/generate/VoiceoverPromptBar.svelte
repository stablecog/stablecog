<script lang="ts">
	import { page } from '$app/stores';
	import InsufficientCreditsBadge from '$components/badges/InsufficientCreditsBadge.svelte';
	import Button from '$components/buttons/Button.svelte';
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
	import { onMount } from 'svelte';

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
	class="w-full flex flex-col rounded-2xl overflow-hidden relative bg-c-bg-secondary"
>
	<div class="w-full flex flex-col relative">
		<textarea
			bind:value={$voiceoverPrompt}
			placeholder={$LL.Voiceover.PromptBar.PromptInput.Placeholder()}
			class="w-full h-full bg-c-bg-secondary rounded-t-2xl resize-none px-5 py-4
			relative text-lg pb-6 placeholder:text-c-on-bg/40"
			rows="7"
			maxlength={maxVoiceoverCharacterCount}
		/>
		<div
			class="w-full absolute left-0 bottom-0 h-4 bg-gradient-to-t from-c-bg-secondary to-c-bg-secondary/0"
		/>
	</div>
	<div
		class="w-full rounded-b-xl pointer-events-none
   	 	flex justify-end items-center px-3 pt-2 pb-4 bg-c-bg-secondary gap-4"
	>
		<div
			class="flex flex-col items-end justify-center font-medium text-right text-sm pointer-events-auto"
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
		<div class="relative flex justify-end">
			<Button
				withSpinner
				noPadding
				fadeOnDisabled={doesntHaveEnoughCredits}
				loading={$maxOngoingVoiceoversCountReached}
				disabled={doesntHaveEnoughCredits}
				class="pointer-events-auto px-8 py-3.5">{$LL.Home.GenerateButton()}</Button
			>
			{#if doesntHaveEnoughCredits && $userSummary && $page.data.session?.user.id}
				<InsufficientCreditsBadge
					neededCredits={creditCost}
					remainingCredits={$userSummary.total_remaining_credits}
				/>
			{/if}
		</div>
	</div>
</form>
