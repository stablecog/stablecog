<script lang="ts">
	import { browser } from '$app/environment';
	import CopyButton from '$components/docs/CopyButton.svelte';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconApp from '$components/icons/IconApp.svelte';
	import IconArrowRight from '$components/icons/IconArrowRight.svelte';
	import IconDocumentEmpty from '$components/icons/IconDocumentEmpty.svelte';
	import IconFlag from '$components/icons/IconFlag.svelte';
	import IconPreferences from '$components/icons/IconPreferences.svelte';
	import IconSadFace from '$components/icons/IconSadFace.svelte';
	import IconSearch from '$components/icons/IconSearch.svelte';
	import IconServerOutline from '$components/icons/IconServerOutline.svelte';
	import IconSettingsOutline from '$components/icons/IconSettingsOutline.svelte';
	import IconUndo from '$components/icons/IconUndo.svelte';
	import IconXMark from '$components/icons/IconXMark.svelte';
	import SubtleButton from '$components/primitives/buttons/SubtleButton.svelte';
	import TabLikeFilterDropdown from '$components/primitives/tabBars/TabLikeFilterDropdown.svelte';
	import TabLikeInput from '$components/primitives/tabBars/TabLikeInput.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import { env } from '$env/dynamic/public';
	import {
		selectedAppsDefault,
		selectedLayoutsDefault,
		selectedWorkersDefault,
		type TLayoutOption
	} from '$routes/(app)/admin/logs/constants.js';
	import {
		areArraysMatching,
		getLastTimestamp,
		getTimeString,
		type ReceivedMessage,
		type TLogRow
	} from '$routes/(app)/admin/logs/helpers.js';
	import { canonicalUrlObject, staticAssetBaseUrl } from '$ts/constants/main.js';
	import { previewImageVersion } from '$ts/constants/previewImageVersion.js';
	import { throttle } from '$ts/helpers/general/throttle.js';
	import type { TTab } from '$ts/types/main';
	import { onMount } from 'svelte';
	import { VList } from 'virtua/svelte';
	import {
		ArrayQueue,
		ConstantBackoff,
		Websocket,
		WebsocketBuilder,
		WebsocketEvent
	} from 'websocket-ts';

	export let data;

	const { isSettingsOpen, selectedLayouts, search, selectedWorkers, selectedApps } = data.stores;

	const initialMessageCount = 1_000;
	const start = (Date.now() - 1_000 * 60 * 60 * 24) * 1_000_000;
	let ws: Websocket | undefined;
	let loadingLogRows = true;
	let logRows: TLogRow[] = [];
	let followLogs = true;

	let searchString: string | undefined;
	if ($search) {
		searchString = $search;
	}

	let searchTimeout: NodeJS.Timeout;
	let searchDebounceMs = 300;

	let scrollContainer: VList<TLogRow>;
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
		...data.workerNames.map((workerName) => ({ value: workerName, label: workerName }))
	];
	const appOptions = [...data.appNames.map((appName) => ({ value: appName, label: appName }))];
	let isAtBottom = true;
	let isAtTop = false;
	let lastSeenItemTimestamp = 0;
	let lastTimestamp = 0;

	$: $selectedLayouts, setLayoutOptionNoneIfNeeded();
	$: filteredSelectedLayouts = $selectedLayouts.filter((o) => o !== 'none');
	$: $selectedApps, onSelectedAppsChanged();
	$: filteredSelectedApps = $selectedApps.filter((o) => o !== 'all');

	$: [searchString], setDebouncedSearch(searchString);

	let query = `{logger="root"}`;
	$: [$search, $selectedWorkers, $selectedApps], setQuery();
	$: lokiWebsocketEndpoint = `wss://${env.PUBLIC_LOKI_HOST}/loki/api/v1/tail?query=${query}&limit=${initialMessageCount}&start=${start}&token=${data.lokiToken}`;
	$: [lokiWebsocketEndpoint, mounted], setupWebsocket();
	$: [$search, $selectedWorkers], scrollToBottom();

	$: hasQueryFilters =
		($search !== undefined && $search !== null && $search !== '') ||
		!areArraysMatching($selectedWorkers, selectedWorkersDefault) ||
		!areArraysMatching($selectedApps, selectedAppsDefault);
	$: hasLayoutFilters = areArraysMatching($selectedLayouts, selectedLayoutsDefault) === false;
	$: hasFilters = hasQueryFilters || hasLayoutFilters;

	function onSelectedAppsChanged() {
		setAppOptionAllIfNeeded();
		followLogs = true;
	}

	function clearFilters() {
		searchString = '';
		search.set('');
		selectedWorkers.set(selectedWorkersDefault);
		selectedLayouts.set(selectedLayoutsDefault);
		selectedApps.set(selectedAppsDefault);
		isSettingsOpen.set(false);
		scrollToBottom();
	}

	function setQuery() {
		query = `{logger="root"`;
		if (filteredSelectedApps.length > 0 && filteredSelectedApps.length < appOptions.length) {
			query += `,application=~"${filteredSelectedApps.join('|')}"`;
		}
		if ($selectedWorkers.length > 0 && $selectedWorkers.length < workerOptions.length) {
			query += `,worker_name=~"${$selectedWorkers.join('|')}"`;
		}
		query += `}`;
		if ($search !== '' && $search !== undefined && $search !== null) {
			const t = '`';
			query += `|~${t}(?i)${escapeRE2($search)}${t}`;
		}
	}

	function setAppOptionAllIfNeeded() {
		if (!mounted) return;
		if ($selectedApps.length === 0) {
			selectedApps.set(['all']);
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
		setTimeout(() => {
			followLogs = true;
			isAtBottom = true;
			isAtTop = false;
			if (scrollContainer) {
				scrollContainer.scrollToIndex(logRows.length - 1);
			}
		});
	}

	function scrollToTop() {
		setTimeout(() => {
			followLogs = false;
			isAtTop = true;
			isAtBottom = false;
			if (scrollContainer) {
				scrollContainer.scrollToIndex(0);
			}
		});
	}

	function getIsAtBottom() {
		if (scrollContainer) {
			const maxScroll = scrollContainer.getScrollSize() - scrollContainer.getViewportSize();
			const currentScroll = scrollContainer.getScrollOffset();
			return maxScroll - currentScroll < isAtTheEdgeThreshold;
		}
		return true;
	}

	function getIsAtTop() {
		if (scrollContainer) {
			const currentScroll = scrollContainer.getScrollOffset();
			return currentScroll < isAtTheEdgeThreshold;
		}
		return true;
	}

	function scrollContainerOnScroll() {
		isAtBottom = getIsAtBottom();
		isAtTop = getIsAtTop();
		if (isAtBottom) {
			followLogs = true;
			lastSeenItemTimestamp = getLastTimestamp(logRows);
		} else {
			followLogs = false;
		}
	}

	const throttledScrollContainerOnScroll = throttle(scrollContainerOnScroll, 20);

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
		let newLogRows: TLogRow[] = [];
		for (const stream of messageAsReceived.streams) {
			for (const value of stream.values) {
				newLogRows.push({
					stream: stream.stream,
					value
				});
			}
		}
		logRows = [...logRows, ...newLogRows];
		lastTimestamp = getLastTimestamp(logRows);
		if (followLogs) {
			lastSeenItemTimestamp = lastTimestamp;
		}
		setTimeout(() => {
			if (followLogs) {
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

	function colorize(logString: string) {
		// Define the array of hostnames for which URLs should be made relative in the visible text
		const relativeHostnames = [canonicalUrlObject.hostname];

		// Create a new DOMParser instance
		const parser = new DOMParser();

		// Parse the string into an HTML document
		const doc = parser.parseFromString(`<span>${logString}</span>`, 'text/html');

		// Use querySelectorAll to find and replace millisecond values
		const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null);

		while (walker.nextNode()) {
			const textNode = walker.currentNode;

			if (textNode && textNode.textContent) {
				const msRegex = /\b\d+(\.\d+)?\s*m\s*s\b/g;
				const errorRegex = /\[ERRO\]/g;
				const infoRegex = /\[INFO\]/g;
				const dashRegex = /-{3,}/g; // Matches strings of 3 or more dashes
				const pipeRegex = /\s\|+\s/g;
				const bigDotRegex = /•{1,}/g; // Matches big dots
				const urlRegex = /\b(?:https?:\/\/)?(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?/g;

				let htmlContent = textNode.textContent;

				// Replace big dots with a span containing the same value
				if (bigDotRegex.test(htmlContent)) {
					htmlContent = htmlContent.replace(bigDotRegex, (match) => {
						return `<span class="text-c-on-bg/50">${match}</span>`;
					});
				}

				// Replace | characters surrounded by spaces with a span containing the same value
				if (pipeRegex.test(htmlContent)) {
					htmlContent = htmlContent.replace(pipeRegex, (match) => {
						return `<span class="text-c-on-bg/50">${match}</span>`;
					});
				}

				// Replace strings of dashes with a span containing the same value
				if (dashRegex.test(htmlContent)) {
					htmlContent = htmlContent.replace(dashRegex, (match) => {
						return `<span class="text-c-on-bg/50">${match}</span>`;
					});
				}

				// Replace millisecond values with a span containing the same value
				if (msRegex.test(htmlContent)) {
					htmlContent = htmlContent.replace(msRegex, (match) => {
						return `<span class="text-c-success">${match}</span>`;
					});
				}

				// Replace [ERRO] with a span containing the same value
				if (errorRegex.test(htmlContent)) {
					htmlContent = htmlContent.replace(errorRegex, (match) => {
						return `<span class="text-c-danger">${match}</span>`;
					});
				}

				// Replace [INFO] with a span containing the same value
				if (infoRegex.test(htmlContent)) {
					htmlContent = htmlContent.replace(infoRegex, (match) => {
						return `<span class="text-c-on-bg/50">${match}</span>`;
					});
				}

				// Replace URLs with <a> tags linking to the URLs
				if (urlRegex.test(htmlContent)) {
					htmlContent = htmlContent.replace(urlRegex, (match) => {
						let url = match.startsWith('http') ? match : `https://${match}`;
						let displayText = match;
						try {
							const urlObj = new URL(url);
							if (relativeHostnames.includes(urlObj.hostname)) {
								displayText = urlObj.pathname + urlObj.search + urlObj.hash;
								displayText =
									`<span class='text-c-on-bg/50'>${urlObj.hostname}</span>` + displayText;
							}
						} catch (e) {
							console.log('Error parsing URL:', e);
						}
						return `<a class='hover:underline text-c-on-bg' href="${url}" target="_blank" rel="noopener noreferrer">${displayText}</a>`;
					});
				}

				// If any replacements were made, replace the current text node with a new HTML structure
				if (htmlContent !== textNode.textContent) {
					const tempDiv = document.createElement('span');
					tempDiv.innerHTML = htmlContent;

					while (tempDiv.firstChild) {
						textNode?.parentNode?.insertBefore(tempDiv.firstChild, textNode);
					}

					// @ts-ignore
					textNode.remove();
				}
			}
		}
		return doc.body.innerHTML;
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
	description="Stablecog admin panel. Free, multilingual and open-source AI image generator using Stable Diffusion, FLUX, and Kandinsky."
	image_url="{staticAssetBaseUrl}/previews/home-{previewImageVersion}.png"
/>

<div
	class="z-10 flex flex-1 flex-col items-center justify-start px-2 py-2 md:px-5 md:pb-6 md:pt-4 lg:flex-row lg:items-stretch lg:justify-center"
>
	<!-- Filter options -->
	<div
		class="mb-3 flex w-full max-w-4xl flex-wrap items-center justify-center gap-3 lg:w-60 lg:flex-shrink-0 lg:flex-col lg:justify-start lg:pr-3 {!$isSettingsOpen &&
			'hidden lg:flex'}"
	>
		<TabLikeFilterDropdown
			nameIcon={IconApp}
			name="Apps"
			nameTaglineClass="text-c-on-bg/50 w-full font-normal text-sm transition not-touch:group-hover:text-c-primary pl-[0.5ch]"
			nameTagline="({filteredSelectedApps.length}/{appOptions.length})"
			bind:values={$selectedApps}
			items={appOptions}
			class="w-full flex-auto md:flex-1 lg:flex-none"
		/>
		<TabLikeFilterDropdown
			nameIcon={IconServerOutline}
			name="Workers"
			nameTaglineClass="text-c-on-bg/50 w-full font-normal text-sm transition not-touch:group-hover:text-c-primary pl-[0.5ch]"
			nameTagline="({$selectedWorkers.length}/{workerOptions.length})"
			bind:values={$selectedWorkers}
			items={workerOptions}
			class="w-full flex-auto md:flex-1 lg:flex-none"
		/>
		<TabLikeFilterDropdown
			nameIcon={IconPreferences}
			name="Layout"
			nameTaglineClass="text-c-on-bg/50 w-full font-normal text-sm transition not-touch:group-hover:text-c-primary pl-[0.5ch]"
			nameTagline="({filteredSelectedLayouts.length}/{layoutOptions.length})"
			class="w-full flex-auto md:flex-1 lg:flex-none"
			items={layoutOptions}
			bind:values={$selectedLayouts}
		/>
		<TabLikeInput
			class="w-full flex-auto md:flex-1 lg:flex-none"
			bind:value={searchString}
			type="text"
			name="Search"
			placeholder="Search"
			icon={IconSearch}
		/>
	</div>
	<!-- Log container -->
	<div class="relative flex w-full max-w-4xl flex-grow flex-col items-center justify-start">
		<div
			class="absolute left-0 top-0 flex h-full w-full flex-col overflow-hidden rounded-2xl bg-c-bg ring-2 ring-c-bg-secondary"
		>
			<div
				on:wheel={throttledScrollContainerOnScroll}
				on:touchstart={throttledScrollContainerOnScroll}
				on:touchmove={throttledScrollContainerOnScroll}
				on:touchend={throttledScrollContainerOnScroll}
				class="flex w-full flex-1 flex-col overflow-hidden"
			>
				{#if isError}
					<div class="m-auto flex items-center justify-center px-4 py-3">
						<IconSadFace class="m-auto size-10 text-c-on-bg/50" />
					</div>
				{:else if loadingLogRows}
					<div class="m-auto flex items-center justify-center px-4 py-3">
						<IconAnimatedSpinner class="m-auto size-10 text-c-on-bg/50" />
					</div>
				{:else if logRows.length === 0}
					<div
						class="m-auto flex flex-col items-center justify-center gap-2 px-4 py-3 text-c-on-bg/50"
					>
						<IconDocumentEmpty class="size-10" />
						<p class="text-center">No matching logs</p>
					</div>
				{:else}
					<VList
						bind:this={scrollContainer}
						data={logRows}
						let:item
						let:index
						getKey={(d) => d.value[0]}
						class="flex flex-col items-start justify-start py-3"
					>
						{#if index === 0}
							<div class="flex flex-row">
								<div class="flex w-full items-center justify-start px-4 pb-3 pr-20">
									<IconFlag class="mr-2 size-5 shrink-0" />
									<p
										class="min-w-0 shrink overflow-hidden overflow-ellipsis whitespace-nowrap font-semibold"
									>
										Start
									</p>
								</div>
							</div>
						{/if}
						<div class="group/line relative flex flex-row hover:z-10 hover:bg-c-bg-secondary">
							<div
								class="flex flex-col items-start justify-start gap-0.5 px-4 py-1 text-left font-mono text-xxs md:flex-row md:gap-0 md:py-0.75 md:text-xs"
							>
								{#if $selectedLayouts.includes('timestamp') || $selectedLayouts.includes('worker-name') || $selectedLayouts.includes('app-name')}
									<p class="flex gap-4 whitespace-pre pr-4">
										{#if $selectedLayouts.includes('timestamp')}
											<span class="text-c-on-bg/50">
												{getTimeString(item.value[0])}
											</span>
										{/if}
										{#if $selectedLayouts.includes('app-name')}
											<span
												class="{item.stream.application === undefined
													? 'text-c-on-bg/25'
													: data.appNames.indexOf(item.stream.application) % 4 === 3
														? 'text-c-secondary/75'
														: data.appNames.indexOf(item.stream.application) % 4 === 2
															? 'text-c-primary/75'
															: data.appNames.indexOf(item.stream.application) % 4 === 1
																? 'text-c-success/75'
																: 'text-c-danger/75'} w-[9ch] overflow-hidden overflow-ellipsis"
											>
												{item.stream.application}
											</span>
										{/if}
										{#if $selectedLayouts.includes('worker-name')}
											<span
												class="{item.stream.worker_name === undefined
													? 'text-c-on-bg/25'
													: data.workerNames.indexOf(item.stream.worker_name) % 4 === 0
														? 'text-c-secondary/75'
														: data.workerNames.indexOf(item.stream.worker_name) % 4 === 1
															? 'text-c-primary/75'
															: data.workerNames.indexOf(item.stream.worker_name) % 4 === 2
																? 'text-c-success/75'
																: 'text-c-danger/75'} w-[9ch] overflow-hidden overflow-ellipsis"
											>
												{item.stream.worker_name ?? 'None'}
											</span>
										{/if}
									</p>
								{/if}
								<p class="flex w-full whitespace-pre md:whitespace-pre-wrap">
									{@html colorize(item.value[1])}
								</p>
							</div>
							<!-- Copy button -->
							<CopyButton
								internalState={true}
								onCopied={() => null}
								class="group absolute right-0 top-0 flex items-stretch justify-center self-stretch rounded-bl-lg bg-c-bg-secondary p-0.25 opacity-0 group-hover/line:opacity-100"
								textToCopy={item.value[1]}
								iconCopySizeClass="size-5"
								iconTickSizeClass="size-7"
								noHoverEffectPadding={true}
							/>
						</div>
					</VList>
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
				<SubtleButton
					noPadding
					class="pointer-events-auto shrink-0 p-2 lg:hidden"
					onClick={toggleSettings}
				>
					<div class="size-5">
						<IconSettingsOutline
							strokeWidth={1.5}
							class="h-full w-full scale-110 transition {$isSettingsOpen
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
					class="pointer-events-auto p-2 {isAtTop ? 'translate-y-13' : ''}"
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
	<!-- Spacer -->
	<div class="hidden min-w-0 max-w-60 flex-1 lg:flex" />
</div>
