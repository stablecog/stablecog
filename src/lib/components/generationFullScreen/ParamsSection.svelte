<script lang="ts">
	import SubtleButton from '$components/buttons/SubtleButton.svelte';
	import type {
		TButtonObjectsWithState,
		TGenerationFullScreenModalType,
		TSetButtonObjectWithState
	} from '$components/generationFullScreen/types';
	import IconBrain from '$components/icons/IconBrain.svelte';
	import IconBubbles from '$components/icons/IconBubbles.svelte';
	import IconCopy from '$components/icons/IconCopy.svelte';
	import IconDimensions from '$components/icons/IconDimensions.svelte';
	import IconScale from '$components/icons/IconScale.svelte';
	import IconSeed from '$components/icons/IconSeed.svelte';
	import IconSteps from '$components/icons/IconSteps.svelte';
	import IconTick from '$components/icons/IconTick.svelte';
	import Morpher from '$components/Morpher.svelte';
	import LL from '$i18n/i18n-svelte';
	import { tooltip } from '$ts/actions/tooltip';
	import { generationModelIdDefault, modelIdToDisplayName } from '$ts/constants/generationModels';
	import { schedulerIdDefault, schedulerIdToDisplayName } from '$ts/constants/schedulers';
	import {
		guidanceScaleTooltipAlt,
		inferenceStepsTooltipAlt,
		modelTooltipAlt,
		schedulerTooltipAlt,
		seedTooltipAlt
	} from '$ts/constants/tooltips';
	import type { TGenerationWithSelectedOutput } from '$userStores/generation';
	import { copy } from 'svelte-copy';

	export let generation: TGenerationWithSelectedOutput;
	export let currentImageWidth: number;
	export let currentImageHeight: number;
	export let setButtonObjectWithState: TSetButtonObjectWithState;
	export let buttonObjectsWithState: TButtonObjectsWithState;
	export let modalType: TGenerationFullScreenModalType;
	export { classes as class };
	let classes = '';
</script>

<div class={classes}>
	<div class="flex flex-wrap gap-6">
		<div class="min-w-[calc(50%-0.75rem)] flex flex-col items-start gap-1">
			<div
				use:tooltip={$modelTooltipAlt}
				class="flex items-center gap-1.5 text-c-on-bg/75 text-sm cursor-default"
			>
				<IconBrain class="w-4 h-4" />
				<p class="font-medium">{$LL.Home.ModelDropdown.Title()}</p>
			</div>
			<p class="font-semibold">
				{$modelIdToDisplayName[generation.model_id ?? generationModelIdDefault] ??
					$LL.Shared.UnknownTitle()}
			</p>
		</div>
		<div class="min-w-[calc(50%-0.75rem)] flex flex-col items-start gap-1">
			<div
				use:tooltip={$guidanceScaleTooltipAlt}
				class="flex items-center gap-1.5 text-c-on-bg/75 text-sm cursor-default"
			>
				<IconScale class="w-4 h-4" />
				<p class="font-medium">{$LL.Home.GuidanceScaleSlider.Title()}</p>
			</div>
			<p class="font-semibold">{generation.guidance_scale}</p>
		</div>
		<div class="min-w-[calc(50%-0.75rem)] flex flex-col items-start gap-1">
			<div
				use:tooltip={$inferenceStepsTooltipAlt}
				class="flex items-center gap-1.5 text-c-on-bg/75 text-sm cursor-default"
			>
				<IconSteps class="w-4 h-4" />
				<p class="font-medium">{$LL.Home.InferenceStepsTabBar.Title()}</p>
			</div>
			<p class="font-semibold">{generation.inference_steps}</p>
		</div>
		<div class="min-w-[calc(50%-0.75rem)] flex flex-col items-start gap-1">
			<div
				use:tooltip={$schedulerTooltipAlt}
				class="flex items-center gap-1.5 text-c-on-bg/75 text-sm cursor-default"
			>
				<IconBubbles class="w-4 h-4" />
				<p class="font-medium">{$LL.Home.SchedulerDropdown.Title()}</p>
			</div>
			<p class="font-semibold">
				{$schedulerIdToDisplayName[generation.scheduler_id ?? schedulerIdDefault] ??
					$LL.Shared.UnknownTitle()}
			</p>
		</div>
		<!-- {#if modalType === 'generate' || modalType === 'history' || modalType === 'admin-gallery'}
			<div class="min-w-[calc(50%-0.75rem)] flex flex-wrap items-center gap-3.5">
				<div class="flex flex-col items-start gap-1">
					<div
						use:tooltip={$seedTooltipAlt}
						class="flex items-center gap-1.5 text-c-on-bg/75 text-sm cursor-default"
					>
						<IconSeed class="w-4 h-4" />
						<p class="font-medium">{$LL.Home.SeedInput.Title()}</p>
					</div>
					<p class="font-semibold">{generation.seed}</p>
				</div>
				{#key generation.selected_output.id}
					<div
						use:copy={String(generation.seed)}
						on:svelte-copy={() => setButtonObjectWithState('seed', 'success')}
					>
						<SubtleButton
							noPadding
							class="p-2.5"
							state={buttonObjectsWithState.seed.state === 'success' ? 'success' : 'idle'}
						>
							<Morpher morphed={buttonObjectsWithState.seed.state === 'success'}>
								<div slot="0" class="flex items-center justify-center gap-1.5">
									<IconCopy class="w-5 h-5" />
								</div>
								<div slot="1" class="flex items-center justify-center gap-1.5">
									<IconTick class="w-8 h-8" />
								</div>
							</Morpher>
						</SubtleButton>
					</div>
				{/key}
			</div>
		{/if} -->
		<div class="min-w-[calc(50%-0.75rem)] flex flex-col items-start gap-1">
			<div class="flex items-center gap-1.5 text-c-on-bg/75 text-sm cursor-default">
				<IconDimensions class="w-4 h-4" />
				<p class="font-medium">{$LL.GenerationFullscreen.Dimensions.Title()}</p>
			</div>
			<p class="font-semibold">{currentImageWidth} × {currentImageHeight}</p>
		</div>
	</div>
</div>
