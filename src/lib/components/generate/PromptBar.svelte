<script lang="ts">
	import { page } from '$app/stores';
	import LL from '$i18n/i18n-svelte';
	import InsufficientCreditsBadge from '$components/badges/InsufficientCreditsBadge.svelte';
	import Button from '$components/buttons/Button.svelte';
	import ClearButton from '$components/buttons/ClearButton.svelte';
	import { autoresize } from '$ts/actions/textarea/autoresize';
	import { maxPromptLength, maxSeed } from '$ts/constants/main';
	import { formatPrompt } from '$ts/helpers/formatPrompt';
	import { generateSSEId } from '$ts/helpers/generateSSEId';
	import {
		generationGuidanceScale,
		generationHeight,
		generationInferenceSteps,
		generationInitImageFiles,
		generationInitImageFilesState,
		generationInitImageStrength,
		generationInitImageUrl,
		generationModelId,
		generationNumOutputs,
		generationSchedulerId,
		generationSeed,
		generationWidth,
		generationNegativePrompt,
		prompt,
		generationPrompt
	} from '$ts/stores/generationSettings';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import {
		generations,
		queueInitialGenerationRequest,
		type TInitialGenerationRequest
	} from '$ts/stores/user/generation';
	import { sseId } from '$ts/stores/user/sse';
	import { userSummary } from '$ts/stores/user/summary';
	import IconGenerationSettings from '$components/icons/IconGenerationSettings.svelte';
	import IconButton from '$components/buttons/IconButton.svelte';
	import { windowWidth } from '$ts/stores/window';
	import { mdBreakpoint } from '$components/generationFullScreen/constants';
	import { onMount } from 'svelte';
	import { isValue } from '$ts/helpers/isValue';
	import { isSuperAdmin } from '$ts/helpers/admin/roles';
	import type { TIsReadyMap } from '$components/generate/types';
	import type { TCreatePageData } from '$routes/generate/+page.server';
	import IconWand from '$components/icons/IconWand.svelte';
	import Morpher from '$components/Morpher.svelte';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import { maxOngoingGenerationsCount } from '$components/generate/constants';

	export let openSignInModal: () => void;
	export let serverData: TCreatePageData;
	export let isReadyMap: TIsReadyMap;
	export let onGenerate: undefined | (() => void) = undefined;
	export let toggleSettingsSheet: () => void;
	export let isGenerationSettingsSheetOpen: boolean;
	export { classes as class };
	let classes = '';
	export { styles as style };
	let styles = '';

	let promptInputElement: HTMLTextAreaElement;
	let isCheckCompleted = false;

	generationPrompt.set(serverData.prompt !== null ? serverData.prompt : undefined);

	$: [$generationPrompt], withCheck(setLocalPrompt);

	$: doesntHaveEnoughCredits =
		isCheckCompleted &&
		$userSummary &&
		$userSummary.total_remaining_credits < Number($generationNumOutputs);

	$: showClearPromptInputButton = $generationPrompt !== undefined && $generationPrompt !== '';
	$: promptInputPlaceholder = $LL.Home.PromptInput.Placeholder();

	$: ongoingGenerationsCount = $generations.filter(
		(g) => g.status !== 'succeeded' && g.status !== 'failed' && g.status !== 'pre-submit'
	).length;
	$: maxOngoingGenerationsCountReached = isSuperAdmin($userSummary?.roles)
		? false
		: ongoingGenerationsCount >= $maxOngoingGenerationsCount;

	async function onPromptFormSubmitted() {
		if (doesntHaveEnoughCredits) {
			return;
		}
		if (maxOngoingGenerationsCountReached) {
			return;
		}
		if (!$page.data.session?.user.id) {
			openSignInModal();
			return;
		}
		if ($generationInitImageFilesState === 'uploading') {
			return;
		}
		if ($generationPrompt) {
			generationPrompt.set(formatPrompt($generationPrompt));
		}
		if ($generationNegativePrompt) {
			generationNegativePrompt.set(formatPrompt($generationNegativePrompt));
		}
		if (!$generationPrompt) {
			generationPrompt.set(promptInputPlaceholder);
		}
		onGenerate?.();
		queueGeneration();
		if ($windowWidth < mdBreakpoint) {
			promptInputElement.blur();
		}
	}

	async function queueGeneration() {
		if (!$generationPrompt) {
			console.log("No prompt, can't create generation");
			return;
		}
		if (!$sseId) {
			console.log("No SSE ID, can't create generation");
			return;
		}
		const initialRequestProps: TInitialGenerationRequest = {
			prompt: {
				id: 'prompt',
				text: $generationPrompt
			},
			negative_prompt: $generationNegativePrompt
				? {
						id: 'negative_prompt',
						text: $generationNegativePrompt
				  }
				: undefined,
			model_id: $generationModelId,
			scheduler_id: $generationSchedulerId,
			width: Number($generationWidth),
			height: Number($generationHeight),
			init_image_url: $generationInitImageUrl,
			init_image_file: $generationInitImageFiles,
			prompt_strength:
				$generationInitImageUrl && $generationInitImageStrength !== undefined
					? 1 - Number($generationInitImageStrength)
					: undefined,
			guidance_scale: Number($generationGuidanceScale),
			inference_steps: Number($generationInferenceSteps),
			seed:
				$generationSeed !== undefined && $generationSeed !== null && $generationSeed !== ''
					? Number($generationSeed)
					: Math.round(Math.random() * maxSeed),
			num_outputs: Number($generationNumOutputs),
			output_image_extension: 'jpeg',
			process_type: 'generate',
			stream_id: $sseId,
			ui_id: generateSSEId(),
			submit_to_gallery: false
		};
		queueInitialGenerationRequest(initialRequestProps);
	}

	function clearPrompt() {
		generationPrompt.set('');
		promptInputElement.value = '';
		promptInputElement.blur();
		promptInputElement.focus();
	}

	function setLocalPrompt() {
		prompt.set(
			$generationPrompt !== '' && $generationPrompt !== undefined ? $generationPrompt : ''
		);
	}

	function withCheck(fn: () => void) {
		if (!isCheckCompleted) return;
		fn();
	}

	onMount(() => {
		isCheckCompleted = false;
		if (!isValue(serverData.prompt) && isValue($prompt) && $prompt !== null) {
			generationPrompt.set($prompt);
		}
		isCheckCompleted = true;
		isReadyMap.promptBar = true;
	});
