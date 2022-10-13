<script lang="ts">
	import { page } from '$app/stores';
	import IconButton from '$components/buttons/IconButton.svelte';
	import HealthIndicator from '$components/HealthIndicator.svelte';
	import IconHistory from '$components/icons/IconHistory.svelte';
	import IconHome from '$components/icons/IconHome.svelte';
	import IconSettings from '$components/icons/IconSettings.svelte';
	import Logo from '$components/Logo.svelte';
	import ModalWrapper from '$components/ModalWrapper.svelte';
	import SetServerModal from '$components/SetServerModal.svelte';
	import SettingsMenu from '$components/SettingsMenu.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { theme } from '$ts/stores/theme';
	import { onMount } from 'svelte';
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	let isSettingsOpen = false;
	let isSwitchServerModalOpen = false;
	const toggleSettings = () => (isSettingsOpen = !isSettingsOpen);
	const closeSettings = () => (isSettingsOpen = false);
	let notAtTheTop = false;
	const notAtTheTopThreshold = 1;

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
	<div
		style="background-image: url({$theme === 'light'
			? '/illustrations/grid-on-light.svg'
			: '/illustrations/grid-on-dark.svg'});"
		class="w-full h-full rounded-b-xl absolute left-0 top-0 transform transition duration-300 bg-c-bg 
		shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] {notAtTheTop
			? 'translate-y-0 opacity-100'
			: '-translate-y-24 opacity-0'}"
	/>
	<a
		href="/"
		data-sveltekit-prefetch
		class="px-4 py-3 self-stretch flex items-center justify-center relative rounded-xl z-0 group"
	>
		<div class="w-full h-full absolute left-0 top-0 pointer-events-none p-2">
			<div class="w-full h-full rounded-xl relative z-0 overflow-hidden">
				<div
					class="w-full h-full origin-left rounded-xl transition transform -translate-x-full
			  	bg-c-primary/25 {!$isTouchscreen ? 'group-hover:translate-x-0' : ''}"
				/>
			</div>
		</div>
		<Logo class="w-9 h-9" />
	</a>
	<div class="flex items-center justify-end relative">
		<div class="p-3 relative">
			<HealthIndicator />
		</div>
		<IconButton
			class="p-3 -ml-3"
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
		<div use:clickoutside={{ callback: closeSettings }} class="flex flex-col items-end -ml-6">
			<IconButton class="p-3" onClick={toggleSettings} name="Settings">
				<IconSettings
					class="w-8 h-8 relative transition transform {isSettingsOpen
						? 'text-c-primary rotate-360'
						: !$isTouchscreen
						? 'group-hover:text-c-primary group-hover:rotate-90'
						: 'text-c-on-bg'}"
				/>
			</IconButton>
			<div class="pr-3">
				<div class="relative -mt-1">
					{#if isSettingsOpen}
						<SettingsMenu {onSwitchServerClick} {closeSettings} />
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

{#if isSwitchServerModalOpen}
	<ModalWrapper>
		<SetServerModal close={() => (isSwitchServerModalOpen = false)} />
	</ModalWrapper>
{/if}
