<script lang="ts">
	import { page } from '$app/stores';
	import IconButton from '$components/buttons/IconButton.svelte';
	import IconSettings from '$components/icons/IconSettings.svelte';
	import PageLoadProgressBar from '$components/PageLoadProgressBar.svelte';
	import Logo from '$components/Logo.svelte';
	import NavigationTabBar from '$components/navigation/NavigationTabBar.svelte';
	import SettingsMenu from '$components/settings/SettingsMenu.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { onMount } from 'svelte';
	import Banner from '$components/Banner.svelte';
	import IconSocial from '$components/icons/IconSocial.svelte';
	import { lastClosedNotification } from '$ts/stores/lastClosedNotification';
	import LL, { locale } from '$i18n/i18n-svelte';
	import Button from '$components/buttons/Button.svelte';
	import AccountMenu from '$components/AccountMenu.svelte';
	import Avatar from '$components/Avatar.svelte';
	import { portal } from 'svelte-portal';
	import { fade, fly } from 'svelte/transition';
	import SignInCard from '$components/SignInCard.svelte';
	import { navbarHeight } from '$ts/stores/navbarHeight';
	import {
		modalBgTransitionProps,
		modalInTransitionProps,
		modalOutTransitionProps
	} from '$ts/animation/constants';
	import IconBolt from '$components/icons/IconBolt.svelte';
	import { userSummary } from '$ts/stores/user/summary';
	import { isUserGalleryEditActive } from '$ts/stores/user/gallery';
	import { isAdminGalleryEditActive } from '$ts/stores/admin/gallery';

	let isSignInModalOpen = false;
	let isSettingsOpen = false;
	let isAccountMenuOpen = false;

	const toggleSettings = () => (isSettingsOpen = !isSettingsOpen);
	const closeSettings = () => (isSettingsOpen = false);

	const toggleAccountMenu = () => (isAccountMenuOpen = !isAccountMenuOpen);
	const closeAccountMenu = () => (isAccountMenuOpen = false);

	let notAtTheTop = false;
	const notAtTheTopThreshold = 1;

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

	const lastNotification = 'our-first-big-update';

	$: nonStickyNavbarRoutes = [
		{ route: '/admin/gallery', nonStickyIfTrue: $isAdminGalleryEditActive },
		{ route: '/history', nonStickyIfTrue: $isUserGalleryEditActive }
	];

	$: isStickyNavbarRoute = !nonStickyNavbarRoutes.find(
		(r) => r.nonStickyIfTrue && r.route === $page.url.pathname
	);
</script>

<svelte:window on:scroll={setNotAtTheTop} />

<nav
	bind:clientHeight={$navbarHeight}
	class="w-full flex flex-col z-50 {isStickyNavbarRoute ? 'sticky -top-px' : ''}"
