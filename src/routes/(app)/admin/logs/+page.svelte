<script lang="ts">
	import { browser } from '$app/environment';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconArrowRight from '$components/icons/IconArrowRight.svelte';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import IconDocument from '$components/icons/IconDocument.svelte';
	import IconFlag from '$components/icons/IconFlag.svelte';
	import IconSadFace from '$components/icons/IconSadFace.svelte';
	import IconSearch from '$components/icons/IconSearch.svelte';
	import IconSettings from '$components/icons/IconSettings.svelte';
	import SubtleButton from '$components/primitives/buttons/SubtleButton.svelte';
	import TabLikeDropdown from '$components/primitives/tabBars/TabLikeDropdown.svelte';
	import TabLikeFilterDropdown from '$components/primitives/tabBars/TabLikeFilterDropdown.svelte';
	import TabLikeInput from '$components/primitives/tabBars/TabLikeInput.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import { PUBLIC_LOKI_HOST } from '$env/static/public';
	import {
		adminLogsLayoutOptions,
		adminLogsSearch,
		adminLogsSelectedWorker,
		type TLayoutOption
	} from '$routes/(app)/admin/logs/constants';
	import {
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

	if (data.search) {
		adminLogsSearch.set(data.search);
	}

	if (data.layoutOptions) {
		adminLogsLayoutOptions.set(data.layoutOptions);
	}

	if (data.workerName) {
		adminLogsSelectedWorker.set(data.workerName);
	}

	const maxLogRows = 5000;
	const initialMessageCount = 1000;
	let ws: Websocket | undefined;
	let loadingLogRows = true;
	let logRows: TLogRow[] = [];
	let start = Date.now() * 1_000_000 - 24 * 60 * 60 * 1_000 * 1_000_000;

	let searchString: string | undefined;
	let searchTimeout: NodeJS.Timeout;
	let searchDebounceMs = 300;

	let scrollContainer: HTMLDivElement;
	const isAtTheEdgeThreshold = 8;
	let isError = false;
	let isSettingsOpen = false;
	let mounted = false;
	let layoutOptions: TTab<TLayoutOption>[] = [
		{
			label: 'Timestamp',
			value: 'timestamp'
		},
		{
			label: 'Worker Name',
			value: 'worker-name'
		}
	];

	const workerOptions = [
		{ value: 'all-workers', label: 'All Workers' },
		...data.workerNames.map((workerName) => ({ value: workerName, label: workerName }))
	];
	$: $adminLogsLayoutOptions, setLayoutOptionNoneIfNeeded();

	$: [searchString], setDebouncedSearch(searchString);

	let query = `{logger="root"}`;
	$: [$adminLogsSearch, $adminLogsSelectedWorker], setQuery();
	$: lokiWebsocketEndpoint = `wss://${PUBLIC_LOKI_HOST}/loki/api/v1/tail?query=${query}&limit=${initialMessageCount}&start=${start}&token=${data.lokiToken}`;
	$: [lokiWebsocketEndpoint, mounted], setupWebsocket();
	$: [$adminLogsSearch, $adminLogsSelectedWorker], scrollToBottom();

	function setQuery() {
		query = `{logger="root"`;
		if ($adminLogsSelectedWorker !== 'all-workers') {
			query += `,worker_name="${$adminLogsSelectedWorker}"`;
		}
		query += `}`;
		if ($adminLogsSearch !== '' && $adminLogsSearch !== undefined && $adminLogsSearch !== null) {
			query += `|~"(?i)${$adminLogsSearch}"`;
		}
	}
	function setLayoutOptionNoneIfNeeded() {
		if (!mounted) return;
		if ($adminLogsLayoutOptions.length === 0) {
			adminLogsLayoutOptions.set(['none']);
		}
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

	let isAtBottom = true;
	let isAtTop = false;
	let lastSeenItemTimestamp = 0;
	let lastTimestamp = 0;

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
		isSettingsOpen = !isSettingsOpen;
	}

	let loadingLogRowsTimeout: NodeJS.Timeout;

	function onOpen() {
		console.log('🟢 Websocket opened');
		clearTimeout(loadingLogRowsTimeout);
		loadingLogRowsTimeout = setTimeout(() => {
			loadingLogRows = false;
		}, 1000);
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
			adminLogsSearch.set('');
			return;
		}
		searchTimeout = setTimeout(async () => {
			if (searchString) {
				adminLogsSearch.set(searchString);
			} else {
				adminLogsSearch.set('');
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
		class="mb-3 flex w-full max-w-4xl flex-wrap items-center justify-center gap-3 {!isSettingsOpen &&
			'hidden'}"
	>
		<TabLikeDropdown
			name="Worker"
			bind:value={$adminLogsSelectedWorker}
			items={workerOptions}
			class="w-full flex-auto md:flex-1"
		/>
		<TabLikeFilterDropdown
			name="Options"
			class="w-full flex-auto md:flex-1"
			items={layoutOptions}
			bind:values={$adminLogsLayoutOptions}
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
	<div class="relative flex w-full max-w-4xl flex-1 flex-col items-center justify-start">
		<div
			class="absolute left-0 top-0 flex h-full w-full flex-col overflow-hidden rounded-2xl bg-c-bg ring-2 ring-c-bg-secondary"
		>
			<div
				on:scroll={scrollContainerOnScroll}
				bind:this={scrollContainer}
				class="flex w-full flex-1 flex-col overflow-auto px-4 py-3"
			>
				<div class="flex w-full items-center justify-start pb-3 pr-16">
					<IconFlag class="mr-2 size-5 shrink-0" />
					<p
						class="min-w-0 shrink overflow-hidden overflow-ellipsis whitespace-nowrap font-semibold"
					>
						Start
					</p>
				</div>
				{#if !loadingLogRows}
					{#each logRows as logRow}
						<div
							class="flex w-full flex-col items-start justify-start gap-0.5 py-1 text-left font-mono text-xxs md:flex-row md:gap-0 md:py-0.75 md:text-xs"
						>
							{#if $adminLogsLayoutOptions.includes('timestamp') || $adminLogsLayoutOptions.includes('worker-name')}
								<p class="flex gap-4 whitespace-pre pr-4">
									{#if $adminLogsLayoutOptions.includes('timestamp')}
										<span class="text-c-on-bg/50">
											{getTimeString(logRow.value[0])}
										</span>
									{/if}
									{#if $adminLogsLayoutOptions.includes('worker-name')}
										<span
											class="{data.workerNames.indexOf(logRow.stream.worker_name) % 4 === 0
												? 'text-c-secondary/75'
												: data.workerNames.indexOf(logRow.stream.worker_name) % 4 === 1
													? 'text-c-primary/75'
													: data.workerNames.indexOf(logRow.stream.worker_name) % 4 === 2
														? 'text-c-success/75'
														: 'text-c-danger/75'} md:w-[8ch] md:overflow-hidden md:overflow-ellipsis"
										>
											{logRow.stream.worker_name}
										</span>
									{/if}
								</p>
							{/if}
							<p class="flex w-full whitespace-pre">
								{logRow.value[1]}
							</p>
						</div>
					{:else}
						<p class="m-auto text-c-on-bg/50">No matching logs.</p>
					{/each}
				{:else if isError}
					<IconSadFace class="m-auto size-10 text-c-on-bg/50" />
				{:else}
					<IconAnimatedSpinner class="m-auto size-10 text-c-on-bg/50" />
				{/if}
			</div>
			<!-- Top Buttons -->
			<div
				class="pointer-events-none absolute left-0 top-0 flex w-full transform items-center justify-end gap-2.5
				bg-gradient-to-t from-c-bg/0 from-[70%] to-c-bg p-2 transition"
			>
				<SubtleButton noPadding class="pointer-events-auto shrink-0 p-2" onClick={toggleSettings}>
					<div class="size-5">
						<IconSettings
							class="h-full w-full transition {isSettingsOpen
								? 'rotate-90 opacity-0'
								: 'rotate-0 opacity-100'}"
						/>
						<IconCancel
							class="absolute left-0 top-0 h-full w-full transition {isSettingsOpen
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
