<script lang="ts">
	import { page } from '$app/stores';
	import AccountMenu from '$components/accountMenu/AccountMenu.svelte';
	import Avatar from '$components/avatar/Avatar.svelte';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import IconSc from '$components/icons/IconSc.svelte';
	import IconSidebar from '$components/icons/IconSidebar.svelte';
	import SignInModal from '$components/modals/SignInModal.svelte';
	import BannerWrapper from '$components/navigation/navbar/BannerWrapper.svelte';
	import RemainingCredits from '$components/navigation/navbar/RemainingCredits.svelte';
	import NavigationTabBar from '$components/navigation/navigationTabBar/NavigationTabBar.svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import IconButton from '$components/primitives/buttons/IconButton.svelte';
	import LogoButton from '$components/primitives/buttons/LogoButton.svelte';
	import PageLoadProgressBar from '$components/utils/PageLoadProgressBar.svelte';
	import LL from '$i18n/i18n-svelte';
	import type { TDirTreeItem } from '$routes/+layout';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { socialAppUrls } from '$ts/constants/social';
	import { sessionStore } from '$ts/constants/supabase';
	import { isDrawerOpen } from '$ts/stores/isDrawerOpen';
	import { isSignInModalOpen } from '$ts/stores/isSignInModalOpen';
	import { navbarStickyType } from '$ts/stores/navbar';
	import { navbarHeight } from '$ts/stores/navbarHeight';
	import { notAtTheVeryTop, scrollDirection } from '$ts/stores/scroll';
	import { themeApp } from '$ts/stores/theme';
	import { userSummary } from '$ts/stores/user/summary';
	import type { Writable } from 'svelte/store';

	export let dirTree: Writable<TDirTreeItem[]> | undefined = undefined;

	let isAccountMenuOpen = false;

	const routesWithoutDrawer = ['/'];

	const toggleAccountMenu = () => (isAccountMenuOpen = !isAccountMenuOpen);
	const closeAccountMenu = () => (isAccountMenuOpen = false);

	const showBanner = true;

	const dontRedirectToRoutes = [
		{
			route: '/auth/confirm'
		},
		{
			route: '/auth/callback'
		},
		{
			route: '/auth/error/',
			notStrict: true
		}
	];
</script>

<nav
	bind:clientHeight={$navbarHeight}
	style={$navbarStickyType === 'relative' || $navbarStickyType === undefined
		? ''
		: 'position: fixed; top: 0; left: 0;'}
	class="z-60 flex w-full transform flex-col rounded-b-xl transition {$notAtTheVeryTop &&
	$navbarStickyType === 'auto-hiding' &&
	$scrollDirection === 'down'
		? '-translate-y-[calc(100%+2px)]'
		: ''} {$navbarStickyType === 'relative' || !$notAtTheVeryTop
		? 'bg-c-bg/0 shadow-navbar-0'
		: 'bg-c-bg shadow-navbar'}"
