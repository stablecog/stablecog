<script lang="ts">
	import IconServer from '$components/icons/IconServer.svelte';
	import IconSettings from '$components/icons/IconSettings.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { expandCollapse } from '$ts/animation/transitions';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { serverUrl } from '$ts/stores/serverUrl';
	import { onMount } from 'svelte';
	import { quadOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	let isSettingsOpen = false;
	let isSwitchServerOpen = false;
	let inputValue: string | undefined;
	const toggleSettings = () => (isSettingsOpen = !isSettingsOpen);
	const closeSettings = () => (isSettingsOpen = false);

	const onSwitchServer = () => {
		closeSettings();
		isSwitchServerOpen = true;
	};

	const parsedUrl = (str: string) => {
		const url = new URL(str);
		return url.hostname;
	};

	const setServerUrl = () => {
		if (inputValue) {
			try {
				if (!inputValue.startsWith('http')) {
					inputValue = 'https://' + inputValue;
				}
				let url = new URL(inputValue).toString();
				if (url.endsWith('/')) {
					url = url.slice(0, -1);
				}
				serverUrl.set(url.toString());
				if (!$serverUrl) {
					throw new Error('Invalid URL');
				}
				inputValue = parsedUrl($serverUrl);
				isSwitchServerOpen = false;
			} catch (error) {
				console.log(error);
			}
		}
	};

	onMount(() => {
		if ($serverUrl) {
			inputValue = parsedUrl($serverUrl);
		}
	});
</script>

<div class="w-full flex flex-row items-center justify-between px-4 py-4">
	<div class="w-5 h-5" />
	<div use:clickoutside={{ callback: closeSettings }} class="flex-1 flex flex-col items-end">
		<button on:click={toggleSettings} class="group">
			<div class="rounded-full relative">
				<div class="w-full h-full rounded-full overflow-hidden z-0 absolute left-0 top-0">
					<div
						class="w-full h-full ease-out transition transform bg-c-primary/25 
            absolute left-0 top-0 rounded-xl -translate-x-full {!$isTouchscreen
							? 'group-hover:translate-x-0'
							: ''}"
					/>
				</div>
				<div class="p-1.5">
					<IconSettings
						class="w-8 h-8 relative transition transform {isSettingsOpen
							? 'text-c-primary rotate-360'
							: !$isTouchscreen
							? 'group-hover:text-c-primary group-hover:rotate-90'
							: 'text-c-on-bg'}"
					/>
				</div>
			</div>
		</button>
		<div class="w-full relative mt-1">
			{#if isSettingsOpen}
				<div
					transition:expandCollapse={{ durationMultiplier: 0.8 }}
					class="w-56 max-w-full bg-c-bg-secondary rounded-xl flex flex-col shadow-lg shadow-c-shadow/25 absolute right-0 top-0 
          overflow-hidden z-50"
				>
					<button
						on:click={onSwitchServer}
						class="w-full px-5 py-4 items-center font-bold relative rounded-xl overflow-hidden group"
					>
						<div
							class="w-full h-full origin-left rounded-xl transition transform -translate-x-full 
			        bg-c-primary/10 absolute left-0 top-0 {!$isTouchscreen
								? 'group-enabled:group-hover:translate-x-0'
								: ''}"
						/>
						<div class="flex-1 min-w-0 flex flex-col items-start gap-1">
							<div class="w-full flex items-center justify-start gap-2.5">
								<IconServer
									class="transition w-6 h-6 text-c-text {!$isTouchscreen
										? 'group-hover:text-c-primary'
										: ''}"
								/>
								<p
									class="w-full text-left transition text-c-on-bg {!$isTouchscreen
										? 'group-hover:text-c-primary'
										: ''}"
								>
									{$serverUrl ? 'Switch' : 'Set'} Server
								</p>
							</div>
							<p class="w-full text-xs text-left break-all font-normal text-c-on-bg/60">
								{$serverUrl ? parsedUrl($serverUrl) : 'Not connected'}
							</p>
						</div>
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>

{#if isSwitchServerOpen}
	<div
		transition:fade={{ duration: 300, easing: quadOut }}
		class="w-screen h-screen flex items-center justify-center fixed left-0 
    top-0 bg-c-barrier/50 z-[100] p-4"
	>
		<div
			transition:expandCollapse={{ duration: 200, easing: quadOut }}
			use:clickoutside={{ callback: () => (isSwitchServerOpen = false) }}
			class="w-full max-w-xl bg-c-bg-secondary rounded-2xl 
      shadow-xl shadow-c-shadow/25 overflow-hidden z-0 origin-top"
		>
			<div class="w-full flex flex-col px-3 py-4 md:p-5 gap-4">
				<p class="font-bold text-xl px-2">{$serverUrl ? 'Switch' : 'Set'} Server</p>
				<form
					on:submit|preventDefault={setServerUrl}
					class="w-full relative flex flex-col md:flex-row items-center justify-center gap-3"
				>
					<div class="w-full md:w-auto flex-1 min-w-0 relative">
						<div
							class="w-full h-full rounded-xl bg-c-bg-tertiary shadow-lg shadow-c-shadow/20 overflow-hidden absolute left-0 top-0"
						/>
						<input
							bind:value={inputValue}
							type="text"
							placeholder="Set server URL"
							class="w-full bg-transparent relative px-6 md:px-8 py-5 rounded-xl transition 
			        focus:ring-2 focus:ring-c-primary/50 ring-0 ring-c-primary/25 placeholder:text-c-on-bg/40 {!$isTouchscreen
								? 'enabled:hover:ring-2'
								: ''}"
						/>
					</div>
					<button
						class="w-full md:w-auto px-8 relative flex items-center justify-center text-center py-5 
            shadow-lg shadow-c-shadow/20 text-c-on-primary rounded-xl font-bold gap-2 
            overflow-hidden z-0 group bg-c-primary"
					>
						<div
							class="w-full h-full origin-left rounded-xl transition transform -translate-x-full 
              bg-c-secondary absolute left-0 top-0 {!$isTouchscreen
								? 'group-enabled:group-hover:translate-x-0'
								: ''}"
						/>
						<p class="relative">Set</p>
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}
