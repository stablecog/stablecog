<script lang="ts">
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import SubtleButton from '$components/primitives/buttons/SubtleButton.svelte';
	import { PUBLIC_LOKI_HOST } from '$env/static/public';
	import { onMount } from 'svelte';
	import {
		ArrayQueue,
		ConstantBackoff,
		Websocket,
		WebsocketBuilder,
		WebsocketEvent
	} from 'websocket-ts';

	const maxMessages = 3000;
	const initialMessageCount = 1000;
	let ws: Websocket | undefined;
	const lokiWebsocketEndpoint = `wss://${PUBLIC_LOKI_HOST}/loki/api/v1/tail?query={logger="root"}&limit=${initialMessageCount}`;
	let messages: ReceivedMessage[] = [];
	let scrollContainer: HTMLDivElement;
	const isAtTheBottomThreshold = 50;

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

	let isAtBottom = true;
	let lastSeenItemTimestamp = 0;
	let lastTimestamp = 0;

	function getIsAtBottom() {
		if (scrollContainer) {
			const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
			const currentScroll = scrollContainer.scrollTop;
			return maxScroll - currentScroll < isAtTheBottomThreshold;
		}
		return true;
	}

	function scrollContainerOnScroll() {
		isAtBottom = getIsAtBottom();
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

	onMount(() => {
		ws = new WebsocketBuilder(lokiWebsocketEndpoint)
			.withBuffer(new ArrayQueue()) // buffer messages when disconnected
			.withBackoff(new ConstantBackoff(1000)) // retry every 1s
			.build();

		const onMessage = (i: Websocket, ev: MessageEvent<string>) => {
			const parsedResult = JSON.parse(ev.data);
			let messageAsReceived = parsedResult as ReceivedMessage;
			if (!messageAsReceived.streams || messageAsReceived.streams.length === 0) {
				console.log('Message with unknown type:', parsedResult);
				return;
			}
			let wasAtBottom = getIsAtBottom();
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
		};

		ws.addEventListener(WebsocketEvent.open, () => console.log('opened!'));
		ws.addEventListener(WebsocketEvent.close, () => console.log('closed!'));
		ws.addEventListener(WebsocketEvent.message, onMessage);

		return () => {
			ws?.removeEventListener(WebsocketEvent.open, () => console.log('opened!'));
			ws?.removeEventListener(WebsocketEvent.close, () => console.log('closed!'));
			ws?.removeEventListener(WebsocketEvent.message, onMessage);
			ws?.close();
		};
	});
</script>

<div
	class="z-10 flex flex-1 flex-col items-center justify-start px-2 pb-6 pt-2 md:px-6 md:pb-6 md:pt-4"
>
	<div class="relative flex w-full max-w-4xl flex-1 flex-col items-center justify-start">
		<div
			class="absolute left-0 top-0 flex h-full w-full flex-col overflow-hidden rounded-lg bg-c-bg ring-2 ring-c-bg-secondary"
		>
			<div
				on:scroll={scrollContainerOnScroll}
				bind:this={scrollContainer}
				class="flex w-full flex-1 flex-col overflow-auto px-4 py-3"
			>
				{#if messages.length > 0}
					{#each messages as message}
						{#each message.streams as stream}
							{#each stream.values as value}
								<div class="flex w-full whitespace-pre text-left font-mono text-xs">
									<div class="pr-4 text-c-on-bg/50">
										{getTimeString(value[0])}
									</div>
									<div class="w-full">
										{value[1]}
									</div>
								</div>
							{/each}
						{/each}
					{/each}
				{:else}
					<IconAnimatedSpinner class="m-auto size-7 text-c-on-bg/50" />
				{/if}
			</div>
			<!-- Buttons -->
			<div
				class="pointer-events-none absolute bottom-0 right-0 flex transform items-center justify-end p-3 transition {isAtBottom
					? 'translate-y-13'
					: ''}"
			>
				<div class="relative">
					<SubtleButton noPadding class="pointer-events-auto p-1.5" onClick={scrollToBottom}>
						<IconChevronDown class="size-5" />
					</SubtleButton>
					<div
						class="pointer-events-none absolute -left-1 -top-1 size-2.5 transform rounded-full bg-c-danger transition {lastTimestamp >
						lastSeenItemTimestamp
							? 'scale-100'
							: 'scale-0'}"
					></div>
				</div>
			</div>
		</div>
	</div>
</div>
