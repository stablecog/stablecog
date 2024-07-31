<script lang="ts">
	import { browser } from '$app/environment';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconArrowRight from '$components/icons/IconArrowRight.svelte';
	import IconDocumentEmpty from '$components/icons/IconDocumentEmpty.svelte';
	import IconFilter from '$components/icons/IconFilter.svelte';
	import IconFlag from '$components/icons/IconFlag.svelte';
	import IconSadFace from '$components/icons/IconSadFace.svelte';
	import IconSearch from '$components/icons/IconSearch.svelte';
	import IconUndo from '$components/icons/IconUndo.svelte';
	import IconXMark from '$components/icons/IconXMark.svelte';
	import SubtleButton from '$components/primitives/buttons/SubtleButton.svelte';
	import TabLikeDropdown from '$components/primitives/tabBars/TabLikeDropdown.svelte';
	import TabLikeFilterDropdown from '$components/primitives/tabBars/TabLikeFilterDropdown.svelte';
	import TabLikeInput from '$components/primitives/tabBars/TabLikeInput.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import { PUBLIC_LOKI_HOST } from '$env/static/public';
	import {
		selectedAppAll,
		selectedAppDefault,
		selectedLayoutsDefault,
		selectedWorkerAll,
		selectedWorkerDefault,
		type TLayoutOption
	} from '$routes/(app)/admin/logs/constants.js';
	import {
		areArraysMatching,
		getLastTimestamp,
		getTimeString,
		type ReceivedMessage,
		type TLogRow
	} from '$routes/(app)/admin/logs/helpers.js';
	import { canonicalUrl } from '$ts/constants/main.js';
	import { previewImageVersion } from '$ts/constants/previewImageVersion.js';
	import type { TTab } from '$ts/types/main';
	import { onMount } from 'svelte';
	import {
		ArrayQueue,
		ConstantBackoff,
		Websocket,
		WebsocketBuilder,
		WebsocketEvent
	} from 'websocket-ts';

	export let data;

	const { isSettingsOpen, selectedLayouts, search, selectedWorker, selectedApp } = data.stores;

	const maxLogRows = 5_000;
	const initialMessageCount = 1_000;
	let ws: Websocket | undefined;
	let loadingLogRows = true;
	let logRows: TLogRow[] = [];
	let start = Date.now() * 1_000_000 - 24 * 60 * 60 * 1_000 * 1_000_000;

	let searchString: string | undefined;
	if ($search) {
		searchString = $search;
	}

	let searchTimeout: NodeJS.Timeout;
	let searchDebounceMs = 300;

	let scrollContainer: HTMLDivElement;
	const isAtTheEdgeThreshold = 8;
	let isError = false;
	let mounted = false;
	let layoutOptions: TTab<TLayoutOption>[] = [
		{
			label: 'Timestamp',
			value: 'timestamp'
		},
		{
			label: 'App Name',
			value: 'app-name'
		},
		{
			label: 'Worker Name',
			value: 'worker-name'
		}
	];
	const workerOptions = [
		{ value: selectedWorkerAll, label: 'All Workers' },
		...data.workerNames.map((workerName) => ({ value: workerName, label: workerName }))
	];
	const appOptions = [
		{ value: selectedAppAll, label: 'All Apps' },
		...data.appNames.map((appName) => ({ value: appName, label: appName }))
	];
	let isAtBottom = true;
	let isAtTop = false;
	let lastSeenItemTimestamp = 0;
	let lastTimestamp = 0;

	$: $selectedLayouts, setLayoutOptionNoneIfNeeded();

	$: [searchString], setDebouncedSearch(searchString);

	let query = `{logger="root"}`;
	$: [$search, $selectedWorker, $selectedApp], setQuery();
	$: lokiWebsocketEndpoint = `wss://${PUBLIC_LOKI_HOST}/loki/api/v1/tail?query=${query}&limit=${initialMessageCount}&start=${start}&token=${data.lokiToken}`;
	$: [lokiWebsocketEndpoint, mounted], setupWebsocket();
	$: [$search, $selectedWorker], scrollToBottom();

	$: hasQueryFilters =
		($search !== undefined && $search !== null && $search !== '') ||
		$selectedWorker !== selectedWorkerDefault ||
		$selectedApp !== selectedAppDefault;
	$: hasLayoutFilters = areArraysMatching($selectedLayouts, selectedLayoutsDefault) === false;
	$: hasFilters = hasQueryFilters || hasLayoutFilters;

	function clearFilters() {
		searchString = '';
		search.set('');
		selectedWorker.set(selectedWorkerDefault);
		selectedLayouts.set(selectedLayoutsDefault);
		selectedApp.set(selectedAppDefault);
		isSettingsOpen.set(false);
		scrollToBottom();
	}

	function setQuery() {
		query = `{logger="root"`;
		if ($selectedApp !== selectedAppAll) {
			query += `,application="${$selectedApp}"`;
		}
		if ($selectedWorker !== selectedWorkerAll) {
			query += `,worker_name="${$selectedWorker}"`;
		}
		query += `}`;
		if ($search !== '' && $search !== undefined && $search !== null) {
			const t = '`';
			query += `|~${t}(?i)${escapeRE2($search)}${t}`;
		}
	}

	function setLayoutOptionNoneIfNeeded() {
		if (!mounted) return;
		if ($selectedLayouts.length === 0) {
			selectedLayouts.set(['none']);
		}
	}

	function escapeRE2(input: string): string {
		const specialChars = /[.\\+*?()|[\]{}^$]/g;
		return input.replace(specialChars, '\\$&');
	}

	function scrollToBottom() {
		if (scrollContainer) {
			setTimeout(() => {
				scrollContainer.scrollTop = scrollContainer.scrollHeight;
				scrollContainer.scrollLeft = 0;
			});
		}
	}

	function scrollToTop() {
		if (scrollContainer) {
			setTimeout(() => {
				scrollContainer.scrollTop = 0;
				scrollContainer.scrollLeft = 0;
			});
		}
	}

	function getIsAtBottom() {
		if (scrollContainer) {
			const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
			const currentScroll = scrollContainer.scrollTop;
			return maxScroll - currentScroll < isAtTheEdgeThreshold;
		}
		return true;
	}

	function getIsAtTop() {
		if (scrollContainer) {
			const currentScroll = scrollContainer.scrollTop;
			return currentScroll < isAtTheEdgeThreshold;
		}
		return true;
	}

	function scrollContainerOnScroll() {
		isAtBottom = getIsAtBottom();
		isAtTop = getIsAtTop();
		if (isAtBottom) {
			lastSeenItemTimestamp = getLastTimestamp(logRows);
		}
	}

	function toggleSettings() {
		isSettingsOpen.set(!$isSettingsOpen);
	}

	let loadingLogRowsTimeout: NodeJS.Timeout;

	function onOpen() {
		console.log('🟢 Websocket opened');
		clearTimeout(loadingLogRowsTimeout);
		loadingLogRowsTimeout = setTimeout(() => {
			loadingLogRows = false;
		}, 10_000);
	}
	function onClose() {
		console.log('🔴 Websocket closed');
	}

	function onMessage(i: Websocket, ev: MessageEvent<string>) {
		clearTimeout(loadingLogRowsTimeout);
		loadingLogRows = false;
		const parsedResult = JSON.parse(ev.data);
		let messageAsReceived = parsedResult as ReceivedMessage;
		if (!messageAsReceived.streams || messageAsReceived.streams.length === 0) {
			console.log('Message with unknown type:', parsedResult);
			return;
		}
		let wasAtBottom = getIsAtBottom();
		let newLogRows: TLogRow[] = [];
		for (const stream of messageAsReceived.streams) {
			for (const value of stream.values) {
				newLogRows.push({
					stream: stream.stream,
					value
				});
			}
		}
		logRows =
			logRows.length + newLogRows.length > maxLogRows
				? [...logRows.slice(-initialMessageCount), ...newLogRows]
				: [...logRows, ...newLogRows];
		lastTimestamp = getLastTimestamp(logRows);
		if (wasAtBottom) {
			lastSeenItemTimestamp = lastTimestamp;
		}
		setTimeout(() => {
			if (wasAtBottom) {
				scrollToBottom();
			}
		});
	}

	async function setDebouncedSearch(searchString: string | undefined) {
		if (!browser) return;
		clearTimeout(searchTimeout);
		if (!searchString) {
			search.set('');
			return;
		}
		searchTimeout = setTimeout(async () => {
			if (searchString) {
				search.set(searchString);
			} else {
				search.set('');
			}
		}, searchDebounceMs);
	}

	async function setupWebsocket() {
		if (!browser) return;
		if (!lokiWebsocketEndpoint) return;

		loadingLogRows = true;
		logRows = [];

		ws?.removeEventListener(WebsocketEvent.open, onOpen);
		ws?.removeEventListener(WebsocketEvent.close, onClose);
		ws?.removeEventListener(WebsocketEvent.message, onMessage);
		ws?.close();

		ws = new WebsocketBuilder(lokiWebsocketEndpoint)
			.withBuffer(new ArrayQueue()) // buffer messages when disconnected
			.withBackoff(new ConstantBackoff(1000)) // retry every 1s
			.build();

		ws.addEventListener(WebsocketEvent.open, onOpen);
		ws.addEventListener(WebsocketEvent.close, onClose);
		ws.addEventListener(WebsocketEvent.message, onMessage);
	}

	onMount(() => {
		mounted = true;
		return () => {
			ws?.removeEventListener(WebsocketEvent.open, onOpen);
			ws?.removeEventListener(WebsocketEvent.close, onClose);
			ws?.removeEventListener(WebsocketEvent.message, onMessage);
			ws?.close();
		};
	});