>
	{#if showBanner}
		<BannerWrapper />
	{/if}
	<div class="relative z-0 flex w-full flex-row items-center justify-between">
		<PageLoadProgressBar />
		<div class="flex min-w-0 flex-1 self-stretch md:flex-none xl:flex-1">
			<button
				aria-label="Toggle Drawer"
				on:click={() => isDrawerOpen.set(!$isDrawerOpen)}
				class="group relative flex-shrink-0 self-stretch overflow-hidden p-0.5 md:hidden {routesWithoutDrawer.includes(
					$page.url.pathname
				)
					? 'hidden'
					: ''}"
			>
				<div class="relative flex h-full items-center justify-center overflow-hidden px-2.5 py-3">
					<ButtonHoverEffect hoverFrom="left" size="md" color="primary-strong" />
					<IconSidebar
						class="h-8 w-8 transform text-c-on-bg transition 
						not-touch:group-hover:text-c-primary {$isDrawerOpen ? 'rotate-90' : ''}"
					/>
				</div>
			</button>
			<LogoButton
				class="{routesWithoutDrawer.includes($page.url.pathname) ? 'flex' : 'hidden'} md:flex"
			/>
			{#if $dirTree && $dirTree.length > 0}
				<div class="h-full min-w-0 flex-shrink pr-2 md:hidden">
					<div
						class="h-full w-full items-center overflow-x-auto pr-2 text-sm font-medium text-c-on-bg/75"
					>
						<div class="flex h-full items-center justify-start">
							{#each $dirTree as treeItem, index}
								<a
									class="group relative flex h-full items-center whitespace-nowrap px-2"
									href={treeItem.href}
								>
									<ButtonHoverEffect size="sm" />
									<p class="transition not-touch:group-hover:text-c-primary">{treeItem.title}</p>
								</a>
								{#if index !== $dirTree.length - 1}
									<IconChevronDown
										class="h-4 w-4 flex-shrink-0 -rotate-90 transform text-c-on-bg/50"
									/>
								{/if}
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>
		<div class="hidden md:ml-2 md:flex md:max-w-[19rem] lg:max-w-[45rem] xl:ml-0 xl:max-w-[45rem]">
			<NavigationTabBar />
		</div>
		<div class="relative flex flex-wrap items-center justify-end md:flex-1">
			<IconButton
				class="py-2"
				href={socialAppUrls.discord}
				target="_blank"
				name={$LL.Platform.Discord()}
				hasTooltip={true}
			>
				<IconSc
					type="discord"
					class="relative h-7.5 w-7.5 transform transition {$page.url.pathname === '/' &&
					$themeApp === 'light' &&
					!$notAtTheVeryTop
						? 'text-c-bg'
						: 'text-c-on-bg'} not-touch:group-hover/iconbutton:text-c-primary"
				/>
			</IconButton>
			<div class="flex items-center justify-end pl-2 pr-3.5 md:pl-2.5 md:pr-5">
				<RemainingCredits />
				<!-- Account -->
				{#if $sessionStore?.user.email && $userSummary}
					<div
						use:clickoutside={{ callback: closeAccountMenu }}
						class="relative flex flex-col items-end"
					>
						<div class="py-3.5">
							<IconButton
								class="shadow-lg ring-2 {$page.url.pathname === '/' &&
								$themeApp === 'light' &&
								!$notAtTheVeryTop
									? 'ring-c-bg/25'
									: 'ring-c-on-bg/25'} flex items-center justify-center rounded-full shadow-c-shadow/[var(--o-shadow-strong)]"
								noPadding
								name="Account"
								onClick={() => {
									toggleAccountMenu();
									if (isAccountMenuOpen && $userSummary && $userSummary.refetch) {
										$userSummary.refetch();
									}
								}}
							>
								<Avatar
									text={$userSummary.username}
									class="relative h-9 w-9 transform overflow-hidden rounded-full transition duration-250
									{$page.url.pathname === '/' && $themeApp === 'light' && !$notAtTheVeryTop
										? 'not-touch:group-hover/iconbutton:ring-c-bg'
										: 'not-touch:group-hover/iconbutton:ring-c-on-bg'} {isAccountMenuOpen
										? 'rotate-360'
										: !isAccountMenuOpen
											? 'not-touch:group-hover/iconbutton:rotate-45'
											: ''}"
								/>
							</IconButton>
						</div>
						<div class="relative -mr-1">
							{#if isAccountMenuOpen}
								<AccountMenu closeMenu={closeAccountMenu} />
							{/if}
						</div>
					</div>
				{:else}
					<div class="py-2.5">
						<Button class="-mr-1" size="xs" onClick={() => isSignInModalOpen.set(true)}>
							{$LL.SignIn.GetStartedButton()}
						</Button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</nav>

{#if $isSignInModalOpen && (!$sessionStore?.user.id || !$userSummary)}
	<SignInModal
		redirectTo={($page.url.pathname === '/' ||
		dontRedirectToRoutes.some(
			(r) =>
				r.route === $page.url.pathname || (r.notStrict && $page.url.pathname.startsWith(r.route))
		)
			? '/generate'
			: $page.url.pathname) + window.location.search}
		onClickoutside={() => isSignInModalOpen.set(false)}
	/>
{/if}
