<script lang="ts">
	import { page } from '$app/stores';
	import IconButton from '$components/buttons/IconButton.svelte';
	import PageLoadProgressBar from '$components/PageLoadProgressBar.svelte';
	import NavigationTabBar from '$components/navigation/NavigationTabBar.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { onMount } from 'svelte';
	import Banner from '$components/Banner.svelte';
	import IconSc from '$components/icons/IconSc.svelte';
	import { lastClosedNotification } from '$ts/stores/lastClosedNotification';
	import LL, { locale } from '$i18n/i18n-svelte';
	import Button from '$components/buttons/Button.svelte';
	import AccountMenu from '$components/accountMenu/AccountMenu.svelte';
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
	import { navbarStickyType } from '$ts/stores/stickyNavbar';
	import { isDrawerOpen } from '$ts/stores/isDrawerOpen';
	import IconSidebar from '$components/icons/IconSidebar.svelte';
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import LogoButton from '$components/buttons/LogoButton.svelte';
	import IconGuide from '$components/icons/IconGuide.svelte';
	import { themeApp } from '$ts/stores/theme';
	import IconBlog from '$components/icons/IconBlog.svelte';
	import { searchParamsString } from '$ts/stores/searchParamsString';

	export let notAtTheVeryTop = false;
	export let scrollDirection: 'up' | 'down' = 'down';

	let isSignInModalOpen = false;
	let isAccountMenuOpen = false;

	const routesWithoutDrawer = ['/'];

	const toggleAccountMenu = () => (isAccountMenuOpen = !isAccountMenuOpen);
	const closeAccountMenu = () => (isAccountMenuOpen = false);

	let mounted = false;
	onMount(() => {
		mounted = true;
	});

	const lastNotification = 'meet-our-new-interface';
</script>

<nav
	bind:clientHeight={$navbarHeight}
	style={$navbarStickyType === 'not-sticky' ? '' : 'position: fixed; top: 0; left: 0;'}
	class="w-full flex flex-col z-60 transform transition duration-200 {notAtTheVeryTop &&
	$navbarStickyType === 'auto' &&
	scrollDirection === 'down'
		? '-translate-y-[calc(100%+2px)]'
		: ''}"
