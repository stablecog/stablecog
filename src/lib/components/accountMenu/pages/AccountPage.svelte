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
		<div class="w-full flex flex-col px-4.5 pt-4 pb-5">
			<ProductIdBadge
				onClick={closeMenu}
				href="/pricing"
				class="w-full mt-0.25"
				productId={$userSummary.product_id}
			/>
			{#if !$userSummary.product_id}
				<Button onClick={closeMenu} class="w-full mt-2" href="/pricing" size="sm">
					{$LL.Pricing.SubscribeButton()}
				</Button>
			{:else}
				<Button onClick={closeMenu} class="w-full mt-2" href="/pricing#credit-packs" size="sm">
					{$LL.Pricing.BuyCreditsButton()}
				</Button>
			{/if}
		</div>
		<div class="w-full relative z-20">
			<div class="w-full h-2px rounded-full bg-c-bg-tertiary" />
		</div>
		<div class="w-full flex flex-col px-5 py-3">
			<p class="w-full text-c-on-bg/50 font-medium text-sm">
				{$LL.Account.RemainingCreditsTitle()}
			</p>
			<div class="w-full flex items-center justify-start mt-0.5">
				<IconToken class="w-5 h-5 -ml-1 flex-shrink-0" />
				<p class="font-bold text-lg">
					{$userSummary.total_remaining_credits.toLocaleString($locale)}
				</p>
			</div>
		</div>
	{/if}
	<div class="w-full relative z-20">
		<div class="w-full h-2px rounded-full bg-c-bg-tertiary" />
	</div>
	<div class="w-full flex flex-col justify-start">
		{#if isSuperAdmin($userSummary?.roles || []) || isGalleryAdmin($userSummary?.roles || [])}
			<DropdownItem href="/admin" onClick={closeMenu}>
				<div class="flex-1 min-w-0 flex items-center justify-start gap-2.5">
					<IconWrench class="transition w-6 h-6 text-c-text not-touch:group-hover:text-c-primary" />
					<p
						class="flex-1 min-w-0 overflow-hidden overflow-ellipsis text-left transition text-c-on-bg not-touch:group-hover:text-c-primary"
					>
						{$LL.Admin.AdminTab()}
					</p>
				</div>
			</DropdownItem>
		{/if}
		<DropdownItem href="/account" onClick={closeMenu}>
			<div class="flex-1 min-w-0 flex items-center justify-start gap-2.5">
				<IconUser class="transition w-6 h-6 text-c-text not-touch:group-hover:text-c-primary" />
				<p
					class="flex-1 min-w-0 overflow-hidden overflow-ellipsis text-left transition
					text-c-on-bg not-touch:group-hover:text-c-primary"
				>
					{$LL.Account.AccountButton()}
				</p>
			</div>
		</DropdownItem>
		<DropdownItem href="/{$userSummary?.username}" onClick={closeMenu}>
			<div class="flex-1 min-w-0 flex items-center justify-start gap-2.5">
				<IconProfile class="transition w-6 h-6 text-c-text not-touch:group-hover:text-c-primary" />
				<p
					class="flex-1 min-w-0 overflow-hidden overflow-ellipsis text-left transition
					text-c-on-bg not-touch:group-hover:text-c-primary"
				>
					{$LL.Shared.ProfileButton()}
				</p>
			</div>
		</DropdownItem>
		<DropdownItem onClick={() => setAccountMenuDropdownPage('settings')}>
			<div class="flex-1 min-w-0 flex items-center justify-start gap-2.5">
				<IconSettings class="transition w-6 h-6 text-c-text not-touch:group-hover:text-c-primary" />
				<p
					class="flex-1 min-w-0 overflow-hidden overflow-ellipsis text-left transition
					text-c-on-bg not-touch:group-hover:text-c-primary"
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
			<div class="flex-1 min-w-0 flex items-center justify-start gap-2.5">
				<IconSignOut class="transition w-6 h-6 text-c-text not-touch:group-hover:text-c-primary" />
				<p
					class="flex-1 min-w-0 overflow-hidden overflow-ellipsis text-left transition text-c-on-bg not-touch:group-hover:text-c-primary"
				>
					{$LL.SignIn.SignOutButton()}
				</p>
			</div>
		</DropdownItem>
	</div>
</PageWrapper>
