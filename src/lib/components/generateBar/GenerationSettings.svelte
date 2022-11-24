<script lang="ts">
	import IconAdvanced from '$components/icons/IconAdvanced.svelte';
	import IconAdvancedOutline from '$components/icons/IconAdvancedOutline.svelte';
	import IconChatBubbleCancel from '$components/icons/IconChatBubbleCancel.svelte';
	import IconHeight from '$components/icons/IconHeight.svelte';
	import IconScale from '$components/icons/IconScale.svelte';
	import IconSeed from '$components/icons/IconSeed.svelte';
	import IconSteps from '$components/icons/IconSteps.svelte';
	import IconWidth from '$components/icons/IconWidth.svelte';
	import TabBar from '$components/TabBar.svelte';
	import TabLikeInput from '$components/TabLikeInput.svelte';
	import TabLikeRangeInput from '$components/TabLikeRangeInput.svelte';
	import TabLikeToggle from '$components/TabLikeToggle.svelte';
	import LL from '$i18n/i18n-svelte';
	import { tooltip } from '$ts/actions/tooltip';
	import {
		guidanceScaleMax,
		guidanceScaleMin,
		heightTabs,
		inferenceStepsTabs,
		maxPromptLength,
		maxSeed,
		widthTabs
	} from '$ts/constants/main';
	import {
		advancedModeTooltip,
		guidanceScaleTooltip,
		heightTooltip,
		inferenceStepsTooltip,
		negativePromptTooltip,
		seedTooltip,
		widthTooltip
	} from '$ts/constants/tooltip';
	import { advancedMode } from '$ts/stores/advancedMode';
	import { currentServer } from '$ts/stores/serverHealth';

	export let generationWidth: string;
	export let generationHeight: string;
	export let generationInferenceSteps: string;
	export let generationGuidanceScale: number;
	export let generationSeed: number | undefined;
	export let negativePromptInputValue: string | undefined;
	export let isCheckComplete: boolean;
	export let formElement: HTMLFormElement;
	export let disabled = false;
</script>

<div class="w-full flex flex-wrap items-start justify-center px-2px py-4 gap-4">
	<TabBar
		{disabled}
		class="w-full md:w-84 xl:w-88 max-w-full"
		tabs={widthTabs}
		bind:value={generationWidth}
		name="width"
		hideSelected={!isCheckComplete}
	>
		<div
			slot="title"
			use:tooltip={$widthTooltip}
			class="py-2 px-4 flex items-center justify-center"
		>
			<IconWidth class="w-6 h-6 text-c-on-bg/25" />
		</div>
	</TabBar>
	<TabBar
		{disabled}
		class="w-full md:w-84 xl:w-88 max-w-full"
		tabs={heightTabs}
		bind:value={generationHeight}
		name="height"
		hideSelected={!isCheckComplete}
	>
		<div
			slot="title"
			use:tooltip={$heightTooltip}
			class="py-2 px-4 flex items-center justify-center"
		>
			<IconHeight class="w-6 h-6 text-c-on-bg/25" />
		</div>
	</TabBar>
	{#if $advancedMode}
		<TabBar
			{disabled}
			class="w-full md:w-84 xl:w-88 max-w-full"
			tabs={inferenceStepsTabs}
			bind:value={generationInferenceSteps}
			name="steps"
			hideSelected={!isCheckComplete}
		>
			<div
				slot="title"
				use:tooltip={$inferenceStepsTooltip}
				class="py-2 px-4 flex items-center justify-center"
			>
				<IconSteps class="w-6 h-6 text-c-on-bg/25" />
			</div>
		</TabBar>
		<TabLikeRangeInput
			{disabled}
			class="w-full md:w-84 xl:w-88 max-w-full"
			bind:value={generationGuidanceScale}
			min={guidanceScaleMin}
			max={guidanceScaleMax}
		>
			<div
				slot="title"
				use:tooltip={$guidanceScaleTooltip}
				class="py-2 px-4 flex items-center justify-center"
			>
				<IconScale class="w-6 h-6 text-c-on-bg/25" />
			</div>
		</TabLikeRangeInput>
		{#if $currentServer.features?.includes('negative_prompt')}
			<TabLikeInput
				disabled={!isCheckComplete || disabled}
				class="w-full md:w-84 xl:w-88 max-w-full"
				placeholder={$LL.Home.NegativePromptInput.Placeholder()}
				type="text"
				bind:value={negativePromptInputValue}
				max={maxPromptLength}
				{formElement}
			>
				<div
					slot="title"
					use:tooltip={$negativePromptTooltip}
					class="py-2 px-4 flex items-center justify-center"
				>
					<IconChatBubbleCancel class="w-6 h-6 text-c-on-bg/25" />
				</div>
			</TabLikeInput>
		{/if}
		<TabLikeInput
			disabled={!isCheckComplete || disabled}
			class="w-full md:w-84 xl:w-88 max-w-full"
			placeholder={$LL.Home.SeedInput.Placeholder()}
			bind:value={generationSeed}
			type="number"
			max={maxSeed}
			{formElement}
		>
			<div
				slot="title"
				use:tooltip={$seedTooltip}
				class="py-3.5 px-4 flex items-center justify-center"
			>
				<IconSeed class="w-6 h-6 text-c-on-bg/25" />
			</div>
		</TabLikeInput>
	{/if}
</div>
