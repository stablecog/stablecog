<script lang="ts">
	import SubtleButton from '$components/buttons/SubtleButton.svelte';
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
	import { modelIdDefault, modelIdToDisplayName } from '$ts/constants/models';
	import { schedulerIdDefault, schedulerIdToDisplayName } from '$ts/constants/schedulers';
	import {
		guidanceScaleTooltipAlt,
		inferenceStepsTooltipAlt,
		modelTooltipAlt,
		schedulerTooltipAlt,
		seedTooltipAlt
	} from '$ts/constants/tooltips';
	import type { TDBGenerationG } from '$ts/types/db';
	import { copy } from 'svelte-copy';

	export let generation: TDBGenerationG;
	export let onSeedCopyClicked: () => void;
	export let seedCopiedTimeout: NodeJS.Timeout;
	export let seedCopied = false;
	export let copyTimeoutDuration: number;
	export { classes as class };
	let classes = '';
	const onSeedCopied = () => {
		seedCopied = true;
		clearTimeout(seedCopiedTimeout);
		onSeedCopyClicked();
		seedCopiedTimeout = setTimeout(() => {
			seedCopied = false;
		}, copyTimeoutDuration);
	};
</script>

<div class={classes}>
	<div class="flex flex-wrap gap-6">
		<div class="min-w-[calc(50%-0.75rem)] flex flex-col items-start gap-1">
			<div
				use:tooltip={$modelTooltipAlt}
				class="flex items-center gap-1.5 text-c-on-bg/75 text-sm cursor-default"
			>
				<IconBrain class="w-4 h-4" />
				<p>{$LL.Home.ModelDropdown.Title()}</p>
			</div>
			<p class="font-bold">
				{$modelIdToDisplayName[generation.model?.id ?? modelIdDefault] ?? $LL.Shared.UnknownTitle()}
			</p>
		</div>
		<div class="min-w-[calc(50%-0.75rem)] flex flex-col items-start gap-1">
			<div
				use:tooltip={$guidanceScaleTooltipAlt}
				class="flex items-center gap-1.5 text-c-on-bg/75 text-sm cursor-default"
			>
				<IconScale class="w-4 h-4" />
				<p>{$LL.Home.GuidanceScaleSlider.Title()}</p>
			</div>
			<p class="font-bold">{generation.guidance_scale}</p>
		</div>
		<div class="min-w-[calc(50%-0.75rem)] flex flex-col items-start gap-1">
			<div
				use:tooltip={$inferenceStepsTooltipAlt}
				class="flex items-center gap-1.5 text-c-on-bg/75 text-sm cursor-default"
			>
				<IconSteps class="w-4 h-4" />
				<p>{$LL.Home.InferenceStepsTabBar.Title()}</p>
			</div>
			<p class="font-bold">{generation.inference_steps}</p>
		</div>
		<div class="min-w-[calc(50%-0.75rem)] flex flex-col items-start gap-1">
			<div
				use:tooltip={$schedulerTooltipAlt}
				class="flex items-center gap-1.5 text-c-on-bg/75 text-sm cursor-default"
			>
				<IconBubbles class="w-4 h-4" />
				<p>{$LL.Home.SchedulerDropdown.Title()}</p>
			</div>
			<p class="font-bold">
				{$schedulerIdToDisplayName[generation.scheduler?.id ?? schedulerIdDefault] ??
					$LL.Shared.UnknownTitle()}
			</p>
		</div>
		<div class="min-w-[calc(50%-0.75rem)] flex flex-wrap items-center gap-3.5">
			<div class="flex flex-col items-start gap-1">
				<div
					use:tooltip={$seedTooltipAlt}
					class="flex items-center gap-1.5 text-c-on-bg/75 text-sm cursor-default"
				>
					<IconSeed class="w-4 h-4" />
					<p>{$LL.Home.SeedInput.Title()}</p>
				</div>
				<p class="font-bold">{generation.seed}</p>
			</div>
			<div use:copy={String(generation.seed)} on:svelte-copy={onSeedCopied}>
				<SubtleButton noPadding class="p-2.5" state={seedCopied ? 'success' : 'idle'}>
					<Morpher morphed={seedCopied}>
						<div slot="item-0" class="flex items-center justify-center gap-1.5">
							<IconCopy class="w-5 h-5" />
						</div>
						<div slot="item-1" class="flex items-center justify-center gap-1.5">
							<IconTick class="w-8 h-8" />
						</div>
					</Morpher>
				</SubtleButton>
			</div>
		</div>
		<div class="min-w-[calc(50%-0.75rem)] flex flex-col items-start gap-1">
			<div class="flex items-center gap-1.5 text-c-on-bg/75 text-sm cursor-default">
				<IconDimensions class="w-4 h-4" />
				<p>{$LL.GenerationFullscreen.Dimensions.Title()}</p>
			</div>
			<p class="font-bold">{generation.width} × {generation.height}</p>
		</div>
	</div>
</div>