>
	{#if mounted && ($lastClosedNotification === null || $lastClosedNotification !== lastNotification)}
		<Banner
			href="/blog/our-first-big-update"
			target="_self"
			onClose={() => {
				lastClosedNotification.set(lastNotification);
			}}
		>
			<div class="flex items-center justify-center gap-2">
				<IconBolt class="w-6 h-6 flex-shrink-0" />
				<p class="flex-shrink min-w-0 overflow-hidden overflow-ellipsis">Our big update is here!</p>
			</div>
		</Banner>
	{/if}
	<div class="w-full flex flex-row items-center justify-between relative z-0">
		<PageLoadProgressBar />
		<div
			class="pointer-events-none w-full h-full rounded-b-xl absolute left-0 top-0 transform transition duration-300 bg-c-bg 
			shadow-navbar shadow-c-shadow/[var(--o-shadow-stronger)] ring-2 ring-c-bg-secondary {!notAtTheTop ||
			!isStickyNavbarRoute
				? '-translate-y-24 opacity-0'
				: 'translate-y-0 opacity-100'}"
		/>
		<div class="flex xl:flex-1 self-stretch">
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
		<div class="hidden md:flex md:w-full md:max-w-[19rem] lg:max-w-[36rem] md:ml-2 xl:ml-0">
			<NavigationTabBar />
		</div>
		<div class="flex flex-1 flex-wrap items-center justify-end relative">
			<div class="flex items-center justify-end px-3">
				{#if $page.data.session && $userSummary}
					<div class="flex flex-col items-end px-5.5">
						<p class="text-xs text-c-on-bg/60">{$LL.Account.RemainingTitle()}</p>
						<p class="text-sm font-bold mt-0.5">
							{$userSummary.total_remaining_credits.toLocaleString($locale)}
						</p>
					</div>
				{/if}
				<!-- Account -->
				{#if $page.data.session?.user.email && $userSummary}
					<div
						use:clickoutside={{ callback: closeAccountMenu }}
						class="flex flex-col items-end relative"
					>
						<div class="px-2.5 py-3.5 -mx-3">
							<IconButton
								class="shadow-lg rounded-full flex items-center justify-center shadow-c-shadow/[var(--o-shadow-strong)]"
								noPadding
								name="Account"
								onClick={toggleAccountMenu}
							>
								<div
									class="w-9 h-9 ring-2 ring-c-on-bg/25 overflow-hidden rounded-full transition transform relative {!$isTouchscreen
										? 'group-hover/iconbutton:ring-c-on-bg'
										: ''} {!$isTouchscreen && isAccountMenuOpen
										? 'rotate-360'
										: !$isTouchscreen && !isAccountMenuOpen
										? ' group-hover/iconbutton:rotate-90'
										: ''}"
								>
									<Avatar str={$page.data.session.user.email} class="w-full h-full relative" />
								</div>
							</IconButton>
						</div>
						<div class="relative -mr-14 md:-mr-1.5">
							{#if isAccountMenuOpen}
								<AccountMenu {closeAccountMenu} />
							{/if}
						</div>
					</div>
				{:else if $page.url.pathname !== '/sign-in'}
					<Button class="-mx-1" size="xs" onClick={() => (isSignInModalOpen = true)}>
						{$LL.SignIn.GetStartedButton()}
					</Button>
				{/if}
			</div>
			<IconButton class="p-3 -mx-3 hidden md:block" href="/discord" target="_blank" name="Discord">
				<IconSocial
					type="discord"
					class="w-8 h-8 relative transition transform {!$isTouchscreen
						? 'group-hover/iconbutton:text-c-primary'
						: 'text-c-on-bg'}"
				/>
			</IconButton>
			<div use:clickoutside={{ callback: closeSettings }} class="flex flex-col items-end -ml-3">
				<IconButton class="p-3" onClick={toggleSettings} name="Settings">
					<IconSettings
						class="w-8 h-8 relative transition transform {isSettingsOpen
							? 'text-c-primary rotate-360'
							: !$isTouchscreen
							? 'group-hover/iconbutton:text-c-primary group-hover/iconbutton:rotate-90'
							: 'text-c-on-bg'}"
					/>
				</IconButton>
				<div class="pr-3">
					<div class="relative -mt-1">
						{#if isSettingsOpen}
							<SettingsMenu {closeSettings} />
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</nav>

{#if isSignInModalOpen && !$page.data.session?.user.id}
	<div
		use:portal={'body'}
		transition:fade|local={modalBgTransitionProps}
		class="w-full h-full bg-c-barrier/80 fixed left-0 top-0 px-3 z-[10000]"
	/>
	<div
		use:portal={'body'}
		in:fly|local={modalInTransitionProps}
		out:fly|local={modalOutTransitionProps}
		class="w-full h-full flex flex-col items-center fixed left-0 top-0 px-3 py-20 z-[10001] overflow-auto"
	>
		<div
			use:clickoutside={{ callback: () => (isSignInModalOpen = false) }}
			class="max-w-full my-auto"
		>
			<SignInCard isModal={true} redirectTo={$page.url.pathname} />
		</div>
	</div>
{/if}
