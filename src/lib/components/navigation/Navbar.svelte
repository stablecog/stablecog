<script lang="ts">
	import { page } from '$app/stores';
	import IconButton from '$components/buttons/IconButton.svelte';
	import HealthIndicator from '$components/HealthIndicator.svelte';
	import IconSettings from '$components/icons/IconSettings.svelte';
	import PageLoadProgressBar from '$components/PageLoadProgressBar.svelte';
	import Logo from '$components/Logo.svelte';
	import ModalWrapper from '$components/ModalWrapper.svelte';
	import NavigationTabBar from '$components/navigation/NavigationTabBar.svelte';
	import SetServerModal from '$components/SetServerModal.svelte';
	import SettingsMenu from '$components/settings/SettingsMenu.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { onMount } from 'svelte';
	import { routesWithHealthCheck } from '$ts/constants/main';
	import Banner from '$components/Banner.svelte';
	import IconSocial from '$components/icons/IconSocial.svelte';
	import { lastClosedNotification } from '$ts/stores/lastClosedNotification';
	/* import LL from '$i18n/i18n-svelte';
	import Button from '$components/buttons/Button.svelte';
	import AccountMenu from '$components/AccountMenu.svelte'; */
	let isSwitchServerModalOpen = false;
	let isSettingsOpen = false;
	let isAccountMenuOpen = false;

	const toggleSettings = () => (isSettingsOpen = !isSettingsOpen);
	const closeSettings = () => (isSettingsOpen = false);

	const toggleAccountMenu = () => (isAccountMenuOpen = !isAccountMenuOpen);
	const closeAccountMenu = () => (isAccountMenuOpen = false);

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

	let mounted = false;
	onMount(() => {
		setNotAtTheTop();
		mounted = true;
	});

	const lastNotification = 'join-discord-1';
</script>

<svelte:window on:scroll={setNotAtTheTop} />

<nav class="w-full flex flex-col sticky -top-px z-50 transition">
	{#if mounted && ($lastClosedNotification === null || $lastClosedNotification !== lastNotification)}
		<Banner
			href="/discord"
			onClose={() => {
				lastClosedNotification.set(lastNotification);
			}}
		>
			<div class="flex items-center justify-center gap-2">
				<IconSocial class="w-7 h-7 flex-shrink-0" type="discord" />
				<p class="flex-shrink min-w-0 overflow-hidden overflow-ellipsis">Join our Discord!</p>
			</div>
		</Banner>
	{/if}
	<div class="w-full flex flex-row items-center justify-between relative z-0">
		<PageLoadProgressBar />
		<div
			class="pointer-events-none w-full h-full rounded-b-xl absolute left-0 top-0 transform transition duration-300 bg-c-bg 
			shadow-navbar shadow-c-shadow/[var(--o-shadow-stronger)] ring-2 ring-c-bg-secondary {notAtTheTop
				? 'translate-y-0 opacity-100'
				: '-translate-y-24 opacity-0'}"
		/>
		<div class="flex md:flex-1 self-stretch">
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
		<div class="hidden md:flex md:w-full md:max-w-[20rem] lg:max-w-[36rem]">
			<NavigationTabBar />
		</div>
		<div class="flex flex-1 flex-wrap items-center justify-end relative">
			<!-- Account -->
			<!-- <div class="flex items-center justify-end px-2">
				{#if $page.data.session?.user.email}
					<div
						use:clickoutside={{ callback: closeAccountMenu }}
						class="flex flex-col items-end relative"
					>
						<div class="p-3 -mr-3">
							<IconButton
								class="shadow-lg rounded-full shadow-c-shadow/[var(--o-shadow-strong)]"
								noPadding
								name="Account"
								onClick={toggleAccountMenu}
							>
								<p
									class="w-10 h-10 flex items-center justify-center bg-c-bg ring-2 ring-c-primary/50 rounded-full
									text-c-on-bg font-semibold transition {!$isTouchscreen
										? 'group-hover:text-c-primary group-hover:ring-c-primary'
										: ''}"
								>
									{$page.data.session?.user.email.slice(0, 2).toUpperCase()}
								</p>
							</IconButton>
						</div>
						<div class="relative -mr-12 md:mr-0">
							{#if isAccountMenuOpen}
								<AccountMenu {closeAccountMenu} />
							{/if}
						</div>
					</div>
				{:else if $page.url.pathname !== '/login'}
					<Button size="xs" href={`/login?redirect_to=${encodeURIComponent($page.url.pathname)}`}>
						{$LL.Shared.LoginButton()}
					</Button>
				{/if}
			</div> -->
			{#if routesWithHealthCheck.includes($page.url.pathname)}
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
	</div>
</nav>

{#if isSwitchServerModalOpen}
	<ModalWrapper>
		<SetServerModal close={() => (isSwitchServerModalOpen = false)} />
	</ModalWrapper>
{/if}
