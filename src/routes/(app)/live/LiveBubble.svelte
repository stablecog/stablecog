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
	import WithTooltip from '$components/utils/WithTooltip.svelte';

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
	class="relative z-0 p-8 {processObject.process_type === 'generate'
		? 'rounded-full'
		: 'rounded-xl'}"
>
	{#if processObject.status === 'queued' || processObject.status === 'processing'}
		<div
			transition:scale={{ duration: 300, easing: quadOut }}
			class="absolute left-0 top-0 h-full w-full origin-center"
		>
			<div
				class="h-full w-full transform {processObject.process_type === 'voiceover'
					? 'rotate-45'
					: ''}"
			>
				<div
					class="absolute left-0 top-0 h-full w-full {processObject.process_type === 'upscale' ||
					processObject.process_type === 'voiceover'
						? 'rounded-4xl'
						: 'rounded-full'} animate-ping-custom bg-c-primary/50"
				/>
			</div>
		</div>
	{/if}
	<WithTooltip let:triggerStoreValue let:trigger delay={0} color="bg-secondary">
		<div
			tabindex="0"
			role="button"
			class="relative h-10 w-10 cursor-default rounded-xl"
			use:trigger
			{...triggerStoreValue}
		>
			{#if processObject.status === 'queued' || processObject.status === 'processing'}
				<div
					transition:scale={{ duration: 300, easing: quadOut }}
					class="absolute left-0 top-0 h-full w-full transform {processObject.process_type ===
					'voiceover'
						? 'rotate-45'
						: ''}"
				>
					<div
						class="h-full w-full {processObject.process_type === 'upscale'
							? 'rounded-xl'
							: processObject.process_type === 'voiceover'
								? 'rounded-xl'
								: 'rounded-full'} animate-ping-custom-bg bg-c-primary"
					/>
				</div>
			{/if}
			<div
				class="h-full w-full {processObject.process_type === 'upscale'
					? 'rounded-xl'
					: processObject.process_type === 'voiceover'
						? 'rotate-45 rounded-xl'
						: 'rounded-full'} relative z-0 flex transform items-center justify-center overflow-hidden transition-all duration-300 {processObject.status ===
				'succeeded'
					? 'bg-c-success'
					: processObject.status === 'failed'
						? 'bg-c-danger'
						: 'bg-c-primary'} cursor-default"
			>
				<div
					class="flex h-full w-full transform flex-col items-center justify-center {processObject.process_type ===
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
						<IconRobot class="-mt-1 h-6 w-6 text-c-on-primary/75" />
					{:else if processObject.country_code}
						{#if processObject.source === 'api'}
							<IconServer class="-mb-0.25 -mt-0.5 h-4 w-4 text-c-on-primary/75" />
						{:else if processObject.source === 'discord'}
							<IconSc type="discord" class="-mb-0.5 -mt-0.5 h-5 w-5 text-c-on-primary/75" />
						{/if}
						<p class="relative cursor-default text-center text-xs font-bold text-c-on-primary/75">
							{processObject.country_code}
						</p>
					{/if}
				</div>
			</div>
		</div>
		<div class="flex flex-col gap-1.5" slot="tooltip">
			{#each rows as row}
				<div class="flex w-full flex-row items-center justify-between gap-4 text-sm">
					<p class="text-left text-c-on-bg/60">{row.key}</p>
					<p class="text-right font-medium text-c-on-bg">{row.value}</p>
				</div>
			{/each}
		</div>
	</WithTooltip>
</div>
