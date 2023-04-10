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
		negativePromptInputValue,
		prompt,
		promptInputValue
	} from '$ts/stores/generationSettings';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import {
		generations,
		queueInitialGenerationRequest,
		type TInitialGenerationRequest
	} from '$ts/stores/user/generation';
	import { sseId } from '$ts/stores/user/sse';
	import { userSummary } from '$ts/stores/user/summary';
	import { maxOngoingGenerationsCount } from '$routes/admin/create/constants';

	export let isCheckCompleted = false;
	export let withCheck: (fn: () => void) => void;
	export let openSignInModal: () => void;

	let promptInputElement: HTMLTextAreaElement;
	let promptFormElement: HTMLFormElement;

	$: [$promptInputValue], withCheck(setLocalPrompt);

	$: doesntHaveEnoughCredits =
		isCheckCompleted &&
		$userSummary &&
		$userSummary.total_remaining_credits < Number($generationNumOutputs);

	$: showClearPromptInputButton = $promptInputValue !== undefined && $promptInputValue !== '';
	$: promptInputPlaceholder = $LL.Home.PromptInput.Placeholder();

	$: onGoingGenerationsCount = $generations
		.map((g) => g.status)
		.filter((s) => s !== 'succeeded' && s !== 'failed').length;
	$: maxOngoingGenerationsCountReached = onGoingGenerationsCount >= $maxOngoingGenerationsCount;

	async function onPromptFormSubmitted() {
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
		if ($promptInputValue) {
			promptInputValue.set(formatPrompt($promptInputValue));
		}
		if ($negativePromptInputValue) {
			negativePromptInputValue.set(formatPrompt($negativePromptInputValue));
		}
		if (!$promptInputValue) {
			promptInputValue.set(promptInputPlaceholder);
		}
		queueGeneration();
	}

	async function queueGeneration() {
		if (!$promptInputValue) {
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
				text: $promptInputValue
			},
			negative_prompt: $negativePromptInputValue
				? {
						id: 'negative_prompt',
						text: $negativePromptInputValue
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
		promptInputValue.set('');
		promptInputElement.value = '';
		promptInputElement.blur();
		promptInputElement.focus();
	}

	function setLocalPrompt() {
		prompt.set(
			$promptInputValue !== '' && $promptInputValue !== undefined ? $promptInputValue : ''
		);
	}
</script>

<div class="w-full flex justify-center">
	<form
		bind:this={promptFormElement}
		on:submit|preventDefault={onPromptFormSubmitted}
		class="w-full max-w-6xl flex flex-col md:flex-row gap-3 items-center"
	>
		<div class="w-full md:w-auto md:flex-1 flex relative group">
			<textarea
				use:autoresize={{ maxRows: 3, placeholder: promptInputPlaceholder }}
				bind:this={promptInputElement}
				bind:value={$promptInputValue}
				on:keypress={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						onPromptFormSubmitted();
					}
				}}
				on:input={() => {
					if (
						$promptInputValue !== undefined &&
						$promptInputValue !== null &&
						$promptInputValue.length > maxPromptLength
					) {
						promptInputValue.set($promptInputValue.slice(0, maxPromptLength));
					}
				}}
				disabled={!isCheckCompleted}
				placeholder={promptInputPlaceholder}
				rows="1"
				style="transition: height 0.1s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), padding 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
				class="w-full bg-c-bg-secondary shadow-lg pr-12 md:pr-17 hide-scrollbar shadow-c-shadow/[var(--o-shadow-normal)] 
						scroll-smooth resize-none transition relative pl-5 md:pl-6 py-5 rounded-xl 
						focus:ring-2 focus:ring-c-primary/30 ring-0 ring-c-primary/20 placeholder:text-c-on-bg/40 {!$isTouchscreen
					? 'enabled:hover:ring-2'
					: ''} text-c-on-bg {!$isTouchscreen ? 'group-hover:ring-2' : ''}"
			/>
			<ClearButton show={showClearPromptInputButton} onClick={clearPrompt} />
		</div>
		<div class="w-full md:w-auto md:min-w-[9.5rem] relative">
			<Button
				disabled={!isCheckCompleted ||
					(doesntHaveEnoughCredits && $page.data.session?.user.id !== undefined)}
				uploading={$generationInitImageFilesState === 'uploading'}
				loading={onGoingGenerationsCount >= $maxOngoingGenerationsCount}
				withSpinner
				fadeOnDisabled={isCheckCompleted}
				class="w-full flex flex-col relative"
			>
				<p>
					{$LL.Home.GenerateButton()}
				</p>
			</Button>
			{#if doesntHaveEnoughCredits && $userSummary && $page.data.session?.user.id}
				<InsufficientCreditsBadge
					neededCredits={Number($generationNumOutputs)}
					remainingCredits={$userSummary.total_remaining_credits}
				/>
			{/if}
		</div>
	</form>
</div>
