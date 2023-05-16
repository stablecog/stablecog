<script lang="ts">
	import type { CreateInfiniteQueryResult } from '@tanstack/svelte-query';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import IconSadFaceOutline from '$components/icons/IconSadFaceOutline.svelte';
	import type { Readable } from 'svelte/store';
	import { createWindowVirtualizer, type SvelteVirtualizer } from '@tanstack/svelte-virtual';
	import type {
		TOperationSource,
		TOperationType,
		TUserOperationExtended,
		TUserOperationsPageExtended
	} from '$ts/queries/operations';
	import { browser } from '$app/environment';
	import IconGraph from '$components/icons/IconGraph.svelte';
	import { getRelativeDate } from '$ts/helpers/getRelativeDate';

	export let operationsQuery:
		| CreateInfiniteQueryResult<TUserOperationsPageExtended, unknown>
		| undefined;

	let listVirtualizer: Readable<SvelteVirtualizer<Window, Element>> | undefined;

	let operations: TUserOperationExtended[] | undefined;

	$: operations = $operationsQuery?.data?.pages?.flatMap((page) => page.operations);
	const overscanCount = 50;
	const estimatedSize = 54;

	$: [operations], initiallySetListVirtualizer();
	$: $listVirtualizer, onListVirtualizerChanged();
	$: [operations], onParamsChanged();

	function onParamsChanged() {
		if ($listVirtualizer === undefined) return;
		let optionsToSet: { [key: string]: string | number } = {};
		if (operations) {
			optionsToSet.count = operations.length;
		}
		if (overscanCount) {
			optionsToSet.overscan = overscanCount;
		}
		if (Object.keys(optionsToSet).length > 0) {
			$listVirtualizer.setOptions(optionsToSet);
		}
	}

	function onListVirtualizerChanged() {
		if (
			!operations ||
			!$listVirtualizer ||
			!$operationsQuery?.hasNextPage ||
			$operationsQuery?.isFetchingNextPage ||
			overscanCount === undefined
		)
			return;
		const items = $listVirtualizer.getVirtualItems();
		if (!items || items.length < 1) return;
		const lastItemIndex = items[items.length - 1].index;
		const isLastItemVisible = lastItemIndex >= operations.length - 1 - overscanCount;
		if (!isLastItemVisible) return;
		$operationsQuery.fetchNextPage();
	}

	function initiallySetListVirtualizer() {
		if ($listVirtualizer || operations === undefined || !overscanCount) return;
		listVirtualizer = createWindowVirtualizer({
			count: operations.length,
			overscan: overscanCount,
			getScrollElement: () => window,
			estimateSize: (i) => estimatedSize
		});
	}

	$: costFormatter = new Intl.NumberFormat($locale, {
		style: 'decimal',
		maximumFractionDigits: 0
	});

	$: durationFormatter = new Intl.NumberFormat($locale, {
		style: 'decimal',
		maximumFractionDigits: 1
	});

	function operationTypeToLocaleString(type: TOperationType, $LL: TranslationFunctions) {
		switch (type) {
			case 'upscale':
				return $LL.Account.Usage.UsageType.Upscale();
			default:
				return $LL.Account.Usage.UsageType.Generate();
		}
	}

	function operationSourceToLocaleString(source: TOperationSource, $LL: TranslationFunctions) {
		switch (source) {
			case 'api':
				return $LL.Account.Usage.SourceType.API();
			default:
				return $LL.Account.Usage.SourceType.Web();
		}
	}
</script>

