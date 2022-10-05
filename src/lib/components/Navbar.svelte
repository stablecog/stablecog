<script lang="ts">
	import { page } from '$app/stores';
	import IconButton from '$components/buttons/IconButton.svelte';
	import IconHistory from '$components/icons/IconHistory.svelte';
	import IconHome from '$components/icons/IconHome.svelte';
	import IconSettings from '$components/icons/IconSettings.svelte';
	import ModalWrapper from '$components/ModalWrapper.svelte';
	import SetServerModal from '$components/SetServerModal.svelte';
	import SettingsMenu from '$components/SettingsMenu.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { serverHealth } from '$ts/stores/serverHealth';
	import { theme } from '$ts/stores/theme';
	import { onMount } from 'svelte';
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	let isSettingsOpen = false;
	let isSwitchServerModalOpen = false;
	const toggleSettings = () => (isSettingsOpen = !isSettingsOpen);
	const closeSettings = () => (isSettingsOpen = false);
	let notAtTheTop = false;
	const notAtTheTopThreshold = 10;

	const onSwitchServerClick = () => {
		closeSettings();
		isSwitchServerModalOpen = true;
	};

	const setNotAtTheTop = () => {
		const t = window.scrollY > notAtTheTopThreshold;
		if (t !== notAtTheTop) {
			notAtTheTop = t;
		}
	};

	onMount(() => {
		setNotAtTheTop();
	});
</script>

<svelte:window on:scroll={setNotAtTheTop} />

<div class="w-full flex flex-row items-center justify-between sticky z-50 top-0 transition">
	<div class="px-4 py-3 pointer-events-none">
		<div class="w-5 h-5 relative" />
	</div>
	<div class="flex items-center justify-end relative px-4 py-3">
		<div
			style="background-image: url({$theme === 'light'
				? '/illustrations/grid-on-light.svg'
				: '/illustrations/grid-on-dark.svg'});"
			class="w-full h-full rounded-bl-xl absolute left-0 top-0 transform transition duration-300 bg-c-bg 
			shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] {notAtTheTop
				? 'translate-y-0 opacity-100'
				: '-translate-y-24 opacity-0'}"
		/>
		<div class="p-3 relative">
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
			<div class="w-8 h-8 relative">
				{#if $page.url.pathname === '/history'}
					<div
						transition:scale={{ duration: 200, easing: quadOut, opacity: 0 }}
						class="w-full h-full absolute left-0 top-0"
					>
						<IconHome
							class="w-full h-full relative transition transform {!$isTouchscreen
								? 'group-hover:text-c-primary'
								: 'text-c-on-bg'}"
						/>
					</div>
				{:else}
					<div
						transition:scale={{ duration: 200, easing: quadOut, opacity: 0 }}
						class="w-full h-full absolute left-0 top-0"
					>
						<IconHistory
							class="w-full h-full relative transition transform {!$isTouchscreen
								? 'group-hover:text-c-primary'
								: 'text-c-on-bg'}"
						/>
					</div>
				{/if}
			</div>
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
					<SettingsMenu {onSwitchServerClick} {closeSettings} />
				{/if}
			</div>
		</div>
	</div>
</div>

{#if isSwitchServerModalOpen}
	<ModalWrapper>
		<SetServerModal close={() => (isSwitchServerModalOpen = false)} />
	</ModalWrapper>
{/if}
