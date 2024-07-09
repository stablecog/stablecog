<script lang="ts">
	import type { CreateInfiniteQueryResult, InfiniteData } from '@tanstack/svelte-query';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import IconSadFaceOutline from '$components/icons/IconSadFaceOutline.svelte';
	import type { Readable } from 'svelte/store';
	import { createWindowVirtualizer, type SvelteVirtualizer } from '@tanstack/svelte-virtual';
	import type { TUserOperationExtended, TUserOperationsPageExtended } from '$ts/queries/operations';
	import { browser } from '$app/environment';
	import IconGraph from '$components/icons/IconGraph.svelte';
	import { getRelativeDate } from '$ts/helpers/getRelativeDate';
	import {
		operationSourceToLocaleString,
		operationTypeToLocaleString
	} from '$ts/helpers/user/operations';

	export let operationsQuery:
		| CreateInfiniteQueryResult<InfiniteData<TUserOperationsPageExtended, unknown>, Error>
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
</script>

{#if $operationsQuery?.isError}
	<div class="flex w-full flex-col items-center justify-center px-5 py-8 md:px-12">
		<IconSadFaceOutline class="h-10 w-10 text-c-on-bg/50" />
		<p class="text-c-on-surface-secondary mt-2 text-center text-c-on-bg/50">
			{$LL.Error.SomethingWentWrong()}
		</p>
	</div>
{:else if operations === undefined || $operationsQuery === undefined || $operationsQuery.data === undefined || $operationsQuery?.isInitialLoading}
	<div class="flex w-full flex-col items-center justify-center px-5 py-8 md:px-12">
		<IconAnimatedSpinner class="h-10 w-10 text-c-on-bg/50" />
		<p class="text-c-on-surface-secondary mt-2 text-center text-c-on-bg/50">
			{$LL.Shared.LoadingTitle()}
		</p>
	</div>
{:else if operations.length === 0}
	<div class="flex w-full flex-col items-center justify-center px-5 py-8 md:px-12">
		<IconGraph class="h-10 w-10 text-c-on-bg/50" />
		<p class="text-c-on-surface-secondary mt-2 text-center text-c-on-bg/50">
			{$LL.Account.Usage.NoUsageYet()}
		</p>
	</div>
{:else if browser && $listVirtualizer}
	<div class="flex w-full items-center text-sm font-semibold md:text-base">
		<p
			class="w-1/6 min-w-[7rem] flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap border-b-2 border-c-bg-secondary px-4 py-3.5"
		>
			{$LL.Account.Usage.UsageTable.ID()}
		</p>
		<p
			class="w-1/6 min-w-[7rem] flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap border-b-2 border-c-bg-secondary px-4 py-3.5"
		>
			{$LL.Account.Usage.UsageTable.Operation()}
		</p>
		<p
			class="w-1/6 min-w-[7rem] flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap border-b-2 border-c-bg-secondary px-4 py-3.5"
		>
			{$LL.Account.Usage.UsageTable.Cost()}
		</p>
		<p
			class="w-1/6 min-w-[7rem] flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap border-b-2 border-c-bg-secondary px-4 py-3.5"
		>
			{$LL.Account.APIKeys.KeyTable.CreatedAtTitle()}
		</p>
		<p
			class="w-1/6 min-w-[7rem] flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap border-b-2 border-c-bg-secondary px-4 py-3.5"
		>
			{$LL.Account.Usage.UsageTable.Duration()}
		</p>
		<p
			class="w-1/6 min-w-[7rem] flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap border-b-2 border-c-bg-secondary px-4 py-3.5"
		>
			{$LL.Account.Usage.UsageTable.Source()}
		</p>
	</div>
	<div
		style="height: {$listVirtualizer.getTotalSize()}px"
		class="relative w-full text-sm md:text-base"
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
				<div class="flex h-full items-center text-c-on-bg/75">
					<p
						class="{virtualItem.index !== operations.length - 1
							? 'border-b-2'
							: ''} w-1/6 min-w-[7rem] flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap border-c-bg-secondary px-4 py-3.5"
					>
						{operation.id}
					</p>
					<p
						class="{virtualItem.index !== operations.length - 1
							? 'border-b-2'
							: ''} w-1/6 min-w-[7rem] flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap border-c-bg-secondary px-4 py-3.5"
					>
						{operationTypeToLocaleString(operation.operation_type, $LL)}
					</p>
					<p
						class="{virtualItem.index !== operations.length - 1
							? 'border-b-2'
							: ''} w-1/6 min-w-[7rem] flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap border-c-bg-secondary px-4 py-3.5"
					>
						{costFormatter.format(operation.cost)}
					</p>
					<p
						class="{virtualItem.index !== operations.length - 1
							? 'border-b-2'
							: ''} w-1/6 min-w-[7rem] flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap border-c-bg-secondary px-4 py-3.5 text-c-on-bg/50"
					>
						{getRelativeDate({ date: operation.created_at, locale: $locale })}
					</p>
					<p
						class="{virtualItem.index !== operations.length - 1
							? 'border-b-2'
							: ''} w-1/6 min-w-[7rem] flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap border-c-bg-secondary px-4 py-3.5 text-c-on-bg/50"
					>
						{durationFormatter.format(operation.duration_sec)}
					</p>
					<p
						class="{virtualItem.index !== operations.length - 1
							? 'border-b-2'
							: ''} w-1/6 min-w-[7rem] flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap border-c-bg-secondary px-4 py-3.5 text-c-on-bg/50"
					>
						{operationSourceToLocaleString(operation.source, $LL)}
					</p>
				</div>
			</div>
		{/each}
	</div>
{/if}