</script>

<MetaTag
	title="Logs | Admin"
	description="Stablecog admin panel. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	image_url="{canonicalUrl}/previews/home-{previewImageVersion}.png"
/>

<div class="z-10 flex flex-1 flex-col items-center justify-start px-2 py-2 md:px-6 md:pb-6 md:pt-4">
	<div
		class="mb-3 flex w-full max-w-5xl flex-wrap items-center justify-center gap-3 {!$isSettingsOpen &&
			'hidden'}"
	>
		<TabLikeDropdown
			name="App"
			bind:value={$selectedApp}
			items={appOptions}
			class="w-full flex-auto md:flex-1"
		/>
		<TabLikeDropdown
			name="Worker"
			bind:value={$selectedWorker}
			items={workerOptions}
			class="w-full flex-auto md:flex-1"
		/>
		<TabLikeFilterDropdown
			name="Options ({$selectedLayouts.length}/{layoutOptions.length})"
			class="w-full flex-auto md:flex-1"
			items={layoutOptions}
			bind:values={$selectedLayouts}
		/>
		<TabLikeInput
			class="w-full flex-auto md:flex-1"
			bind:value={searchString}
			type="text"
			name="Search"
			placeholder="Search"
			icon={IconSearch}
		/>
	</div>
	<div class="relative flex w-full max-w-5xl flex-1 flex-col items-center justify-start">
		<div
			class="absolute left-0 top-0 flex h-full w-full flex-col overflow-hidden rounded-2xl bg-c-bg ring-2 ring-c-bg-secondary"
		>
			<div
				on:scroll={scrollContainerOnScroll}
				bind:this={scrollContainer}
				class="flex w-full flex-1 flex-col overflow-auto px-4 py-3"
			>
				{#if isError}
					<IconSadFace class="m-auto size-10 text-c-on-bg/50" />
				{:else if loadingLogRows}
					<IconAnimatedSpinner class="m-auto size-10 text-c-on-bg/50" />
				{:else if logRows.length === 0}
					<div class="m-auto flex flex-col items-center justify-center gap-2 text-c-on-bg/50">
						<IconDocumentEmpty class="size-10" />
						<p class="text-center">No matching logs</p>
					</div>
				{:else}
					<div class="flex w-full items-center justify-start pb-3 pr-20">
						<IconFlag class="mr-2 size-5 shrink-0" />
						<p
							class="min-w-0 shrink overflow-hidden overflow-ellipsis whitespace-nowrap font-semibold"
						>
							Start
						</p>
					</div>
					{#each logRows as logRow}
						<div
							class="flex w-full flex-col items-start justify-start gap-0.5 py-1 text-left font-mono text-xxs md:flex-row md:gap-0 md:py-0.75 md:text-xs"
						>
							{#if $selectedLayouts.includes('timestamp') || $selectedLayouts.includes('worker-name')}
								<p class="flex gap-4 whitespace-pre pr-4">
									{#if $selectedLayouts.includes('timestamp')}
										<span class="text-c-on-bg/50">
											{getTimeString(logRow.value[0])}
										</span>
									{/if}
									{#if $selectedLayouts.includes('app-name')}
										<span
											class="{logRow.stream.application === undefined
												? 'text-c-on-bg/25'
												: data.appNames.indexOf(logRow.stream.application) % 4 === 3
													? 'text-c-secondary/75'
													: data.appNames.indexOf(logRow.stream.application) % 4 === 2
														? 'text-c-primary/75'
														: data.appNames.indexOf(logRow.stream.application) % 4 === 1
															? 'text-c-success/75'
															: 'text-c-danger/75'} w-[9ch] overflow-hidden overflow-ellipsis"
										>
											{logRow.stream.application}
										</span>
									{/if}
									{#if $selectedLayouts.includes('worker-name')}
										<span
											class="{logRow.stream.worker_name === undefined
												? 'text-c-on-bg/25'
												: data.workerNames.indexOf(logRow.stream.worker_name) % 4 === 0
													? 'text-c-secondary/75'
													: data.workerNames.indexOf(logRow.stream.worker_name) % 4 === 1
														? 'text-c-primary/75'
														: data.workerNames.indexOf(logRow.stream.worker_name) % 4 === 2
															? 'text-c-success/75'
															: 'text-c-danger/75'} w-[9ch] overflow-hidden overflow-ellipsis"
										>
											{logRow.stream.worker_name ?? 'None'}
										</span>
									{/if}
								</p>
							{/if}
							<p class="flex w-full whitespace-pre md:whitespace-pre-wrap">
								{logRow.value[1]}
							</p>
						</div>
					{/each}
				{/if}
			</div>
			<!-- Top Buttons -->
			<div
				class="pointer-events-none absolute left-0 top-0 flex w-full transform items-center justify-end gap-2.5
				bg-gradient-to-t from-c-bg/0 from-[70%] to-c-bg p-2 transition"
			>
				<SubtleButton
					noPadding
					class="pointer-events-auto shrink-0 p-2 transition {hasFilters ? '' : '-translate-y-14'}"
					onClick={clearFilters}
				>
					<IconUndo strokeWidth={2} class="size-5" />
				</SubtleButton>
				<SubtleButton noPadding class="pointer-events-auto shrink-0 p-2" onClick={toggleSettings}>
					<div class="size-5">
						<IconFilter
							strokeWidth={2}
							class="h-full w-full transition {$isSettingsOpen
								? 'rotate-90 opacity-0'
								: 'rotate-0 opacity-100'}"
						/>
						<IconXMark
							strokeWidth={2}
							class="absolute left-0 top-0 h-full w-full transition {$isSettingsOpen
								? 'rotate-90 opacity-100'
								: 'rotate-0 opacity-0'}"
						/>
					</div>
				</SubtleButton>
			</div>
			<!-- Bottom Buttons -->
			<div
				class="pointer-events-none absolute bottom-0 left-0 flex w-full transform items-end justify-end
				gap-2.5 bg-gradient-to-b from-c-bg/0 from-[70%] to-c-bg p-2 transition {isAtBottom
					? 'translate-y-14'
					: ''}"
			>
				<SubtleButton
					noPadding
					class="pointer-events-auto p-2  {isAtTop ? 'translate-y-13' : ''}"
					onClick={scrollToTop}
				>
					<IconArrowRight strokeWidth={2} class="size-5 -rotate-90" />
				</SubtleButton>
				<div class="relative">
					<SubtleButton noPadding class="pointer-events-auto p-2" onClick={scrollToBottom}>
						<IconArrowRight strokeWidth={2} class="size-5 rotate-90" />
					</SubtleButton>
					<div
						class="pointer-events-none absolute -right-0.75 -top-0.75 size-2.5 transform rounded-full bg-c-danger transition {lastTimestamp >
						lastSeenItemTimestamp
							? 'scale-100'
							: 'scale-0'}"
					></div>
				</div>
			</div>
		</div>
	</div>
</div>
