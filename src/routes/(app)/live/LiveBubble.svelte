<script lang="ts">
	import IconRobot from '$components/icons/IconRobot.svelte';
	import IconServer from '$components/icons/IconServer.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import type { TAnyRealtimePayloadExt, TRow } from '$approutes/live/types';
	import { getTitleFromProductId } from '$ts/helpers/stripe/plan';
	import { operationSourceToLocaleString } from '$ts/helpers/user/operations';
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import IconSc from '$components/icons/IconSc.svelte';
	import WithTooltip from '$components/WithTooltip.svelte';

	export let processObject: TAnyRealtimePayloadExt;
	export let planBasedColor: (processObject: TAnyRealtimePayloadExt) => string;
	export let getCountryName: (locale: Locales, countryCode: string) => string | undefined;
	export let getOptionalInfo: (
		$LL: TranslationFunctions,
		processObject: TAnyRealtimePayloadExt
	) => TRow[];
	export let getDurationSec: (processObject: TAnyRealtimePayloadExt) => number;

	$: rows = [
		{
			key: $LL.Live.GenerationTooltip.CountryTitle() + ':',
			value: processObject.country_code
				? getCountryName($locale, processObject.country_code) ?? $LL.Shared.UnknownTitle()
				: $LL.Shared.UnknownTitle()
		},
		{
			key: $LL.Account.SubscriptionPlanTitle() + ':',
			value: getTitleFromProductId($LL, processObject.product_id)
		},
		{
			key: $LL.Live.GenerationTooltip.Type.Title() + ':',
			value:
				processObject.process_type === 'upscale'
					? $LL.Live.GenerationTooltip.Type.Upscale()
					: processObject.process_type === 'voiceover'
					? $LL.Live.GenerationTooltip.Type.Voiceover()
					: $LL.Live.GenerationTooltip.Type.Generation()
		},
		...(processObject.process_type === 'upscale' || processObject.process_type === 'generate'
			? [
					{
						key: $LL.Live.GenerationTooltip.DimensionsTitle() + ':',
						// @ts-ignore
						value: `${processObject.width} × ${processObject.height}`
					}
			  ]
			: []),
		...(processObject.aspect_ratio
			? [
					{
						key: $LL.Live.GenerationTooltip.AspectRatioTitle() + ':',
						value: processObject.aspect_ratio
					}
			  ]
			: []),
		...(processObject.actual_num_outputs
			? [
					{
						key: $LL.Live.GenerationTooltip.OutputsTitle() + ':',
						value: processObject.actual_num_outputs.toString()
					}
			  ]
			: []),
		...getOptionalInfo($LL, processObject),
		...(processObject.completed_at !== undefined
			? [
					{
						key: $LL.Live.GenerationTooltip.DurationTitle() + ':',
						value: `${getDurationSec(processObject).toLocaleString($locale, {
							maximumFractionDigits: 1
						})}`
					}
			  ]
			: []),
		{
			key: $LL.Account.Usage.UsageTable.Source() + ':',
			value: operationSourceToLocaleString(processObject.source, $LL)
		},
		{
			key: $LL.Live.GenerationTooltip.Status.Title() + ':',
			value:
				processObject.status === 'queued' || processObject.status === 'processing'
					? $LL.Live.GenerationTooltip.Status.Started()
					: processObject.status === 'succeeded'
					? $LL.Live.GenerationTooltip.Status.Succeeded()
					: $LL.Live.GenerationTooltip.Status.Failed()
		}
	];
</script>

<div
	class="p-8 relative z-0 {processObject.process_type === 'generate'
		? 'rounded-full'
		: 'rounded-xl'}"
>
	{#if processObject.status === 'queued' || processObject.status === 'processing'}
		<div
			transition:scale={{ duration: 300, easing: quadOut }}
			class="absolute w-full h-full left-0 top-0 origin-center"
		>
			<div
				class="w-full h-full transform {processObject.process_type === 'voiceover'
					? 'rotate-45'
					: ''}"
			>
				<div
					class="w-full h-full absolute left-0 top-0 {processObject.process_type === 'upscale' ||
					processObject.process_type === 'voiceover'
						? 'rounded-4xl'
						: 'rounded-full'} bg-c-primary/50 animate-ping-custom"
				/>
			</div>
		</div>
	{/if}
	<WithTooltip let:triggerStoreValue let:trigger delay={0} color="bg-secondary">
		<div
			tabindex="0"
			role="button"
			class="w-10 h-10 relative cursor-default rounded-xl"
			use:trigger
			{...triggerStoreValue}
		>
			{#if processObject.status === 'queued' || processObject.status === 'processing'}
				<div
					transition:scale={{ duration: 300, easing: quadOut }}
					class="w-full h-full absolute left-0 top-0 transform {processObject.process_type ===
					'voiceover'
						? 'rotate-45'
						: ''}"
				>
					<div
						class="w-full h-full {processObject.process_type === 'upscale'
							? 'rounded-xl'
							: processObject.process_type === 'voiceover'
							? 'rounded-xl'
							: 'rounded-full'} bg-c-primary animate-ping-custom-bg"
					/>
				</div>
			{/if}
			<div
				class="w-full h-full {processObject.process_type === 'upscale'
					? 'rounded-xl'
					: processObject.process_type === 'voiceover'
					? 'rounded-xl rotate-45'
					: 'rounded-full'} transform transition-all duration-300 flex items-center justify-center relative overflow-hidden z-0 {processObject.status ===
				'succeeded'
					? 'bg-c-success'
					: processObject.status === 'failed'
					? 'bg-c-danger'
					: 'bg-c-primary'} cursor-default"
			>
				<div
					class="w-full h-full flex flex-col items-center justify-center transform {processObject.process_type ===
					'voiceover'
						? '-rotate-45'
						: ''}"
					style="
					background-color: transparent;
					background-image:  linear-gradient(135deg, {planBasedColor(
						processObject
					)} 25%, transparent 25%), linear-gradient(225deg, {planBasedColor(
						processObject
					)} 25%, transparent 25%), linear-gradient(45deg, {planBasedColor(
						processObject
					)} 25%, transparent 25%), linear-gradient(315deg, {planBasedColor(
						processObject
					)} 25%, transparent 25%);
					background-position:  8px 0, 8px 0, 0 0, 0 0;
					background-size: 8px 8px;
					background-repeat: repeat;
				"
				>
					{#if processObject.system_generated === true}
						<IconRobot class="text-c-on-primary/75 w-6 h-6 -mt-1" />
					{:else if processObject.country_code}
						{#if processObject.source === 'api'}
							<IconServer class="text-c-on-primary/75 w-4 h-4 -mb-0.25 -mt-0.5" />
						{:else if processObject.source === 'discord'}
							<IconSc type="discord" class="text-c-on-primary/75 w-5 h-5 -mb-0.5 -mt-0.5" />
						{/if}
						<p class="text-center text-xs font-bold text-c-on-primary/75 cursor-default relative">
							{processObject.country_code}
						</p>
					{/if}
				</div>
			</div>
		</div>
		<div class="flex flex-col gap-1.5" slot="tooltip">
			{#each rows as row}
				<div class="w-full flex flex-row items-center justify-between text-sm gap-4">
					<p class="text-c-on-bg/60 text-left">{row.key}</p>
					<p class="font-medium text-c-on-bg text-right">{row.value}</p>
				</div>
			{/each}
		</div>
	</WithTooltip>
</div>
