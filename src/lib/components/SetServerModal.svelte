<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import IconLoading from '$components/icons/IconLoading.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { expandCollapse } from '$ts/animation/transitions';
	import { checkServerHealth } from '$ts/queries/checkServerHealth';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { serverHealth } from '$ts/stores/serverHealth';
	import { serverUrl } from '$ts/stores/serverUrl';
	import { quadOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	export let close: () => void;

	let serverUrlInputValue: string | undefined;
	let setServerProcessStatus: 'idle' | 'loading' | 'success' | 'error' = 'idle';

	const setServerUrl = async () => {
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
				const status = await checkServerHealth(url);
				if (status === 'healthy') {
					setServerProcessStatus = 'success';
					serverHealth.set('healthy');
					serverUrl.set(url.toString());
					serverUrlInputValue = $serverUrl;
					close();
				} else {
					setServerProcessStatus = 'error';
				}
			} catch (error) {
				console.log(error);
				setServerProcessStatus = 'error';
			}
		}
	};

	onMount(() => {
		if ($serverUrl !== undefined) {
			serverUrlInputValue = $serverUrl;
		}
	});
</script>

<div
	transition:fade={{ duration: 300, easing: quadOut }}
	class="w-screen h-screen flex items-center justify-center fixed left-0 
    top-0 bg-c-barrier/50 z-[100] p-4"
>
	<div
		transition:expandCollapse={{ duration: 200, easing: quadOut }}
		use:clickoutside={{ callback: () => (setServerProcessStatus === 'loading' ? null : close()) }}
		class="w-full max-w-xl bg-c-bg-secondary rounded-2xl 
      shadow-xl shadow-c-shadow/[var(--o-shadow-normal)] overflow-hidden z-0 origin-top"
	>
		<div class="w-full flex flex-col px-3 py-4 md:p-5">
			<p class="font-bold text-xl px-2">{$serverUrl ? 'Switch' : 'Set'} Server</p>
			<form
				on:submit|preventDefault={setServerUrl}
				disabled={setServerProcessStatus === 'loading'}
				class="w-full relative flex flex-col md:flex-row items-center justify-center gap-3 mt-5"
			>
				<div class="w-full md:w-auto flex-1 min-w-0 relative">
					<div
						class="w-full h-full rounded-xl bg-c-bg-tertiary shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]  overflow-hidden absolute left-0 top-0"
					/>
					<input
						bind:value={serverUrlInputValue}
						disabled={setServerProcessStatus === 'loading'}
						type="text"
						placeholder="Set server URL"
						class="w-full overflow-hidden overflow-ellipsis bg-transparent relative px-6 py-5 rounded-xl transition 
			        focus:ring-2 focus:ring-c-primary/20 ring-0 ring-c-primary/20 placeholder:text-c-on-bg/30 {!$isTouchscreen
							? 'enabled:hover:ring-2'
							: ''}"
					/>
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
						Set
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
					<div class="pt-4">
						<p class="py-3 px-4 bg-c-danger/10 rounded-lg text-c-danger text-sm">
							This server isn't compatible or not responding...
						</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
