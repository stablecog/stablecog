<script lang="ts">
	import IconSettings from '$components/icons/IconSettings.svelte';
	import SetServerModal from '$components/SetServerModal.svelte';
	import SettingsMenu from '$components/SettingsMenu.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { parsedUrl } from '$ts/helpers/parsedUrl';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { serverUrl } from '$ts/stores/serverUrl';
	import { onMount } from 'svelte';

	let isSettingsOpen = false;
	let isSwitchServerOpen = false;
	let serverUrlInputValue: string | undefined;
	const toggleSettings = () => (isSettingsOpen = !isSettingsOpen);
	const closeSettings = () => (isSettingsOpen = false);

	const onSwitchServer = () => {
		closeSettings();
		isSwitchServerOpen = true;
	};

	const setServerUrl = () => {
		if (serverUrlInputValue) {
			try {
				if (!serverUrlInputValue.startsWith('http')) {
					serverUrlInputValue = 'https://' + serverUrlInputValue;
				}
				let url = new URL(serverUrlInputValue).toString();
				if (url.endsWith('/')) {
					url = url.slice(0, -1);
				}
				serverUrl.set(url.toString());
				if (!$serverUrl) {
					throw new Error('Invalid URL');
				}
				serverUrlInputValue = parsedUrl($serverUrl);
				isSwitchServerOpen = false;
			} catch (error) {
				console.log(error);
			}
		}
	};

	onMount(() => {
		if ($serverUrl) {
			serverUrlInputValue = parsedUrl($serverUrl);
		}
	});
</script>

<div class="w-full flex flex-row items-center justify-between px-4 py-4 relative">
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
		<div class="w-full relative mt-1.5">
			{#if isSettingsOpen}
				<SettingsMenu {onSwitchServer} {closeSettings} />
			{/if}
		</div>
	</div>
</div>

{#if isSwitchServerOpen}
	<SetServerModal
		{setServerUrl}
		bind:serverUrlInputValue
		onClickoutside={() => (isSwitchServerOpen = false)}
	/>
{/if}
