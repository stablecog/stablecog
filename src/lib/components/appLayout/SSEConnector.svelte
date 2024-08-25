<script lang="ts">
	import { page } from '$app/stores';
	import { getApiUrl } from '$ts/constants/main';
	import { sseExcludedRoutes } from '$ts/constants/routes';
	import { generateSSEId } from '$ts/helpers/generateSSEId';
	import {
		isCreationProcessData,
		setCreationProcessStatus
	} from '$ts/helpers/user/creationProcess';
	import { serverVersion } from '$ts/stores/appVersion';
	import { queue } from '$ts/stores/user/queue';
	import { sse, sseId, type TSSEMessage } from '$ts/stores/user/sse';
	import { userSummary } from '$ts/stores/user/summary';
	import { onDestroy, onMount } from 'svelte';

	let eventSource: EventSource | null = null;
	let retryTimeout = 1000; // initial retry timeout in milliseconds
	const maxTimeout = 30000; // maximum retry timeout
	const timeoutIncreaseFactor = 2; // factor to increase the timeout
	let sseTimeout: ReturnType<typeof setTimeout> | null = null;

	function connectEventSource(): void {
		if (typeof EventSource === 'undefined') {
			console.error('EventSource not supported');
			return;
		}

		sseId.set(generateSSEId());
		const sseUrl = `${getApiUrl().origin}/v1/sse?id=${$sseId}`;
		eventSource = new EventSource(sseUrl);
		sse.set(eventSource);

		eventSource.onopen = () => {
			console.log('SSE ID:', $sseId);
			console.log('SSE URL:', sseUrl);
			retryTimeout = 1000;
		};

		eventSource.onerror = (error: Event) => {
			console.error('SSE connection error', error);
			eventSource?.close();
			eventSource = null;
			sseId.set(null);
			sse.set(null);
			if (sseTimeout) clearTimeout(sseTimeout);
			sseTimeout = setTimeout(connectEventSource, retryTimeout);
			retryTimeout = Math.min(retryTimeout * timeoutIncreaseFactor, maxTimeout);
		};

		eventSource.onmessage = (event: MessageEvent) => {
			const data = JSON.parse(event.data);
			if (data && data.message_type !== 'queue') {
				console.log('Message from SSE', data);
			}
			if (data.total_remaining_credits !== undefined && $userSummary) {
				userSummary.set({
					...$userSummary,
					total_remaining_credits: data.total_remaining_credits
				});
			}
			if (data.version) {
				serverVersion.set(data.version);
			}
			if (data.message_type === 'queue' || data.message_type === 'creation_process') {
				const d = data as TSSEMessage;
				if (d.message_type === 'queue') {
					queue.set(d.queue_items);
				} else if (isCreationProcessData(data)) {
					setCreationProcessStatus(data);
				}
			}
		};
	}

	onMount(() => {
		if (!sseExcludedRoutes.includes($page.url.pathname)) connectEventSource();
	});

	onDestroy(() => {
		if (eventSource) eventSource.close();
		if (sseTimeout) clearTimeout(sseTimeout);
	});
</script>

<slot />
