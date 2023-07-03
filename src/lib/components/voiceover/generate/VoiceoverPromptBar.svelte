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
		voiceoverStabilityHardMax
	} from '$ts/constants/voiceover/rest';
	import { formatVoiceoverPrompt } from '$ts/helpers/formatPrompt';
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

	export let toggleSettingsSheet: (s?: boolean) => void;
	export let openSignInModal: () => void;
	export let isSettingsSheetOpen: boolean;

	$: creditCost = getVoiceoverCreditCost(
		$voiceoverPrompt || $LL.Voiceover.PromptBar.PromptInput.Placeholder()
	);
	$: doesntHaveEnoughCredits =
		$userSummary !== undefined &&
		$userSummary !== null &&
		$userSummary.total_remaining_credits < creditCost;

	$: [$voiceoverPrompt],
		withCheck(() => {
			if (!voiceoverPrompt) return;
			voiceoverPromptLocal.set($voiceoverPrompt);
		});

	let isJustCreatedVoiceoverTimeout: NodeJS.Timeout;
	let isJustCreatedVoiceoverForAnim = false;
	const isJustCreatedVoiceoverTimeoutDuration = 350;
	let isJustCreatedVoiceover = false;
	let isJustCreatedVoiceoverForAnimTimeout: NodeJS.Timeout;
	const isJustCreatedVoiceoverForAnimTimeoutDuration = 175;

	function onSubmit() {
		if (!$page.data.session?.user.id || !$userSummary) {
			openSignInModal();
			return;
		}
		if (isJustCreatedVoiceover) return;
		if ($maxOngoingVoiceoversCountReached) return;
		if (!$sseId) return;
		if (doesntHaveEnoughCredits) return;
		if (!$voiceoverPrompt) {
			voiceoverPrompt.set($LL.Voiceover.PromptBar.PromptInput.Placeholder());
		}
		if (!$voiceoverPrompt) return;
		toggleSettingsSheet(false);
		voiceoverPrompt.set(formatVoiceoverPrompt($voiceoverPrompt));
		const temperature = Number(
			(
				Math.round((1 - Math.min(voiceoverStabilityHardMax, $voiceoverStability) / 100) * 100) / 100
			).toFixed(2)
		);
		promptInputElement?.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
		promptInputElementMd?.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
		queueInitialVoiceoverRequest({
			model_id: $voiceoverModelId,
			speaker: {
				id: $voiceoverSpeakerId,
				locale: $voiceoverLocale
			},
			prompt: { id: 'prompt', text: $voiceoverPrompt },
			temperature,
			num_outputs: 1,
			seed: $voiceoverSeed || Math.round(Math.random() * maxSeed),
			stream_id: $sseId,
			submit_to_gallery: false,
			ui_id: generateSSEId(),
			denoise_audio: $voiceoverDenoiseAudio,
			remove_silence: $voiceoverRemoveSilence
		});
		clearTimeout(isJustCreatedVoiceoverTimeout);
		isJustCreatedVoiceover = true;
		isJustCreatedVoiceoverTimeout = setTimeout(() => {
			isJustCreatedVoiceover = false;
		}, isJustCreatedVoiceoverTimeoutDuration);
		clearTimeout(isJustCreatedVoiceoverForAnimTimeout);
		isJustCreatedVoiceoverForAnim = true;
		isJustCreatedVoiceoverForAnimTimeout = setTimeout(() => {
			isJustCreatedVoiceoverForAnim = false;
		}, isJustCreatedVoiceoverForAnimTimeoutDuration);
	}

	function withCheck(fn: () => void) {
		if (!mounted) return;
		fn();
	}

	let promptInputElementMd: HTMLTextAreaElement;
	let promptInputElement: HTMLTextAreaElement;
	let buttonContainer: HTMLDivElement;

	$: showClearPromptInputButton =
		$voiceoverPrompt !== null && $voiceoverPrompt !== undefined && $voiceoverPrompt !== '';

	function clearPrompt() {
		voiceoverPrompt.set('');
		promptInputElement.value = '';
		promptInputElement.blur();
		promptInputElement.focus();
	}

	function clearPromptMd() {
		voiceoverPrompt.set('');
		promptInputElementMd.value = '';
		promptInputElementMd.blur();
		promptInputElementMd.focus();
	}

	function onInfoContainerClicked(e: MouseEvent) {
		if (buttonContainer && buttonContainer.contains(e.target as Node)) {
			return;
		}
		if (promptInputElementMd) {
			promptInputElementMd.focus();
		}
	}

	let isPromptBarFocused = false;
	$: shouldPromptBarExpand = isPromptBarFocused && !isSettingsSheetOpen ? true : false;

	let mounted = false;
	onMount(() => {
		if ($voiceoverPromptLocal) {
			voiceoverPrompt.set($voiceoverPromptLocal);
		}
		mounted = true;
	});
</script>

