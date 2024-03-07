<script lang="ts">
	import CreditCostBadge from '$components/badges/CreditCostBadge.svelte';
	import Morpher from '$components/utils/Morpher.svelte';
	import InsufficientCreditsBadge from '$components/badges/InsufficientCreditsBadge.svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import ClearButton from '$components/primitives/buttons/ClearButton.svelte';
	import NoBgButton from '$components/primitives/buttons/NoBgButton.svelte';
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
	import { sessionStore } from '$ts/constants/supabase';

	export let toggleSettingsSheet: (s?: boolean) => void;
	export let openSignInModal: () => void;
	export let isSettingsSheetOpen: boolean;
	export let disabled = false;

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
		if (!$sessionStore?.user.id || !$userSummary) {
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

	function onKeyPress(e: any) {
		if (e.key === 'Enter' && e.shiftKey) {
			e.preventDefault();
			onSubmit();
		}
	}

	let mounted = false;
	onMount(() => {
		if ($voiceoverPromptLocal) {
			voiceoverPrompt.set($voiceoverPromptLocal);
		}
		mounted = true;
	});
</script>

<form on:submit|preventDefault={onSubmit} class="flex w-full flex-row items-stretch md:hidden">
	<div
		class="flex flex-1 transform flex-row items-center gap-2 transition duration-150 {isJustCreatedVoiceoverForAnim
			? 'scale-97'
			: 'scale-100'}"
	>
		<div class="group relative flex flex-1">
			<textarea
				{disabled}
				on:focus={() => (isPromptBarFocused = true)}
				on:blur={() => (isPromptBarFocused = false)}
				use:autoresize={{
					maxRows: shouldPromptBarExpand ? 5 : 3,
					minRows: 3
				}}
				bind:this={promptInputElement}
				on:keypress={onKeyPress}
				bind:value={$voiceoverPrompt}
				placeholder={$LL.Voiceover.PromptBar.PromptInput.Placeholder()}
				maxlength={maxVoiceoverCharacterCount}
				enterkeyhint="enter"
				rows="3"
				style="transition: height 0.1s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), padding 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
				class="hide-scrollbar relative w-full resize-none scroll-smooth rounded-lg bg-c-bg-secondary py-1.75 pl-2.5
							pr-20 text-base text-c-on-bg shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] ring-0 ring-c-primary/20 transition placeholder:text-c-on-bg/50 focus:ring-c-primary/30
							enabled:focus:ring-2 not-touch:enabled:hover:ring-2 not-touch:enabled:group-hover:ring-2 md:rounded-xl md:py-4
							md:pl-5 md:pr-26 lg:pr-17"
			/>
			<div class="absolute right-11 top-0 flex h-full flex-col">
				<ClearButton class="" show={showClearPromptInputButton} onClick={clearPrompt} />
				<div class="z-50 flex flex-col items-end pb-1 pr-2 text-xs font-medium">
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
					fadeOnDisabled={doesntHaveEnoughCredits || disabled}
					loading={$maxOngoingVoiceoversCountReached}
					disabled={doesntHaveEnoughCredits || disabled}
					withSpinner
					class="absolute right-0 top-0 h-full w-full rounded-l-none rounded-r-lg md:rounded-r-xl"
					noPadding
					label={$LL.Home.GenerateButton()}
				>
					<IconWand class="h-7 w-7 md:h-8 md:w-8" />
				</Button>
				<CreditCostBadge {creditCost} />
				{#if doesntHaveEnoughCredits && $userSummary && $sessionStore?.user.id}
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
		class="-mr-2 px-3 py-2"
		hoverFrom="bottom"
		name={isSettingsSheetOpen
			? $LL.Generate.HideSettingsButton()
			: $LL.Generate.ShowSettingsButton()}
	>
		<Morpher morphed={$windowWidth < mdBreakpoint && isSettingsSheetOpen}>
			<div slot="0" class="h-8 w-8">
				<IconSettings
					class="h-full w-full
						transition not-touch:group-hover:text-c-primary {$windowWidth < mdBreakpoint && isSettingsSheetOpen
						? 'rotate-180'
						: 'rotate-0'}"
				/>
			</div>
			<div slot="1" class="h-8 w-8">
				<IconChevronDown
					class="h-full w-full transform
						transition not-touch:group-hover:text-c-primary {$windowWidth < mdBreakpoint && !isSettingsSheetOpen
						? '-rotate-180'
						: 'rotate-0'}"
				/>
			</div>
		</Morpher>
	</NoBgButton>
</form>
<form
	on:submit|preventDefault={onSubmit}
	class="relative hidden max-h-full w-full flex-row overflow-hidden rounded-lg bg-c-bg-secondary
	ring-0 ring-c-primary/20 transition focus-within:ring-c-primary/30 md:flex md:flex-col md:rounded-2xl
	md:shadow-lg md:shadow-c-shadow/[var(--o-shadow-strong)] {!disabled
		? 'text-c-on-bg focus-within:ring-2 not-touch:hover:ring-2 not-touch:enabled:hover:ring-2'
		: ''}"
>
	<div class="relative flex min-h-0 w-full flex-1 flex-col">
		<textarea
			{disabled}
			bind:value={$voiceoverPrompt}
			bind:this={promptInputElementMd}
			placeholder={$LL.Voiceover.PromptBar.PromptInput.Placeholder()}
			on:keypress={onKeyPress}
			class="relative hidden h-full w-full resize-none rounded-t-lg bg-c-bg-secondary py-4 pb-6 pl-5 pr-13
			text-base placeholder:text-c-on-bg/50 md:block md:rounded-t-2xl md:text-lg"
			rows="7"
			maxlength={maxVoiceoverCharacterCount}
		/>
		<div
			class="pointer-events-none absolute bottom-0 left-0 block h-4 w-full bg-gradient-to-t from-c-bg-secondary to-c-bg-secondary/0"
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
		role="button"
		tabindex="0"
		class="flex w-full cursor-text flex-row items-center
		justify-end rounded-b-2xl rounded-tr-none bg-c-bg-secondary px-3 pb-4 pt-2"
	>
		<div
			bind:this={buttonContainer}
			class="flex cursor-auto flex-row items-center justify-end gap-4"
		>
			<div class="flex flex-col items-end justify-center text-right text-sm font-medium">
				<p class="text-c-on-bg/75">
					{($voiceoverPrompt || '').length.toLocaleString($locale)}<span class="text-c-on-bg/50"
						><span class="px-[0.25ch]">/</span>{maxVoiceoverCharacterCount.toLocaleString(
							$locale
						)}</span
					>
				</p>
				<div class="flex flex-row items-center justify-end gap-0.25 text-c-on-bg/75">
					<IconToken class="-ml-0.25 h-4 w-4 flex-shrink-0" />
					<p class="mt-0.5">
						{creditCost.toLocaleString($locale)}
					</p>
				</div>
			</div>
			<div
				class="relative flex transform justify-end transition duration-150 {isJustCreatedVoiceoverForAnim
					? 'scale-93'
					: 'scale-100'}"
			>
				<Button
					withSpinner
					noPadding
					noRounding
					blurOnClick
					fadeOnDisabled={doesntHaveEnoughCredits || disabled}
					loading={$maxOngoingVoiceoversCountReached}
					disabled={doesntHaveEnoughCredits || disabled}
					class="pointer-events-auto rounded-xl px-8 py-3.5"
				>
					{$LL.Voiceover.PromptBar.GenerateButton()}
				</Button>
				{#if doesntHaveEnoughCredits && $userSummary && $sessionStore?.user.id}
					<InsufficientCreditsBadge
						neededCredits={creditCost}
						remainingCredits={$userSummary.total_remaining_credits}
					/>
				{/if}
			</div>
		</div>
	</div>
</form>
