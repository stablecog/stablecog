<script lang="ts">
	import { page } from '$app/stores';
	import ProductIdBadge from '$components/badges/ProductIdBadge.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { userSummary } from '$ts/stores/user/summary';
	import Button from '$components/primitives/buttons/Button.svelte';
	import { isGalleryAdmin, isSuperAdmin } from '$ts/helpers/admin/roles';
	import DropdownItem from '$components/primitives/dropdown/DropdownItem.svelte';
	import IconWrench from '$components/icons/IconWrench.svelte';
	import IconUser from '$components/icons/IconUser.svelte';
	import { logSignOut } from '$ts/helpers/loggers';
	import IconSignOut from '$components/icons/IconSignOut.svelte';
	import { appVersion } from '$ts/stores/appVersion';
	import IconSettings from '$components/icons/IconSettings.svelte';
	import type { TAccountDropdownPage } from '$components/accountMenu/types';
	import PageWrapper from '$components/accountMenu/PageWrapper.svelte';
	import IconCommandLine from '$components/icons/IconCommandLine.svelte';
	import IconProfile from '$components/icons/IconProfile.svelte';
	import IconToken from '$components/icons/IconToken.svelte';
	import { sessionStore, supabaseStore } from '$ts/constants/supabase';

	export let setAccountMenuDropdownPage: (p: TAccountDropdownPage) => void;
	export let closeMenu: () => void;
	export let height: number;
	export let currentPage: TAccountDropdownPage;

	let isSigningOut = false;
</script>

<PageWrapper bind:height {currentPage} thisPage="account">
	{#if $userSummary}
		<div class="flex w-full flex-col px-4.5 pb-5 pt-4">
			<ProductIdBadge
				onClick={closeMenu}
				href="/pricing"
				class="mt-0.25 w-full"
				productId={$userSummary.product_id}
			/>
			{#if !$userSummary.product_id}
				<Button onClick={closeMenu} class="mt-2 w-full" href="/pricing" size="sm">
					{$LL.Pricing.SubscribeButton()}
				</Button>
			{:else}
				<Button onClick={closeMenu} class="mt-2 w-full" href="/pricing#credit-packs" size="sm">
					{$LL.Pricing.BuyCreditsButton()}
				</Button>
			{/if}
		</div>
		<div class="relative z-20 w-full">
			<div class="h-2px w-full rounded-full bg-c-bg-tertiary" />
		</div>
		<div class="flex w-full flex-col px-5 py-3">
			<p class="w-full text-sm font-medium text-c-on-bg/50">
				{$LL.Account.RemainingCreditsTitle()}
			</p>
			<div class="mt-0.5 flex w-full items-center justify-start">
				<IconToken class="-ml-1 h-5 w-5 flex-shrink-0" />
				<p class="text-lg font-bold">
					{$userSummary.total_remaining_credits.toLocaleString($locale)}
				</p>
			</div>
		</div>
	{/if}
	<div class="relative z-20 w-full">
		<div class="h-2px w-full rounded-full bg-c-bg-tertiary" />
	</div>
	<div class="flex w-full flex-col justify-start">
		{#if isSuperAdmin($userSummary?.roles || []) || isGalleryAdmin($userSummary?.roles || [])}
			<DropdownItem href="/admin" onClick={closeMenu}>
				<div class="flex min-w-0 flex-1 items-center justify-start gap-2.5">
					<IconWrench class="text-c-text h-6 w-6 transition not-touch:group-hover:text-c-primary" />
					<p
						class="min-w-0 flex-1 overflow-hidden overflow-ellipsis text-left text-c-on-bg transition not-touch:group-hover:text-c-primary"
					>
						{$LL.Admin.AdminTab()}
					</p>
				</div>
			</DropdownItem>
		{/if}
		<DropdownItem href="/account" onClick={closeMenu}>
			<div class="flex min-w-0 flex-1 items-center justify-start gap-2.5">
				<IconUser class="text-c-text h-6 w-6 transition not-touch:group-hover:text-c-primary" />
				<p
					class="min-w-0 flex-1 overflow-hidden overflow-ellipsis text-left text-c-on-bg
					transition not-touch:group-hover:text-c-primary"
				>
					{$LL.Account.AccountButton()}
				</p>
			</div>
		</DropdownItem>
		<DropdownItem href="/{$userSummary?.username}" onClick={closeMenu}>
			<div class="flex min-w-0 flex-1 items-center justify-start gap-2.5">
				<IconProfile class="text-c-text h-6 w-6 transition not-touch:group-hover:text-c-primary" />
				<p
					class="min-w-0 flex-1 overflow-hidden overflow-ellipsis text-left text-c-on-bg
					transition not-touch:group-hover:text-c-primary"
				>
					{$LL.Shared.ProfileButton()}
				</p>
			</div>
		</DropdownItem>
		<DropdownItem onClick={() => setAccountMenuDropdownPage('settings')}>
			<div class="flex min-w-0 flex-1 items-center justify-start gap-2.5">
				<IconSettings class="text-c-text h-6 w-6 transition not-touch:group-hover:text-c-primary" />
				<p
					class="min-w-0 flex-1 overflow-hidden overflow-ellipsis text-left text-c-on-bg
					transition not-touch:group-hover:text-c-primary"
				>
					{$LL.Settings.Title()}
				</p>
			</div>
		</DropdownItem>
		<DropdownItem
			withSpinner
			loading={isSigningOut}
			onClick={async () => {
				if (!$supabaseStore) return;
				try {
					isSigningOut = true;
					await $supabaseStore.auth.signOut();
					userSummary.set(null);
					logSignOut({
						'SC - User Id': $sessionStore?.user.id,
						'SC - Stripe Product Id': $userSummary?.product_id,
						'SC - Locale': $locale,
						'SC - Page': `${$page.url.pathname}${$page.url.search}`,
						'SC - App Version': $appVersion
					});
					isSigningOut = false;
					closeMenu();
				} catch (error) {
					console.log(error);
					isSigningOut = false;
				}
			}}
		>
			<div class="flex min-w-0 flex-1 items-center justify-start gap-2.5">
				<IconSignOut class="text-c-text h-6 w-6 transition not-touch:group-hover:text-c-primary" />
				<p
					class="min-w-0 flex-1 overflow-hidden overflow-ellipsis text-left text-c-on-bg transition not-touch:group-hover:text-c-primary"
				>
					{$LL.SignIn.SignOutButton()}
				</p>
			</div>
		</DropdownItem>
	</div>
</PageWrapper>
