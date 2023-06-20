<script lang="ts">
	import { page } from '$app/stores';
	import Morpher from '$components/Morpher.svelte';
	import InsufficientCreditsBadge from '$components/badges/InsufficientCreditsBadge.svelte';
	import Button from '$components/buttons/Button.svelte';
	import ClearButton from '$components/buttons/ClearButton.svelte';
	import NoBgButton from '$components/buttons/NoBgButton.svelte';
	import { mdBreakpoint } from '$components/generationFullScreen/constants';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import IconSettings from '$components/icons/IconSettings.svelte';
	import IconToken from '$components/icons/IconToken.svelte';
	import IconWand from '$components/icons/IconWand.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { autoresize } from '$ts/actions/textarea/autoresize';
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

	$: showClearPromptInputButton =
		$voiceoverPrompt !== null && $voiceoverPrompt !== undefined && $voiceoverPrompt !== '';
	let promptInputElement: HTMLTextAreaElement;
	function clearPrompt() {
		voiceoverPrompt.set('');
		promptInputElement.value = '';
		promptInputElement.blur();
		promptInputElement.focus();
	}

	let mounted = false;

	onMount(() => {
		if ($voiceoverPromptLocal) {
			voiceoverPrompt.set($voiceoverPromptLocal);
		}
		mounted = true;
	});
</script>

<form on:submit|preventDefault={onSubmit} class="md:hidden w-full flex flex-row items-stretch">
	<div class="flex-1 flex gap-2 flex-row items-center transition duration-150 transform">
		<div class="flex-1 flex relative group">
			<textarea
				bind:this={promptInputElement}
				use:autoresize={{
					minRows: 3,
					maxRows: 3,
					placeholder: $LL.Voiceover.PromptBar.PromptInput.Placeholder(),
					value: $voiceoverPrompt || ''
				}}
				bind:value={$voiceoverPrompt}
				placeholder={$LL.Voiceover.PromptBar.PromptInput.Placeholder()}
				maxlength={maxVoiceoverCharacterCount}
				enterkeyhint="done"
				rows="3"
				style="transition: height 0.1s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), padding 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
				class="w-full text-base bg-c-bg-secondary shadow-lg pr-20 md:pr-26 lg:pr-17 hide-scrollbar shadow-c-shadow/[var(--o-shadow-normal)]
							scroll-smooth resize-none transition relative pl-3 md:pl-5 py-2.5 md:py-4.5 rounded-lg md:rounded-xl
							focus:ring-2 focus:ring-c-primary/30 ring-0 ring-c-primary/20 placeholder:text-c-on-bg/40
							not-touch:enabled:hover:ring-2 text-c-on-bg not-touch:group-hover:ring-2"
			/>
			<div class="flex h-full flex-col absolute right-11 top-0">
				<ClearButton class="" show={showClearPromptInputButton} onClick={clearPrompt} />
				<div class="flex font-medium flex-col items-end text-xs z-50 pr-2 pb-1">
					<p class="text-c-on-bg/75">
						{($voiceoverPrompt || '').length.toLocaleString($locale)}
					</p>
					<p class="text-c-on-bg/50">
						{maxVoiceoverCharacterCount.toLocaleString($locale)}
					</p>
				</div>
			</div>
			<div class="absolute right-0 top-0 h-full w-11 md:w-13 lg:hidden">
				<Button
					fadeOnDisabled={doesntHaveEnoughCredits}
					loading={$maxOngoingVoiceoversCountReached}
					disabled={doesntHaveEnoughCredits}
					withSpinner
					class="w-full h-full rounded-r-lg md:rounded-r-xl rounded-l-none absolute right-0 top-0"
					noPadding
					label={$LL.Home.GenerateButton()}
				>
					<IconWand class="w-7 h-7 md:w-8 md:h-8" />
				</Button>
				{#if doesntHaveEnoughCredits && $userSummary && $page.data.session?.user.id}
					<InsufficientCreditsBadge
						neededCredits={creditCost}
						remainingCredits={$userSummary.total_remaining_credits}
					/>
				{/if}
			</div>
		</div>
	</div>
	<div class="flex flex-col -mr-2">
		<div
			class="text-sm w-full flex flex-row justify-center pt-1 items-center font-medium text-c-on-bg/75 gap-1"
		>
			<IconToken class="w-4 h-4" />
			<p>
				{creditCost.toLocaleString($locale)}
			</p>
		</div>
		<NoBgButton
			size="sm"
			noPadding
			paddingClassForHoverEffect="px-1"
			onClick={toggleSettingsSheet}
			class="flex-1 px-3 py-2"
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
	</div>
</form>
<form
	on:submit={onSubmit}
	class="hidden md:flex w-full max-h-full flex-row md:flex-col rounded-lg md:rounded-2xl
	overflow-hidden relative bg-c-bg-secondary"
>
	<div class="w-full flex-1 min-h-0 flex flex-col relative">
		<textarea
			bind:value={$voiceoverPrompt}
			placeholder={$LL.Voiceover.PromptBar.PromptInput.Placeholder()}
			class="hidden md:block w-full h-full bg-c-bg-secondary rounded-t-lg md:rounded-t-2xl resize-none px-3 md:px-5 py-2.5 md:py-4
			relative text-base md:text-lg pb-6 placeholder:text-c-on-bg/40"
			rows="7"
			maxlength={maxVoiceoverCharacterCount}
		/>
		<div
			class="w-full hidden md:block absolute left-0 bottom-0 h-4 bg-gradient-to-t from-c-bg-secondary to-c-bg-secondary/0 pointer-events-none"
		/>
	</div>
	<div
		class="w-auto md:w-full rounded-r-lg md:rounded-tr-none md:rounded-b-2xl pointer-events-none
   	 	flex flex-col items-center md:flex-row justify-end md:items-center pl-0 pr-2 pt-2 pb-2 md:px-3 md:pt-2 md:pb-4
			bg-c-bg-secondary gap-1 md:gap-4"
	>
		<div
			class="hidden md:flex flex-col items-end justify-center font-medium text-right text-xs md:text-sm pointer-events-auto"
		>
			<p class="text-c-on-bg/75">
				{($voiceoverPrompt || '').length.toLocaleString($locale)}<span class="text-c-on-bg/50"
					><span class="px-[0.25ch]">/</span>{maxVoiceoverCharacterCount.toLocaleString(
						$locale
					)}</span
				>
			</p>
			<div class="flex flex-row justify-end items-center text-c-on-bg/75 gap-1">
				<IconToken class="w-4 h-4" />
				<p class="mt-0.5">
					{creditCost.toLocaleString($locale)}
				</p>
			</div>
		</div>
		<NoBgButton
			size="sm"
			noPadding
			paddingClassForHoverEffect="p-0"
			onClick={toggleSettingsSheet}
			class="md:hidden w-full flex items-center justify-center px-2 py-2"
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
				class="pointer-events-auto w-full h-full md:w-auto md:h-auto md:px-8 md:py-3.5 rounded-xl"
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
