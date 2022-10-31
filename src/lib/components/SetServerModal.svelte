<script lang="ts">
	import { clickoutside } from '$ts/actions/clickoutside';
	import { expandCollapse } from '$ts/animation/transitions';
	import { serverUrl } from '$ts/stores/serverUrl';
	import type { TSetServerProcessStatus } from '$ts/types/main';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import { checkServerHealth } from '$ts/queries/checkServerHealth';
	import Button from '$components/buttons/Button.svelte';
	import IconLoading from '$components/icons/IconLoading.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import ClearButton from '$components/buttons/ClearButton.svelte';
	import { currentServer, currentServerHealthStatus } from '$ts/stores/serverHealth';

	export let close: (() => void) | undefined = undefined;
	export let isOnBarrier = true;

	let setServerProcessStatus: TSetServerProcessStatus;
	let serverUrlInputValue: string | undefined;
	let inputElement: HTMLInputElement;

	const setServerUrl = async () => {
		if (!serverUrlInputValue && env.PUBLIC_DEFAULT_SERVER_URL) {
			serverUrlInputValue = env.PUBLIC_DEFAULT_SERVER_URL;
			return;
		}
		if (serverUrlInputValue) {
			try {
				let urlString = serverUrlInputValue;
				if (!urlString.startsWith('http')) {
					urlString = 'https://' + urlString;
				}
				let url = new URL(urlString).toString();
				if (url.endsWith('/')) {
					url = url.slice(0, -1);
				}
				if (!url) {
					throw new Error('Invalid URL');
				}
				setServerProcessStatus = 'loading';
				const healthRes = await checkServerHealth(url);
				if (healthRes.status === 'healthy') {
					setServerProcessStatus = 'success';
					currentServer.set({
						lastHealthStatus: 'healthy',
						features: healthRes.features ?? undefined
					});
					currentServerHealthStatus.set('healthy');
					if (url === env.PUBLIC_DEFAULT_SERVER_URL) {
						serverUrl.set(env.PUBLIC_DEFAULT_SERVER_URL);
						localStorage.removeItem('serverUrl');
					} else {
						serverUrl.set(url);
					}
					serverUrlInputValue = $serverUrl;
					if (close) {
						close();
					}
				} else {
					setServerProcessStatus = 'error';
				}
			} catch (error) {
				console.log(error);
				setServerProcessStatus = 'error';
			}
		}
	};

	$: showClearServerUrlInputButton =
		serverUrlInputValue !== undefined &&
		serverUrlInputValue !== '' &&
		setServerProcessStatus !== 'loading';

	const clearServerUrlInput = () => {
		serverUrlInputValue = '';
		if (setServerProcessStatus === 'error') setServerProcessStatus = 'idle';
		inputElement.focus();
	};

	onMount(() => {
		if ($serverUrl !== undefined) {
			serverUrlInputValue = $serverUrl;
		}
	});
</script>

<div
	transition:expandCollapse|local={{ duration: isOnBarrier ? 250 : 300 }}
	use:clickoutside={{
		callback: () => (setServerProcessStatus === 'loading' || !close ? null : close())
	}}
	class="w-full ring-2 ring-c-bg-tertiary bg-c-bg-secondary flex flex-col justify-start max-w-xl my-auto rounded-2xl shadow-xl relative overflow-hidden z-0 origin-top {isOnBarrier
		? 'shadow-c-shadow/[var(--o-shadow-strong)]'
		: 'shadow-c-shadow/[var(--o-shadow-normal)]'}"
>
	<div class="w-full flex flex-col px-3 py-4 md:p-5">
		<div class="flex flex-col px-2 gap-1">
			<h1 class="font-bold text-xl">{$serverUrl ? 'Switch' : 'Set'} Server</h1>
			<p class="text-sm text-c-on-bg/50 leading-relaxed">
				The server will be used for generating images.
			</p>
		</div>
		<form
			on:submit|preventDefault={setServerUrl}
			disabled={setServerProcessStatus === 'loading'}
			class="w-full relative flex flex-col md:flex-row items-center justify-center gap-3 mt-5"
		>
			<div class="w-full md:w-auto flex-1 min-w-0 relative group">
				<div
					class="w-full h-full rounded-xl bg-c-bg-tertiary shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] overflow-hidden absolute left-0 top-0"
				/>
				<input
					bind:this={inputElement}
					bind:value={serverUrlInputValue}
					on:input={() => {
						if (setServerProcessStatus === 'error') setServerProcessStatus = 'idle';
					}}
					disabled={setServerProcessStatus === 'loading'}
					type="text"
					placeholder="Server URL"
					class="w-full overflow-hidden overflow-ellipsis bg-transparent relative pl-5 md:pl-6 py-5 rounded-xl transition 
			        focus:ring-2 focus:ring-c-primary/20 ring-0 ring-c-primary/20 placeholder:text-c-on-bg/30 {!$isTouchscreen
						? 'enabled:hover:ring-2'
						: ''} {!$isTouchscreen
						? 'enabled:group-hover:ring-2'
						: ''} {showClearServerUrlInputButton ? 'pr-12 md:pr-17' : 'pr-5 md:pr-6'}"
				/>
				<ClearButton show={showClearServerUrlInputButton} onClick={clearServerUrlInput} />
			</div>
			<Button
				disabled={setServerProcessStatus === 'loading'}
				loading={setServerProcessStatus === 'loading'}
				class="w-full md:w-40"
			>
				<p
					class="transition transform relative
						{setServerProcessStatus === 'loading' ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}"
				>
					{!serverUrlInputValue && env.PUBLIC_DEFAULT_SERVER_URL ? 'Default' : 'Set'}
				</p>
				<div
					class="w-6 h-6 absolute transition transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none
						{setServerProcessStatus === 'loading' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}"
				>
					<IconLoading class="w-full h-full animate-spin-faster" />
				</div>
			</Button>
		</form>
		{#if setServerProcessStatus === 'error'}
			<div transition:expandCollapse|local={{}}>
				<div class="pt-3.5">
					<p class="py-3 px-4 bg-c-danger/8 rounded-lg text-c-danger text-sm">
						This server isn't compatible or not responding.
					</p>
				</div>
			</div>
		{/if}
	</div>
</div>
