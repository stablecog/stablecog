<script lang="ts">
	import IconRobot from '$components/icons/IconRobot.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import type {
		TGenerationRealtimePayloadExt,
		TRow,
		TUpscaleRealtimePayloadExt
	} from '$routes/live/types';
	import { tooltip } from '$ts/actions/tooltip';
	import { tooltipLivePageStyleProps } from '$ts/constants/tooltips';
	import { getTitleFromProductId } from '$ts/helpers/stripe/plan';
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export let generationOrUpscale: TGenerationRealtimePayloadExt | TUpscaleRealtimePayloadExt;
	export let planBasedColor: (
		generationOrUpscale: TGenerationRealtimePayloadExt | TUpscaleRealtimePayloadExt
	) => string;
	export let getCountryName: (locale: Locales, countryCode: string) => string | undefined;
	export let getOptionalInfo: (
		$LL: TranslationFunctions,
		generationOrUpscale: TGenerationRealtimePayloadExt | TUpscaleRealtimePayloadExt
	) => TRow[];
	export let getDurationSec: (
		generationOrUpscale: TGenerationRealtimePayloadExt | TUpscaleRealtimePayloadExt
	) => number;

	$: rows = [
		{
			key: $LL.Live.GenerationTooltip.CountryTitle() + ':',
			value: generationOrUpscale.country_code
				? getCountryName($locale, generationOrUpscale.country_code) ??
				  $LL.Live.GenerationTooltip.UnknownTitle()
				: $LL.Live.GenerationTooltip.UnknownTitle()
		},
		{
			key: $LL.Account.SubscriptionPlanTitle() + ':',
			value: getTitleFromProductId($LL, generationOrUpscale.product_id)
		},
		{
			key: $LL.Live.GenerationTooltip.Type.Title() + ':',
			value:
				generationOrUpscale.process_type === 'upscale'
					? $LL.Live.GenerationTooltip.Type.Upscale()
					: $LL.Live.GenerationTooltip.Type.Generation()
		},
		...(generationOrUpscale.width && generationOrUpscale.height
			? [
					{
						key: $LL.Live.GenerationTooltip.DimensionsTitle() + ':',
						value: `${generationOrUpscale.width} × ${generationOrUpscale.height}`
					}
			  ]
			: []),
		...(generationOrUpscale.aspect_ratio
			? [
					{
						key: $LL.Live.GenerationTooltip.AspectRatioTitle() + ':',
						value: generationOrUpscale.aspect_ratio
					}
			  ]
			: []),
		...(generationOrUpscale.actual_num_outputs
			? [
					{
						key: $LL.Live.GenerationTooltip.OutputsTitle() + ':',
						value: generationOrUpscale.actual_num_outputs.toString()
					}
			  ]
			: []),
		...getOptionalInfo($LL, generationOrUpscale),
		...(generationOrUpscale.completed_at !== undefined
			? [
					{
						key: $LL.Live.GenerationTooltip.DurationTitle() + ':',
						value: `${getDurationSec(generationOrUpscale).toLocaleString($locale, {
							maximumFractionDigits: 1
						})}`
					}
			  ]
			: []),
		{
			key: $LL.Live.GenerationTooltip.Status.Title() + ':',
			value:
				generationOrUpscale.status === 'queued' || generationOrUpscale.status === 'processing'
					? $LL.Live.GenerationTooltip.Status.Started()
					: generationOrUpscale.status === 'succeeded'
					? $LL.Live.GenerationTooltip.Status.Succeeded()
					: $LL.Live.GenerationTooltip.Status.Failed()
		}
	];
</script>

<div
	class="p-8 relative overflow-hidden z-0 {generationOrUpscale.process_type === 'generate'
		? 'rounded-full'
		: 'rounded-xl'}"
>
	{#if generationOrUpscale.status === 'queued' || generationOrUpscale.status === 'processing'}
		<div
			transition:scale|local={{ duration: 300, easing: quadOut }}
			class="absolute w-full h-full left-0 top-0 origin-center"
		>
			<div class="w-full h-full">
				<div
					class="w-full h-full absolute left-0 top-0 {generationOrUpscale.process_type ===
					'generate'
						? 'rounded-full'
						: 'rounded-4xl'} bg-c-primary/50 animate-ping-custom"
				/>
			</div>
		</div>
	{/if}
	<div class="w-10 h-10 relative">
		{#if generationOrUpscale.status === 'queued' || generationOrUpscale.status === 'processing'}
			<div
				transition:scale|local={{ duration: 300, easing: quadOut }}
				class="w-full h-full absolute left-0 top-0 {generationOrUpscale.process_type === 'generate'
					? 'rounded-full'
					: 'rounded-xl'} bg-c-primary animate-ping-custom-bg"
			/>
		{/if}
		<div
			use:tooltip={{ rows, ...tooltipLivePageStyleProps }}
			class="w-full h-full {generationOrUpscale.process_type === 'generate'
				? 'rounded-full'
				: 'rounded-xl'} transition-all duration-300 flex items-center justify-center relative overflow-hidden z-0 {generationOrUpscale.status ===
			'succeeded'
				? 'bg-c-success'
				: generationOrUpscale.status === 'failed'
				? 'bg-c-danger'
				: 'bg-c-primary'}"
		>
			<div
				class="w-full h-full flex items-center justify-center"
				style="
					background-color: transparent;
					background-image:  linear-gradient(135deg, {planBasedColor(
					generationOrUpscale
				)} 25%, transparent 25%), linear-gradient(225deg, {planBasedColor(
					generationOrUpscale
				)} 25%, transparent 25%), linear-gradient(45deg, {planBasedColor(
					generationOrUpscale
				)} 25%, transparent 25%), linear-gradient(315deg, {planBasedColor(
					generationOrUpscale
				)} 25%, transparent 25%);
					background-position:  8px 0, 8px 0, 0 0, 0 0;
					background-size: 8px 8px;
					background-repeat: repeat;
				"
			>
				{#if generationOrUpscale.system_generated === true}
					<IconRobot class="text-c-on-primary/75 w-6 h-6 -mt-1" />
				{:else if generationOrUpscale.country_code}
					<p class="text-center text-xs font-bold text-c-on-primary/75 cursor-default relative">
						{generationOrUpscale.country_code}
					</p>
				{/if}
			</div>
		</div>
	</div>
</div>