</script>

<div style={styles} class="w-full flex justify-center {classes}">
	<form
		on:submit|preventDefault={onPromptFormSubmitted}
		class="w-full max-w-7xl flex flex-row gap-1 md:gap-2 items-center"
	>
		<div class="flex-1 flex relative group">
			<textarea
				use:autoresize={{ maxRows: 2, placeholder: promptInputPlaceholder }}
				bind:this={promptInputElement}
				bind:value={$generationPrompt}
				on:keypress={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						onPromptFormSubmitted();
					}
				}}
				on:input={() => {
					if (
						$generationPrompt !== undefined &&
						$generationPrompt !== null &&
						$generationPrompt.length > maxPromptLength
					) {
						generationPrompt.set($generationPrompt.slice(0, maxPromptLength));
					}
				}}
				disabled={!isCheckCompleted}
				placeholder={promptInputPlaceholder}
				enterkeyhint="go"
				rows="1"
				style="transition: height 0.1s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), padding 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
				class="w-full text-base bg-c-bg-secondary shadow-lg pr-20 md:pr-17 hide-scrollbar shadow-c-shadow/[var(--o-shadow-normal)] 
						scroll-smooth resize-none transition relative pl-3 md:pl-5 py-3 md:py-4.5 rounded-lg md:rounded-xl 
						focus:ring-2 focus:ring-c-primary/30 ring-0 ring-c-primary/20 placeholder:text-c-on-bg/40 {!$isTouchscreen
					? 'enabled:hover:ring-2'
					: ''} text-c-on-bg {!$isTouchscreen ? 'group-hover:ring-2' : ''}"
			/>
			<ClearButton
				class="absolute right-11 md:right-13 top-0 lg:right-0"
				show={showClearPromptInputButton}
				onClick={clearPrompt}
			/>
			<div class="absolute right-0 top-0 h-full w-11 md:w-13 lg:hidden">
				<Button
					disabled={!isCheckCompleted ||
						(doesntHaveEnoughCredits && $page.data.session?.user.id !== undefined)}
					uploading={$generationInitImageFilesState === 'uploading'}
					loading={maxOngoingGenerationsCountReached}
					withSpinner
					fadeOnDisabled={isCheckCompleted}
					class="w-full h-full rounded-r-lg md:rounded-r-xl rounded-l-none absolute right-0 top-0"
					noPadding
				>
					<IconWand class="w-7 h- md:w-8 h-8" />
				</Button>
				{#if doesntHaveEnoughCredits && $userSummary && $page.data.session?.user.id}
					<InsufficientCreditsBadge
						neededCredits={Number($generationNumOutputs)}
						remainingCredits={$userSummary.total_remaining_credits}
					/>
				{/if}
			</div>
		</div>
		<div class="w-full md:w-auto relative hidden lg:block">
			<Button
				disabled={!isCheckCompleted ||
					(doesntHaveEnoughCredits && $page.data.session?.user.id !== undefined)}
				uploading={$generationInitImageFilesState === 'uploading'}
				loading={maxOngoingGenerationsCountReached}
				withSpinner
				noPadding
				fadeOnDisabled={isCheckCompleted}
				class="w-full flex flex-col relative py-4.5 px-6 xl:px-8"
			>
				{$LL.Home.GenerateButton()}
			</Button>
			{#if doesntHaveEnoughCredits && $userSummary && $page.data.session?.user.id}
				<InsufficientCreditsBadge
					neededCredits={Number($generationNumOutputs)}
					remainingCredits={$userSummary.total_remaining_credits}
				/>
			{/if}
		</div>
		<IconButton onClick={toggleSettingsSheet} class="md:hidden" name="Generation Settings">
			<Morpher morphed={$windowWidth < mdBreakpoint && isGenerationSettingsSheetOpen}>
				<div slot="0" class="w-7.5 h-7.5 p-0.5">
					<IconGenerationSettings
						class="transition {!$isTouchscreen
							? 'group-hover/iconbutton:text-c-primary'
							: ''} w-full h-full {$windowWidth < mdBreakpoint && isGenerationSettingsSheetOpen
							? 'rotate-180'
							: 'rotate-0'}"
					/>
				</div>
				<div slot="1" class="w-7.5 h-7.5 p-0.5">
					<IconChevronDown
						class="transition transform {!$isTouchscreen
							? 'group-hover/iconbutton:text-c-primary'
							: ''} w-full h-full {$windowWidth < mdBreakpoint && !isGenerationSettingsSheetOpen
							? '-rotate-180'
							: 'rotate-0'}"
					/>
				</div>
			</Morpher>
		</IconButton>
	</form>
</div>
