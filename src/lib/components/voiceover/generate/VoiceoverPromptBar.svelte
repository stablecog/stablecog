<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import LL from '$i18n/i18n-svelte';
	import { maxSeed } from '$ts/constants/main';
	import { voiceoverModelId } from '$ts/constants/voiceover/models';
	import { getVoiceoverCreditCost, maxVoiceoverCharacterCount } from '$ts/constants/voiceover/rest';
	import { generateSSEId } from '$ts/helpers/generateSSEId';
	import { sseId } from '$ts/stores/user/sse';
	import {
		maxOngoingVoiceoversCountReached,
		queueInitialVoiceoverRequest
	} from '$ts/stores/user/voiceovers';
	import {
		voiceoverPrompt,
		voiceoverPromptLocal,
		voiceoverSeed,
		voiceoverSpeakerId,
		voiceoverStability
	} from '$ts/stores/voiceover/voiceoverSettings';
	import { onMount } from 'svelte';

	$: [$voiceoverPrompt],
		withCheck(() => {
			if (!voiceoverPrompt) return;
			voiceoverPromptLocal.set($voiceoverPrompt);
		});

	function onSubmit() {
		if ($maxOngoingVoiceoversCountReached) return;
		if (!$sseId) return;
		if (!$voiceoverPrompt) return;
		queueInitialVoiceoverRequest({
			model_id: $voiceoverModelId,
			speaker_id: $voiceoverSpeakerId,
			prompt: { id: 'prompt', text: $voiceoverPrompt },
			temperature: $voiceoverStability / 100,
			num_outputs: 1,
			seed: $voiceoverSeed || Math.round(Math.random() * maxSeed),
			stream_id: $sseId,
			submit_to_gallery: false,
			ui_id: generateSSEId()
		});
	}

	function withCheck(fn: () => void) {
		if (!mounted) return;
		fn();
	}

	let mounted = false;

	onMount(() => {
		if ($voiceoverPromptLocal) {
			voiceoverPrompt.set($voiceoverPromptLocal);
		}
		mounted = true;
	});
</script>

<form on:submit={onSubmit} class="w-full rounded-xl overflow-hidden relative">
	<textarea
		bind:value={$voiceoverPrompt}
		placeholder="I like to eat apples and bananas."
		class="w-full h-full bg-c-bg-secondary rounded-xl resize-none px-5 py-4 text-lg pb-26 placeholder:text-c-on-bg/40"
		rows="8"
		maxlength={maxVoiceoverCharacterCount}
	/>
	<div class="absolute w-full flex flex-col bottom-0 left-0">
		<div class="w-full h-6 bg-gradient-to-t from-c-bg-secondary to-c-bg-secondary/0" />
		<div
			class="w-full rounded-b-xl rounded-tl-xl pointer-events-none
   	 	flex justify-end items-center px-3 pt-3 pb-4 bg-c-bg-secondary gap-4"
		>
			<div class="flex flex-col items-end justify-center font-medium">
				<p>
					{($voiceoverPrompt || '').length}
					<span class="text-c-on-bg/50">/ {maxVoiceoverCharacterCount}</span>
				</p>
				<p>
					{getVoiceoverCreditCost(($voiceoverPrompt || '').length)}
					<span class="text-c-on-bg/50">credit(s)</span>
				</p>
			</div>
			<Button
				withSpinner
				noPadding
				loading={$maxOngoingVoiceoversCountReached}
				class="pointer-events-auto px-8 py-4">{$LL.Home.GenerateButton()}</Button
			>
		</div>
	</div>
</form>