>
	{#if mounted && ($lastClosedNotification === null || $lastClosedNotification !== lastNotification)}
		<Banner
			href="/blog/meet-our-new-interface"
			onClose={() => {
				lastClosedNotification.set(lastNotification);
			}}
		>
			<div class="flex items-center justify-center gap-2">
				<IconBolt class="w-6 h-6 flex-shrink-0" />
				<p class="flex-shrink min-w-0 overflow-hidden overflow-ellipsis">Meet Our New Interface!</p>
			</div>
		</Banner>
	{/if}
	<div class="w-full flex flex-row items-center justify-between relative z-0">
		<PageLoadProgressBar />
		<div
			class="pointer-events-none w-full h-full rounded-b-xl absolute left-0 top-0 transform transition duration-200 bg-c-bg
			shadow-navbar shadow-c-shadow/[var(--o-shadow-stronger)] ring-2 ring-c-bg-secondary {$navbarStickyType ===
				'not-sticky' || !notAtTheVeryTop
				? '-translate-y-full opacity-0'
				: ''}"
		/>
		<div class="flex xl:flex-1 self-stretch">
			{#if routesWithoutDrawer.includes($page.url.pathname)}
				<LogoButton />
			{:else}
				<button
					on:click={() => isDrawerOpen.set(!$isDrawerOpen)}
					class="relative self-stretch p-0.5 group overflow-hidden md:hidden"
				>
					<div class="h-full flex items-center justify-center px-2.5 py-3 relative overflow-hidden">
						<ButtonHoverEffect hoverFrom="left" size="md" />
						<IconSidebar
							class="w-8 h-8 transition text-c-on-bg {!$isTouchscreen
								? 'group-hover:text-c-primary'
								: ''} transform {$isDrawerOpen ? 'rotate-90' : ''}"
						/>
					</div>
				</button>
				<LogoButton class="hidden md:flex" />
			{/if}
		</div>
		<div class="hidden md:flex md:w-full md:max-w-[19rem] lg:max-w-[36rem] md:ml-2 xl:ml-0">
			<NavigationTabBar />
		</div>
		<div class="flex flex-1 flex-wrap items-center justify-end relative">
			<IconButton class="py-2 hidden md:block" href="/discord" target="_blank" name="Discord">
				<IconSc
					type="discord"
					class="w-8 h-8 relative transition transform {$page.url.pathname === '/' &&
					$themeApp === 'light' &&
					!notAtTheVeryTop
						? 'text-c-bg'
						: 'text-c-on-bg'} {!$isTouchscreen ? 'group-hover/iconbutton:text-c-primary' : ''}"
				/>
			</IconButton>
			<IconButton class="py-2 hidden md:block" href="/guide" name="Guide">
				<IconGuide
					class="w-8 h-8 relative transition transform {$page.url.pathname === '/' &&
					$themeApp === 'light' &&
					!notAtTheVeryTop
						? 'text-c-bg'
						: 'text-c-on-bg'} {!$isTouchscreen ? 'group-hover/iconbutton:text-c-primary' : ''}"
				/>
			</IconButton>
			<IconButton class="py-2 hidden md:block" href="/blog" name="Blog">
				<IconBlog
					class="w-8 h-8 relative transition transform {$page.url.pathname === '/' &&
					$themeApp === 'light' &&
					!notAtTheVeryTop
						? 'text-c-bg'
						: 'text-c-on-bg'} {!$isTouchscreen ? 'group-hover/iconbutton:text-c-primary' : ''}"
				/>
			</IconButton>
			<div class="flex items-center justify-end pl-2 pr-3.5 md:pl-2.5 md:pr-5">
				{#if $page.data.session && $userSummary}
					<div
						class="flex flex-col items-end mr-3.5 md:mr-4 {$page.url.pathname === '/' &&
						$themeApp === 'light' &&
						!notAtTheVeryTop
							? 'text-c-bg'
							: 'text-c-on-bg'}"
					>
						<p
							class="text-xs font-medium {$page.url.pathname === '/' &&
							$themeApp === 'light' &&
							!notAtTheVeryTop
								? 'text-c-bg/60'
								: 'text-c-on-bg/60'}"
						>
							{$LL.Account.RemainingTitle()}
						</p>
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
						<div class="py-3.5">
							<IconButton
								class="shadow-lg rounded-full flex items-center justify-center shadow-c-shadow/[var(--o-shadow-strong)]"
								noPadding
								name="Account"
								onClick={toggleAccountMenu}
							>
								<div
									class="w-9 h-9 ring-2 {$page.url.pathname === '/' &&
									$themeApp === 'light' &&
									!notAtTheVeryTop
										? 'ring-c-bg/25'
										: 'ring-c-on-bg/25'} overflow-hidden rounded-full transition transform relative {!$isTouchscreen
										? $page.url.pathname === '/' && $themeApp === 'light' && !notAtTheVeryTop
											? 'group-hover/iconbutton:ring-c-bg'
											: 'group-hover/iconbutton:ring-c-on-bg'
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
						<div class="relative -mr-1">
							{#if isAccountMenuOpen}
								<AccountMenu closeMenu={closeAccountMenu} />
							{/if}
						</div>
					</div>
				{:else if $page.url.pathname !== '/sign-in'}
					<Button class="-mr-1" size="xs" onClick={() => (isSignInModalOpen = true)}>
						{$LL.SignIn.GetStartedButton()}
					</Button>
				{/if}
			</div>
		</div>
	</div>
</nav>

{#if isSignInModalOpen && (!$page.data.session?.user.id || !$userSummary)}
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
			<SignInCard
				isModal={true}
				redirectTo={($page.url.pathname === '/' ? '/generate' : $page.url.pathname) +
					$searchParamsString}
			/>
		</div>
	</div>
{/if}
