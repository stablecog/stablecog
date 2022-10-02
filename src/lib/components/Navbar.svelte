<script lang="ts">
	import { page } from '$app/stores';
	import IconButton from '$components/buttons/IconButton.svelte';
	import IconHistory from '$components/icons/IconHistory.svelte';
	import IconHome from '$components/icons/IconHome.svelte';
	import IconSettings from '$components/icons/IconSettings.svelte';
	import SetServerModal from '$components/SetServerModal.svelte';
	import SettingsMenu from '$components/SettingsMenu.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { serverHealth } from '$ts/stores/serverHealth';

	let isSettingsOpen = false;
	let isSwitchServerOpen = false;
	const toggleSettings = () => (isSettingsOpen = !isSettingsOpen);
	const closeSettings = () => (isSettingsOpen = false);

	const onSwitchServer = () => {
		closeSettings();
		isSwitchServerOpen = true;
	};
</script>

<div class="w-full flex flex-row items-center justify-between px-4 py-4 relative">
	<div class="w-5 h-5" />
	<div class="flex items-center justify-end">
		<div class="p-3">
			<div
				class="w-2.5 h-2.5 rounded-full {$serverHealth === 'loading'
					? 'bg-c-primary animate-pulse-scale'
					: $serverHealth === 'healthy'
					? 'bg-c-success'
					: $serverHealth === 'unhealthy'
					? 'bg-c-danger'
					: 'bg-c-on-bg/50'}"
			/>
		</div>
		<IconButton
			href={$page.url.pathname === '/history' ? '/' : '/history'}
			name={$page.url.pathname === '/history' ? 'Home' : 'History'}
		>
			{#if $page.url.pathname === '/history'}
				<IconHome
					class="w-8 h-8 relative transition transform {!$isTouchscreen
						? 'group-hover:text-c-primary'
						: 'text-c-on-bg'}"
				/>
			{:else}
				<IconHistory
					class="w-8 h-8 relative transition transform {!$isTouchscreen
						? 'group-hover:text-c-primary'
						: 'text-c-on-bg'}"
				/>
			{/if}
		</IconButton>
		<div use:clickoutside={{ callback: closeSettings }} class="flex flex-col items-end">
			<IconButton onClick={toggleSettings} name="Settings">
				<IconSettings
					class="w-8 h-8 relative transition transform {isSettingsOpen
						? 'text-c-primary rotate-360'
						: !$isTouchscreen
						? 'group-hover:text-c-primary group-hover:rotate-90'
						: 'text-c-on-bg'}"
				/>
			</IconButton>
			<div class="relative">
				{#if isSettingsOpen}
					<SettingsMenu {onSwitchServer} {closeSettings} />
				{/if}
			</div>
		</div>
	</div>
</div>

{#if isSwitchServerOpen}
	<SetServerModal close={() => (isSwitchServerOpen = false)} />
{/if}
