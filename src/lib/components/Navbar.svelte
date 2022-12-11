<script lang="ts">
	import { page } from '$app/stores';
	import IconButton from '$components/buttons/IconButton.svelte';
	import HealthIndicator from '$components/HealthIndicator.svelte';
	import IconSettings from '$components/icons/IconSettings.svelte';
	import PageLoadProgressBar from '$components/PageLoadProgressBar.svelte';
	import Logo from '$components/Logo.svelte';
	import ModalWrapper from '$components/ModalWrapper.svelte';
	import NavigationTabBar from '$components/NavigationTabBar.svelte';
	import SetServerModal from '$components/SetServerModal.svelte';
	import SettingsMenu from '$components/settings/SettingsMenu.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { onMount } from 'svelte';
	import { healthCheckRoutes } from '$ts/constants/main';

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

<nav class="w-full flex flex-row items-center justify-between fixed -top-px z-50 transition">
	<PageLoadProgressBar />
	<div
		class="w-full h-full rounded-b-xl absolute left-0 top-0 transform transition duration-300 bg-c-bg 
		shadow-navbar shadow-c-shadow/[var(--o-shadow-stronger)] ring-2 ring-c-bg-secondary {notAtTheTop
			? 'translate-y-0 opacity-100'
			: '-translate-y-24 opacity-0'}"
	/>
	<div class="flex flex-1 self-stretch">
		<a
			aria-label="Go to Home"
			href="/"
			data-sveltekit-prefetch
			class="px-3.5 py-4.5 md:py-5.5 self-stretch flex items-center justify-center relative rounded-xl z-0 group"
		>
			<div class="w-full h-full absolute left-0 top-0 pointer-events-none p-1.5">
				<div class="w-full h-full rounded-xl relative z-0 overflow-hidden">
					<div
						class="w-full h-full origin-left rounded-xl transition transform -translate-x-full
						bg-c-primary/25 {!$isTouchscreen ? 'group-hover:translate-x-0' : ''}"
					/>
				</div>
			</div>
			<Logo class="w-9 h-9" />
		</a>
	</div>
	<div class="w-auto md:w-full max-w-[36rem] hidden md:flex">
		<NavigationTabBar />
	</div>
	<div class="flex flex-1 flex-wrap items-center justify-end relative">
		{#if healthCheckRoutes.includes($page.url.pathname)}
			<HealthIndicator />
		{/if}
		<div use:clickoutside={{ callback: closeSettings }} class="flex flex-col items-end -ml-3.5">
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
</nav>

{#if isSwitchServerModalOpen}
	<ModalWrapper>
		<SetServerModal close={() => (isSwitchServerModalOpen = false)} />
	</ModalWrapper>
{/if}
