<script lang="ts">
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconArrowRight from '$components/icons/IconArrowRight.svelte';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import IconFilter from '$components/icons/IconFilter.svelte';
	import IconSadFace from '$components/icons/IconSadFace.svelte';
	import IconSearch from '$components/icons/IconSearch.svelte';
	import IconSettings from '$components/icons/IconSettings.svelte';
	import SubtleButton from '$components/primitives/buttons/SubtleButton.svelte';
	import TabLikeDropdown from '$components/primitives/tabBars/TabLikeDropdown.svelte';
	import TabLikeFilterDropdown from '$components/primitives/tabBars/TabLikeFilterDropdown.svelte';
	import TabLikeInput from '$components/primitives/tabBars/TabLikeInput.svelte';
	import { PUBLIC_LOKI_HOST } from '$env/static/public';
	import {
		adminLogsLayout,
		adminLogsSearch,
		type TLayout
	} from '$routes/(app)/admin/logs/constants';
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

	if (data.layout) {
		adminLogsLayout.set(data.layout);
	}

	const maxMessages = 5000;
	const initialMessageCount = 1000;
	let ws: Websocket | undefined;
	const lokiWebsocketEndpoint = `wss://${PUBLIC_LOKI_HOST}/loki/api/v1/tail?query={logger="root"}&limit=${initialMessageCount}`;
	let messages: ReceivedMessage[] = [];
	let workerNames: string[] = [];
	let scrollContainer: HTMLDivElement;
	const isAtTheEdgeThreshold = 8;
	let isError = false;
	let isSettingsOpen = false;
	let layouts: TTab<TLayout>[] = [
		{
			label: 'Desktop | Logs, Time, Name',
			value: 'desktop-logs-time-name'
		},
		{
			label: 'Desktop | Logs, Time',
			value: 'desktop-logs-time'
		},
		{
			label: 'Desktop | Logs',
			value: 'desktop-logs'
		},
		{
			label: 'Mobile | Logs, Time, Name',
			value: 'mobile-logs-time-name'
		},
		{
			label: 'Mobile | Logs, Time',
			value: 'mobile-logs-time'
		},
		{
			label: 'Mobile | Logs',
			value: 'mobile-logs'
		}
	];

	let filterOptions: TTab<string>[];
	let filterValues: string[] = [];

	$: filterOptions = [
		...workerNames.map((workerName) => ({ value: workerName, label: workerName }))
	];

	$: filteredMessages =
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

	$: filteredAndSearchedMessages =
		$adminLogsSearch === '' || $adminLogsSearch === undefined || $adminLogsSearch === null
			? filteredMessages
			: filteredMessages
					.map((message) => {
						const newStreams = message.streams
							.map((stream) => {
								const newValues = stream.values.filter((value) => {
									return $adminLogsSearch === '' ||
										$adminLogsSearch === undefined ||
										$adminLogsSearch === null
										? true
										: value[1].toLowerCase().includes($adminLogsSearch.toLowerCase());
								});
								if (newValues.length === 0) {
									return null;
								}
								return { ...stream, values: newValues };
							})
							.filter((stream) => stream !== null);
						if (newStreams.length === 0) {
							return null;
						}
						return { ...message, streams: newStreams };
					})
					.filter((message) => message !== null);

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
		if (now.getTime() - date.getTime() > 24 * 60 * 60 * 1000) {
			return date.toLocaleString();
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

	function onOpen() {
		console.log('opened!');
	}
	function onClose() {
		console.log('closed!');
	}

	function onMessage(i: Websocket, ev: MessageEvent<string>) {
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

	async function setupWebsocket() {
		ws = new WebsocketBuilder(lokiWebsocketEndpoint)
			.withBuffer(new ArrayQueue()) // buffer messages when disconnected
			.withBackoff(new ConstantBackoff(1000)) // retry every 1s
			.build();

		ws.addEventListener(WebsocketEvent.open, onOpen);
		ws.addEventListener(WebsocketEvent.close, onClose);
		ws.addEventListener(WebsocketEvent.message, onMessage);
	}

	onMount(() => {
		setupWebsocket();
		scrollContainerOnScroll();
		return () => {
			ws?.removeEventListener(WebsocketEvent.open, onOpen);
			ws?.removeEventListener(WebsocketEvent.close, onClose);
			ws?.removeEventListener(WebsocketEvent.message, onMessage);
			ws?.close();
		};
	});
</script>

<div
	class="z-10 flex flex-1 flex-col items-center justify-start px-2 pb-6 pt-2 md:px-6 md:pb-6 md:pt-4"
>
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
			bind:value={$adminLogsSearch}
			type="text"
			name="Search"
			placeholder="Search"
			icon={IconSearch}
		/>
		<TabLikeDropdown
			name="Layout"
			class="w-full flex-auto md:flex-1"
			items={layouts}
			bind:value={$adminLogsLayout}
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
				{#if messages.length > 0}
					{#each filteredAndSearchedMessages as message}
						{#each message.streams as stream}
							{#each stream.values as value}
								<div
									class="flex w-full items-start justify-start py-0.75 text-left font-mono {$adminLogsLayout.includes(
										'mobile'
									)
										? `flex-col text-xxs`
										: 'text-xs'}"
								>
									{#if $adminLogsLayout.includes('time') || $adminLogsLayout.includes('name')}
										<p
											class="flex gap-4 whitespace-pre {$adminLogsLayout.includes('desktop') &&
												'pr-4'}"
										>
											{#if $adminLogsLayout.includes('time')}
												<span class="text-c-on-bg/50">
													{getTimeString(value[0])}
												</span>
											{/if}
											{#if $adminLogsLayout.includes('name')}
												<span
													class={workerNames.indexOf(stream.stream.worker_name) % 4 === 0
														? 'text-c-secondary/75'
														: workerNames.indexOf(stream.stream.worker_name) % 4 === 1
															? 'text-c-primary/75'
															: workerNames.indexOf(stream.stream.worker_name) % 4 === 2
																? 'text-c-success/75'
																: 'text-c-danger/75'}
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
					<IconArrowRight class="size-6 -rotate-90" />
				</SubtleButton>
				<div class="relative">
					<SubtleButton noPadding class="pointer-events-auto p-2" onClick={scrollToBottom}>
						<IconArrowRight class="size-6 rotate-90" />
					</SubtleButton>
					<div
						class="pointer-events-none absolute -right-0.75 -top-0.75 size-2.5 transform rounded-full bg-c-danger transition {lastTimestamp >
						lastSeenItemTimestamp
							? 'scale-100'
							: 'scale-0'}"
					></div>
				</div>
			</div>
			<!-- Top Buttons -->
			<div
				class="pointer-events-none absolute left-0 top-0 flex w-full transform items-end justify-end gap-2.5
				bg-gradient-to-t from-c-bg/0 from-[60%] to-c-bg p-2 transition {isAtTop &&
				messages.length !== 0 &&
				!isError &&
				filteredAndSearchedMessages.length !== 0
					? '-translate-y-14'
					: ''}"
			>
				<SubtleButton noPadding class="pointer-events-auto p-2" onClick={toggleSettings}>
					<div class="size-6">
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
		</div>
	</div>
</div>