<form on:submit|preventDefault={onSubmit} class="md:hidden w-full flex flex-row items-stretch">
	<div
		class="flex-1 flex gap-2 flex-row items-center transition duration-150 transform {isJustCreatedVoiceoverForAnim
			? 'scale-97'
			: 'scale-100'}"
	>
		<div class="flex-1 flex relative group">
			<textarea
				on:focus={() => (isPromptBarFocused = true)}
				on:blur={() => (isPromptBarFocused = false)}
				use:autoresize={{
					maxRows: shouldPromptBarExpand ? 6 : 3,
					minRows: 3
				}}
				bind:this={promptInputElement}
				on:keypress={(e) => {
					if (e.key === 'Enter' && e.shiftKey) {
						e.preventDefault();
						onSubmit();
					}
				}}
				bind:value={$voiceoverPrompt}
				placeholder={$LL.Voiceover.PromptBar.PromptInput.Placeholder()}
				maxlength={maxVoiceoverCharacterCount}
				enterkeyhint="enter"
				rows="3"
				style="transition: height 0.1s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), padding 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
				class="w-full text-base bg-c-bg-secondary shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] pr-20 md:pr-26 lg:pr-17 hide-scrollbar
							scroll-smooth resize-none transition relative pl-2.5 md:pl-5 py-2 md:py-4.5 rounded-lg md:rounded-xl
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
				<div
					class="absolute ring-1 ring-c-bg/15 rounded-bl bg-c-bg/10 pointer-events-none top-0
					right-0 text-xs flex flex-row justify-end px-1.25
					items-center font-semibold text-c-bg"
				>
					<IconToken class="w-3.5 h-3.5 -ml-1" />
					<p class="text-right mt-0.25">
						{creditCost.toLocaleString($locale)}
					</p>
				</div>
				{#if doesntHaveEnoughCredits && $userSummary && $page.data.session?.user.id}
					<InsufficientCreditsBadge
						neededCredits={creditCost}
						remainingCredits={$userSummary.total_remaining_credits}
					/>
				{/if}
			</div>
		</div>
	</div>
	<NoBgButton
		size="sm"
		noPadding
		paddingClassForHoverEffect="px-1"
		onClick={() => toggleSettingsSheet()}
		class="px-3 py-2 -mr-2"
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
</form>
<form
	on:submit|preventDefault={onSubmit}
	class="hidden md:flex w-full max-h-full flex-row md:flex-col rounded-lg md:rounded-2xl
	overflow-hidden relative md:shadow-lg md:shadow-c-shadow/[var(--o-shadow-strong)] bg-c-bg-secondary transition focus-within:ring-2 focus-within:ring-c-primary/30
	ring-0 ring-c-primary/20 not-touch:enabled:hover:ring-2 text-c-on-bg not-touch:hover:ring-2"
>
	<div class="w-full flex-1 min-h-0 flex flex-col relative">
		<textarea
			bind:value={$voiceoverPrompt}
			bind:this={promptInputElementMd}
			placeholder={$LL.Voiceover.PromptBar.PromptInput.Placeholder()}
			on:keypress={(e) => {
				if (e.key === 'Enter' && e.shiftKey) {
					e.preventDefault();
					onSubmit();
				}
			}}
			class="hidden md:block w-full h-full bg-c-bg-secondary rounded-t-lg md:rounded-t-2xl resize-none pl-5 pr-13 py-4
			relative text-base md:text-lg pb-6 placeholder:text-c-on-bg/40"
			rows="7"
			maxlength={maxVoiceoverCharacterCount}
		/>
		<div
			class="w-full block absolute left-0 bottom-0 h-4 bg-gradient-to-t from-c-bg-secondary to-c-bg-secondary/0 pointer-events-none"
		/>
		<div class="absolute right-0 top-0 h-15">
			<ClearButton
				roundingClass="rounded-xl"
				class=""
				show={showClearPromptInputButton}
				onClick={clearPromptMd}
			/>
		</div>
	</div>
	<div
		on:click={onInfoContainerClicked}
		on:keydown={() => null}
		class="w-full rounded-tr-none rounded-b-2xl flex flex-row
		justify-end items-center px-3 pt-2 pb-4 bg-c-bg-secondary cursor-text"
	>
		<div
			bind:this={buttonContainer}
			class="flex flex-row justify-end items-center gap-4 cursor-auto"
		>
			<div class="flex flex-col items-end justify-center font-medium text-right text-sm">
				<p class="text-c-on-bg/75">
					{($voiceoverPrompt || '').length.toLocaleString($locale)}<span class="text-c-on-bg/50"
						><span class="px-[0.25ch]">/</span>{maxVoiceoverCharacterCount.toLocaleString(
							$locale
						)}</span
					>
				</p>
				<div class="flex flex-row justify-end items-center text-c-on-bg/75 gap-0.25">
					<IconToken class="w-4 h-4 -ml-0.25 flex-shrink-0" />
					<p class="mt-0.5">
						{creditCost.toLocaleString($locale)}
					</p>
				</div>
			</div>
			<div
				class="relative flex justify-end transition duration-150 transform {isJustCreatedVoiceoverForAnim
					? 'scale-93'
					: 'scale-100'}"
			>
				<Button
					withSpinner
					noPadding
					noRounding
					blurOnClick
					fadeOnDisabled={doesntHaveEnoughCredits}
					loading={$maxOngoingVoiceoversCountReached}
					disabled={doesntHaveEnoughCredits}
					class="pointer-events-auto px-8 py-3.5 rounded-xl"
				>
					{$LL.Voiceover.PromptBar.GenerateButton()}
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
</form>
