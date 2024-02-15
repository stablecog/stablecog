<script lang="ts">
	import { page } from '$app/stores';
	import LL from '$i18n/i18n-svelte';
	import InsufficientCreditsBadge from '$components/badges/InsufficientCreditsBadge.svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import ClearButton from '$components/primitives/buttons/ClearButton.svelte';
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
		generationPrompt,
		generationShouldSubmitToGallery
	} from '$ts/stores/generationSettings';
	import {
		generations,
		maxOngoingGenerationsCountReached,
		queueInitialGenerationRequest,
		type TInitialGenerationRequest
	} from '$ts/stores/user/generation';
	import { sseId } from '$ts/stores/user/sse';
	import { userSummary } from '$ts/stores/user/summary';
	import { windowWidth } from '$ts/stores/window';
	import { mdBreakpoint } from '$components/generationFullScreen/constants';
	import { onMount } from 'svelte';
	import { isValue } from '$ts/helpers/isValue';
	import type { TIsReadyMap } from '$components/generate/types';
	import IconWand from '$components/icons/IconWand.svelte';
	import Morpher from '$components/utils/Morpher.svelte';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import { afterNavigate } from '$app/navigation';
	import NoBgButton from '$components/primitives/buttons/NoBgButton.svelte';
	import type { TGeneratePageData } from '$approutes/generate/+page.server';
	import IconSettings from '$components/icons/IconSettings.svelte';
	import { generateMode } from '$ts/stores/generate/generateMode';
	import { exportStage } from '$components/canvas/helpers/exportStage';
	import { konvaContainerForExportId } from '$components/canvas/constants/main';
	import { KonvaInstance, paintLayer, stage } from '$components/canvas/stores/konva';
	import { baseOutputForInpainting } from '$components/canvas/stores/baseOutputForInpainting';
	import { sessionStore } from '$ts/constants/supabase';

	export let openSignInModal: () => void;
	export let serverData: TGeneratePageData;
	export let isReadyMap: TIsReadyMap;
	export let afterGenerate: undefined | (() => void) = undefined;
	export let toggleSettingsSheet: (s?: boolean) => void;
	export let isGenerationSettingsSheetOpen: boolean;
	export let isJustCreatedGenerationForAnim = false;
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
		$userSummary !== undefined &&
		$userSummary !== null &&
		$userSummary.total_remaining_credits < Number($generationNumOutputs);

	$: showClearPromptInputButton = $generationPrompt !== undefined && $generationPrompt !== '';
	$: promptInputPlaceholder = $LL.Home.PromptInput.Placeholder();

	let isJustCreatedGenerationTimeout: NodeJS.Timeout;
	const isJustCreatedGenerationTimeoutDuration = 350;
	let isJustCreatedGeneration = false;
	let isJustCreatedGenerationForAnimTimeout: NodeJS.Timeout;
	const isJustCreatedGenerationForAnimTimeoutDuration = 175;

	async function onPromptFormSubmitted() {
		if (isJustCreatedGeneration) {
			return;
		}
		if (doesntHaveEnoughCredits) {
			return;
		}
		if ($maxOngoingGenerationsCountReached) {
			return;
		}
		if (!$sessionStore?.user.id) {
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
		queueGeneration();
		afterGenerate?.();
		if ($windowWidth < mdBreakpoint) {
			promptInputElement.blur();
		}
		clearTimeout(isJustCreatedGenerationTimeout);
		isJustCreatedGeneration = true;
		isJustCreatedGenerationTimeout = setTimeout(() => {
			isJustCreatedGeneration = false;
		}, isJustCreatedGenerationTimeoutDuration);
		clearTimeout(isJustCreatedGenerationForAnimTimeout);
		isJustCreatedGenerationForAnim = true;
		isJustCreatedGenerationForAnimTimeout = setTimeout(() => {
			isJustCreatedGenerationForAnim = false;
		}, isJustCreatedGenerationForAnimTimeoutDuration);
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
		let mask_image_data_url = undefined;
		if ($generateMode === 'inpainting') {
			mask_image_data_url = await exportStage({
				container: konvaContainerForExportId,
				konvaInstance: $KonvaInstance,
				layer: $paintLayer,
				stage: $stage
			});
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
			mask_image_data_url,
			prompt_strength:
				$generationInitImageUrl && $generationInitImageStrength !== undefined
					? Number((1 - Number($generationInitImageStrength) / 100).toFixed(1))
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
			ui_id:
				$generateMode === 'inpainting' && $baseOutputForInpainting
					? $baseOutputForInpainting.id
					: $generations && $generations[0] && $generations[0].status === 'pre-submit'
						? $generations[0].ui_id
						: generateSSEId(),
			submit_to_gallery:
				$userSummary?.product_id || $userSummary?.has_nonfree_credits
					? $generationShouldSubmitToGallery
					: true
		};
		promptInputElement?.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
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

	function onKeyPressTextArea(e: any) {
		if (e.key === 'Enter') {
			e.preventDefault();
			onPromptFormSubmitted();
		}
	}

	let isPromptBarFocused = false;
	$: shouldPromptBarExpand =
		isPromptBarFocused &&
		!isGenerationSettingsSheetOpen &&
		$windowWidth &&
		$windowWidth < mdBreakpoint
			? true
			: false;

	onMount(() => {
		isCheckCompleted = false;
		if (!isValue(serverData.prompt) && isValue($prompt) && $prompt !== null) {
			generationPrompt.set($prompt);
		}
		isCheckCompleted = true;
		isReadyMap.promptBar = true;
	});

	afterNavigate(() => {
		if (serverData.prompt !== null) {
			generationPrompt.set(serverData.prompt);
		}
	});
</script>

<div style={styles} class="w-full flex justify-center {classes}">
	<form
		on:submit|preventDefault={onPromptFormSubmitted}
		class="w-full max-w-7xl flex flex-row items-center"
	>
		<div
			class="flex-1 flex gap-2 flex-row items-center transition duration-150 transform {isJustCreatedGenerationForAnim
				? 'scale-97 md:scale-98 xl:scale-98.5'
				: 'scale-100'}"
		>
			<div class="flex-1 flex relative group">
				<textarea
					on:focus={() => (isPromptBarFocused = true)}
					on:blur={() => (isPromptBarFocused = false)}
					use:autoresize={{
						maxRows: shouldPromptBarExpand ? 5 : 2,
						placeholder: promptInputPlaceholder,
						value: $generationPrompt
					}}
					bind:this={promptInputElement}
					bind:value={$generationPrompt}
					on:change={() => console.log('changed')}
					on:keypress={onKeyPressTextArea}
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
					class="w-full text-base bg-c-bg-secondary shadow-lg pr-20 md:pr-26 lg:pr-17 hide-scrollbar shadow-c-shadow/[var(--o-shadow-normal)]
							scroll-smooth resize-none transition relative pl-3 md:pl-5 py-3 md:py-4.5 rounded-lg md:rounded-xl
							focus:ring-2 focus:ring-c-primary/40 ring-0 ring-c-primary/20 placeholder:text-c-on-bg/50
							not-touch:enabled:hover:ring-2 text-c-on-bg not-touch:group-hover:ring-2"
				/>
				<ClearButton
					class="absolute right-11 md:right-13 top-0 lg:right-0"
					show={showClearPromptInputButton}
					onClick={clearPrompt}
				/>
				<div class="absolute right-0 top-0 h-full w-11 md:w-13 lg:hidden">
					<Button
						disabled={!isCheckCompleted ||
							(doesntHaveEnoughCredits && $sessionStore?.user.id !== undefined)}
						uploading={$generationInitImageFilesState === 'uploading'}
						waiting={$maxOngoingGenerationsCountReached}
						withSpinner
						fadeOnDisabled={isCheckCompleted}
						class="w-full h-full rounded-r-lg md:rounded-r-xl rounded-l-none absolute right-0 top-0"
						noPadding
						label={$LL.Home.GenerateButton()}
					>
						<IconWand class="w-7 h-7 md:w-8 md:h-8" />
					</Button>
					{#if doesntHaveEnoughCredits && $userSummary && $sessionStore?.user.id}
						<InsufficientCreditsBadge
							neededCredits={Number($generationNumOutputs)}
							remainingCredits={$userSummary.total_remaining_credits}
						/>
					{/if}
				</div>
			</div>
			<div class="w-auto relative hidden lg:block">
				<Button
					disabled={!isCheckCompleted ||
						(doesntHaveEnoughCredits && $sessionStore?.user.id !== undefined)}
					uploading={$generationInitImageFilesState === 'uploading'}
					waiting={$maxOngoingGenerationsCountReached}
					withSpinner
					noPadding
					fadeOnDisabled={isCheckCompleted}
					class="w-full flex flex-col relative py-4.5 px-6 xl:px-8"
				>
					{$LL.Home.GenerateButton()}
				</Button>
				{#if doesntHaveEnoughCredits && $userSummary && $sessionStore?.user.id}
					<InsufficientCreditsBadge
						neededCredits={Number($generationNumOutputs)}
						remainingCredits={$userSummary.total_remaining_credits}
					/>
				{/if}
			</div>
		</div>
		<NoBgButton
			size="sm"
			noPadding
			paddingClassForHoverEffect="px-1"
			onClick={() => toggleSettingsSheet()}
			class="h-full md:hidden px-3 py-2"
			hoverFrom="bottom"
			name={isGenerationSettingsSheetOpen
				? $LL.Generate.HideSettingsButton()
				: $LL.Generate.ShowSettingsButton()}
		>
			<Morpher morphed={$windowWidth < mdBreakpoint && isGenerationSettingsSheetOpen}>
				<div slot="0" class="w-8 h-8">
					<IconSettings
						class="transition not-touch:group-hover:text-c-primary
						w-full h-full {$windowWidth < mdBreakpoint && isGenerationSettingsSheetOpen
							? 'rotate-180'
							: 'rotate-0'}"
					/>
				</div>
				<div slot="1" class="w-8 h-8">
					<IconChevronDown
						class="transition transform not-touch:group-hover:text-c-primary
						w-full h-full {$windowWidth < mdBreakpoint && !isGenerationSettingsSheetOpen
							? '-rotate-180'
							: 'rotate-0'}"
					/>
				</div>
			</Morpher>
		</NoBgButton>
	</form>
</div>
