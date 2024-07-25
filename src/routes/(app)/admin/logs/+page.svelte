<script lang="ts">
	import { browser } from '$app/environment';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconArrowRight from '$components/icons/IconArrowRight.svelte';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import IconFilter from '$components/icons/IconFilter.svelte';
	import IconPreferences from '$components/icons/IconPreferences.svelte';
	import IconSadFace from '$components/icons/IconSadFace.svelte';
	import IconSearch from '$components/icons/IconSearch.svelte';
	import IconSettings from '$components/icons/IconSettings.svelte';
	import SubtleButton from '$components/primitives/buttons/SubtleButton.svelte';
	import TabLikeFilterDropdown from '$components/primitives/tabBars/TabLikeFilterDropdown.svelte';
	import TabLikeInput from '$components/primitives/tabBars/TabLikeInput.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import { PUBLIC_LOKI_HOST } from '$env/static/public';
	import {
		adminLogsLayoutOptions,
		adminLogsSearch,
		type TLayoutOption
	} from '$routes/(app)/admin/logs/constants';
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

	const maxMessages = 5000;
	const initialMessageCount = 1000;
	let ws: Websocket | undefined;
	let loadingMessages = true;
	let messages: ReceivedMessage[] = [];
	let workerNames: string[] = [];
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

	let filterOptions: TTab<string>[];
	let filterValues: string[] = [];
	let filteredMessages: ReceivedMessage[] = [];

	$: filterOptions = [
		...workerNames.map((workerName) => ({ value: workerName, label: workerName }))
	];
	$: $adminLogsLayoutOptions, setLayoutOptionNoneIfNeeded();

	$: [searchString], setDebouncedSearch(searchString);
	$: query =
		$adminLogsSearch !== '' && $adminLogsSearch !== undefined && $adminLogsSearch !== null
			? `{logger="root"}|~"(?i)${$adminLogsSearch}"`
			: `{logger="root"}`;
	$: lokiWebsocketEndpoint = `wss://${PUBLIC_LOKI_HOST}/loki/api/v1/tail?query=${query}&limit=${initialMessageCount}&start=${start}&token=${data.lokiToken}`;
	$: [lokiWebsocketEndpoint, mounted], setupWebsocket();
	$: [messages, $adminLogsLayoutOptions], setFilteredMessages();

	function setFilteredMessages() {
		filteredMessages =
			filterValues.length === 0 ||
			arrayIncludesAll(
				filterValues,
				filterOptions.map((option) => option.value)
			)
				? messages
				: messages
						.map((message) => {
							const filteredStreams = message.streams.filter((stream) => {
								return filterValues.includes(stream.stream.worker_name);
							});
							if (filteredStreams.length === 0) {
								return null;
							}
							return { ...message, streams: filteredStreams };
						})
						.filter((message) => message !== null);
		setTimeout(() => {
			scrollContainerOnScroll();
		});
	}

	function setLayoutOptionNoneIfNeeded() {
		if (!mounted) return;
		if ($adminLogsLayoutOptions.length === 0) {
			adminLogsLayoutOptions.set(['none']);
		}
	}

	function scrollToBottom() {
		if (scrollContainer) {
			scrollContainer.scrollTop = scrollContainer.scrollHeight;
			scrollContainer.scrollLeft = 0;
		}
	}

	function scrollToTop() {
		if (scrollContainer) {
			scrollContainer.scrollTop = 0;
			scrollContainer.scrollLeft = 0;
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
			lastSeenItemTimestamp = getLastTimestamp(messages);
		}
	}

	function getTimeString(val: string) {
		const date = new Date(Number(val) / 1000000);
		// if date is more than 24 hour ago, show date and time
		const now = new Date();
		const timeString =
			date.toLocaleTimeString(undefined, { hour12: false }) +
			'.' +
			date.getMilliseconds().toString().slice(0, 2).padEnd(2, '0');
		if (now.getTime() - date.getTime() > 24 * 60 * 60 * 1000) {
			return date.toLocaleDateString() + ' ' + timeString;
		}
		return (
			date.toLocaleTimeString(undefined, { hour12: false }) +
			'.' +
			date.getMilliseconds().toString().slice(0, 2).padEnd(2, '0')
		);
	}

	function getLastTimestamp(messages: ReceivedMessage[]) {
		if (messages.length === 0) {
			return 0;
		}
		const streams = messages[messages.length - 1].streams;
		const values = streams[streams.length - 1].values;
		const lastValue = values[values.length - 1];
		return Number(lastValue[0]);
	}

	function arrayIncludesAll<T>(array: T[], subset: T[]): boolean {
		return subset.every((element) => array.includes(element));
	}

	function toggleSettings() {
		isSettingsOpen = !isSettingsOpen;
	}

	let loadingMessagesTimeout: NodeJS.Timeout;

	function onOpen() {
		console.log('🟢 Websocket opened');
		clearTimeout(loadingMessagesTimeout);
		loadingMessagesTimeout = setTimeout(() => {
			loadingMessages = false;
		}, 1000);
	}
	function onClose() {
		console.log('🔴 Websocket closed');
	}

	function onMessage(i: Websocket, ev: MessageEvent<string>) {
		clearTimeout(loadingMessagesTimeout);
		loadingMessages = false;
		const parsedResult = JSON.parse(ev.data);
		let messageAsReceived = parsedResult as ReceivedMessage;
		if (!messageAsReceived.streams || messageAsReceived.streams.length === 0) {
			console.log('Message with unknown type:', parsedResult);
			return;
		}
		let wasAtBottom = getIsAtBottom();
		for (let i = 0; i < messageAsReceived.streams.length; i++) {
			const stream = messageAsReceived.streams[i];
			if (!workerNames.includes(stream.stream.worker_name)) {
				workerNames = [...workerNames, stream.stream.worker_name];
			}
		}
		messages = [...messages, messageAsReceived].slice(-maxMessages);
		lastTimestamp = getLastTimestamp(messages);
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

		loadingMessages = true;
		messages = [];

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

	type Stream = {
		logger: string;
		severity: string;
		worker_name: string;
		application: string;
	};

	type Value = [string, string];

	type ReceivedMessage = {
		streams: {
			stream: Stream;
			values: Value[];
		}[];
	};

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
		<TabLikeFilterDropdown
			nameIcon={IconFilter}
			name="Filter Workers"
			bind:values={filterValues}
			items={filterOptions}
			class="w-full flex-auto md:flex-1"
		/>
		<TabLikeInput
			class="w-full flex-auto md:flex-1"
			bind:value={searchString}
			type="text"
			name="Search"
			placeholder="Search"
			icon={IconSearch}
		/>
		<TabLikeFilterDropdown
			nameIcon={IconPreferences}
			name="Options"
			class="w-full flex-auto md:flex-1"
			items={layoutOptions}
			bind:values={$adminLogsLayoutOptions}
		/>
	</div>
	<div class="relative flex w-full max-w-4xl flex-1 flex-col items-center justify-start">
		<div
			class="absolute left-0 top-0 flex h-full w-full flex-col overflow-hidden rounded-2xl bg-c-bg ring-2 ring-c-bg-secondary"
		>
			<div
				on:scroll={scrollContainerOnScroll}
				bind:this={scrollContainer}
				class="flex w-full flex-1 flex-col overflow-auto px-4 pb-3 pt-12"
			>
				{#if !loadingMessages}
					{#each filteredMessages as message}
						{#each message.streams as stream}
							{#each stream.values as value}
								<div
									class="flex w-full flex-col items-start justify-start gap-0.5 py-1 text-left font-mono text-xxs md:flex-row md:gap-0 md:py-0.75 md:text-xs"
								>
									{#if $adminLogsLayoutOptions.includes('timestamp') || $adminLogsLayoutOptions.includes('worker-name')}
										<p class="flex gap-4 whitespace-pre pr-4">
											{#if $adminLogsLayoutOptions.includes('timestamp')}
												<span class="text-c-on-bg/50">
													{getTimeString(value[0])}
												</span>
											{/if}
											{#if $adminLogsLayoutOptions.includes('worker-name')}
												<span
													class="{workerNames.indexOf(stream.stream.worker_name) % 4 === 0
														? 'text-c-secondary/75'
														: workerNames.indexOf(stream.stream.worker_name) % 4 === 1
															? 'text-c-primary/75'
															: workerNames.indexOf(stream.stream.worker_name) % 4 === 2
																? 'text-c-success/75'
																: 'text-c-danger/75'} md:w-[8ch] md:overflow-hidden md:overflow-ellipsis"
												>
													{stream.stream.worker_name}
												</span>
											{/if}
										</p>
									{/if}
									<p class="flex w-full whitespace-pre">
										{value[1]}
									</p>
								</div>
							{/each}
						{/each}
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
				class="pointer-events-none absolute left-0 top-0 flex w-full transform items-center justify-between gap-2.5
				bg-gradient-to-t from-c-bg/0 from-[60%] to-c-bg p-2 transition"
			>
				<p
					class="{isAtTop && messages.length !== 0 && !isError && filteredMessages.length !== 0
						? 'translate-y-0 opacity-100'
						: '-translate-y-8 opacity-0'} shrink overflow-hidden overflow-ellipsis whitespace-nowrap px-2 font-semibold transition duration-150"
				>
					Start of logs
				</p>
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
				gap-2.5 bg-gradient-to-b from-c-bg/0 from-[60%] to-c-bg p-2 transition {isAtBottom
					? 'translate-y-14'
					: ''}"
			>
				<SubtleButton
					noPadding
					class="pointer-events-auto p-2  {isAtTop ? 'translate-y-13' : ''}"
					onClick={scrollToTop}
				>
					<IconArrowRight class="size-5 -rotate-90" />
				</SubtleButton>
				<div class="relative">
					<SubtleButton noPadding class="pointer-events-auto p-2" onClick={scrollToBottom}>
						<IconArrowRight class="size-5 rotate-90" />
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
