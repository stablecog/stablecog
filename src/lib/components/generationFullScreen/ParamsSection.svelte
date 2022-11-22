<script lang="ts">
	import SubtleButton from '$components/buttons/SubtleButton.svelte';
	import IconClock from '$components/icons/IconClock.svelte';
	import IconCopy from '$components/icons/IconCopy.svelte';
	import IconDimensions from '$components/icons/IconDimensions.svelte';
	import IconScale from '$components/icons/IconScale.svelte';
	import IconSeed from '$components/icons/IconSeed.svelte';
	import IconSteps from '$components/icons/IconSteps.svelte';
	import IconTick from '$components/icons/IconTick.svelte';
	import Morpher from '$components/Morpher.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { tooltip } from '$ts/actions/tooltip';
	import {
		guidanceScaleTooltipAlt,
		inferenceStepsTooltipAlt,
		seedTooltipAlt
	} from '$ts/constants/tooltip';
	import type { TGenerationUI } from '$ts/types/main';
	import { copy } from 'svelte-copy';

	export let generation: TGenerationUI;
	export let currentImageWidth: number;
	export let currentImageHeight: number;
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
	<div class="flex flex-wrap items-center gap-3.5">
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
				<Morpher morph={seedCopied}>
					<div slot="item-0" class="flex items-center justify-center gap-1.5">
						<IconCopy class="w-5 h-5" />
					</div>
					<div slot="item-1" class="flex items-center justify-center gap-1.5">
						<IconTick class="w-5 h-5 scale-150" />
					</div>
				</Morpher>
			</SubtleButton>
		</div>
	</div>
	<div class="flex flex-wrap gap-6">
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
			<p class="font-bold">{generation.num_inference_steps}</p>
		</div>
		<div class="min-w-[calc(50%-0.75rem)] flex flex-col items-start gap-1">
			<div class="flex items-center gap-1.5 text-c-on-bg/75 text-sm cursor-default">
				<IconDimensions class="w-4 h-4" />
				<p>{$LL.GenerationFullscreen.Dimensions.Title()}</p>
			</div>
			<p class="font-bold">{currentImageWidth} × {currentImageHeight}</p>
		</div>
		{#if generation.duration_ms}
			<div class="min-w-[calc(50%-0.75rem)] flex flex-col items-start gap-1">
				<div class="flex items-center gap-1.5 text-c-on-bg/75 text-sm cursor-default">
					<IconClock class="w-4 h-4" />
					<p>{$LL.GenerationFullscreen.Duration.Title()}</p>
				</div>
				<p class="font-bold">
					{(generation.duration_ms / 1000).toLocaleString($locale, {
						minimumFractionDigits: 0,
						maximumFractionDigits: 1
					})}
				</p>
			</div>
		{/if}
	</div>
</div>