{#if $operationsQuery?.isError}
	<div class="w-full flex flex-col items-center justify-center py-8 px-5 md:px-12">
		<IconSadFaceOutline class="w-10 h-10 text-c-on-bg/50" />
		<p class="text-c-on-surface-secondary text-c-on-bg/50 mt-2 text-center">
			{$LL.Error.SomethingWentWrong()}
		</p>
	</div>
{:else if operations === undefined || $operationsQuery === undefined || $operationsQuery.data === undefined || $operationsQuery?.isInitialLoading}
	<div class="w-full flex flex-col items-center justify-center py-8 px-5 md:px-12">
		<IconAnimatedSpinner class="w-10 h-10 text-c-on-bg/50" />
		<p class="text-c-on-surface-secondary text-c-on-bg/50 mt-2 text-center">
			{$LL.Shared.LoadingTitle()}
		</p>
	</div>
{:else if operations.length === 0}
	<div class="w-full flex flex-col items-center justify-center py-8 px-5 md:px-12">
		<IconGraph class="w-10 h-10 text-c-on-bg/50" />
		<p class="text-c-on-surface-secondary text-c-on-bg/50 mt-2 text-center">
			{$LL.Account.Usage.NoUsageYet()}
		</p>
	</div>
{:else if browser && $listVirtualizer}
	<div class="w-full text-sm md:text-base flex items-center font-semibold">
		<p
			class="border-b-2 border-c-bg-secondary flex-1 px-4 py-3.5 min-w-[7rem] w-1/6 whitespace-nowrap overflow-hidden overflow-ellipsis"
		>
			{$LL.Account.Usage.UsageTable.ID()}
		</p>
		<p
			class="border-b-2 border-c-bg-secondary flex-1 px-4 py-3.5 min-w-[7rem] w-1/6 whitespace-nowrap overflow-hidden overflow-ellipsis"
		>
			{$LL.Account.Usage.UsageTable.Operation()}
		</p>
		<p
			class="border-b-2 border-c-bg-secondary flex-1 px-4 py-3.5 min-w-[7rem] w-1/6 whitespace-nowrap overflow-hidden overflow-ellipsis"
		>
			{$LL.Account.Usage.UsageTable.Cost()}
		</p>
		<p
			class="border-b-2 border-c-bg-secondary flex-1 px-4 py-3.5 min-w-[7rem] w-1/6 whitespace-nowrap overflow-hidden overflow-ellipsis"
		>
			{$LL.Account.APIKeys.KeyTable.CreatedAtTitle()}
		</p>
		<p
			class="border-b-2 border-c-bg-secondary flex-1 px-4 py-3.5 min-w-[7rem] w-1/6 whitespace-nowrap overflow-hidden overflow-ellipsis"
		>
			{$LL.Account.Usage.UsageTable.Duration()}
		</p>
		<p
			class="border-b-2 border-c-bg-secondary flex-1 px-4 py-3.5 min-w-[7rem] w-1/6 whitespace-nowrap overflow-hidden overflow-ellipsis"
		>
			{$LL.Account.Usage.UsageTable.Source()}
		</p>
	</div>
	<div
		style="height: {$listVirtualizer.getTotalSize()}px"
		class="w-full text-sm md:text-base relative"
	>
		{#each $listVirtualizer.getVirtualItems() as virtualItem (virtualItem.index + operations[virtualItem.index].id)}
			{@const operation = operations[virtualItem.index]}
			<div
				key={virtualItem.index}
				class="absolute"
				style="
						height: {virtualItem.size}px;
						width: 100%;
						left: 0;
						top: 0;
						transform: translateY({virtualItem.start}px);
					"
			>
				<div class="h-full flex items-center text-c-on-bg/75">
					<p
						class="{virtualItem.index !== operations.length - 1
							? 'border-b-2'
							: ''} border-c-bg-secondary flex-1 px-4 py-3.5 min-w-[7rem] w-1/6 whitespace-nowrap overflow-hidden overflow-ellipsis"
					>
						{operation.id}
					</p>
					<p
						class="{virtualItem.index !== operations.length - 1
							? 'border-b-2'
							: ''} border-c-bg-secondary flex-1 px-4 py-3.5 min-w-[7rem] w-1/6 whitespace-nowrap overflow-hidden overflow-ellipsis"
					>
						{operationTypeToLocaleString(operation.operation_type, $LL)}
					</p>
					<p
						class="{virtualItem.index !== operations.length - 1
							? 'border-b-2'
							: ''} border-c-bg-secondary flex-1 px-4 py-3.5 min-w-[7rem] w-1/6 whitespace-nowrap overflow-hidden overflow-ellipsis"
					>
						{costFormatter.format(operation.num_outputs)}
					</p>
					<p
						class="{virtualItem.index !== operations.length - 1
							? 'border-b-2'
							: ''} border-c-bg-secondary flex-1 px-4 py-3.5 min-w-[7rem] w-1/6 text-c-on-bg/50 whitespace-nowrap overflow-hidden overflow-ellipsis"
					>
						{getRelativeDate({ date: operation.created_at, locale: $locale })}
					</p>
					<p
						class="{virtualItem.index !== operations.length - 1
							? 'border-b-2'
							: ''} border-c-bg-secondary flex-1 px-4 py-3.5 min-w-[7rem] w-1/6 text-c-on-bg/50 whitespace-nowrap overflow-hidden overflow-ellipsis"
					>
						{durationFormatter.format(operation.duration_sec)}
					</p>
					<p
						class="{virtualItem.index !== operations.length - 1
							? 'border-b-2'
							: ''} border-c-bg-secondary flex-1 px-4 py-3.5 min-w-[7rem] w-1/6 text-c-on-bg/50 whitespace-nowrap overflow-hidden overflow-ellipsis"
					>
						{operationSourceToLocaleString(operation.source, $LL)}
					</p>
				</div>
			</div>
		{/each}
	</div>
{/if}
