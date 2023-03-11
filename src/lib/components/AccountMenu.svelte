<script lang="ts">
	import { page } from '$app/stores';
	import Avatar from '$components/Avatar.svelte';
	import Button from '$components/buttons/Button.svelte';
	import DropdownItem from '$components/DropdownItem.svelte';
	import IconSignOut from '$components/icons/IconSignOut.svelte';
	import IconUser from '$components/icons/IconUser.svelte';
	import IconWrench from '$components/icons/IconWrench.svelte';
	import ProductIdBadge from '$components/badges/ProductIdBadge.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { supabase } from '$ts/constants/supabase';
	import { isGalleryAdmin, isSuperAdmin } from '$ts/helpers/admin/roles';
	import { logSignOut } from '$ts/helpers/loggers';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { userSummary } from '$ts/stores/user/summary';
	import DropdownWrapper from './DropdownWrapper.svelte';

	export let closeAccountMenu: () => void;
</script>

<DropdownWrapper class="w-72 max-w-[calc(100vw-1.75rem)]">
	<div class="w-full flex gap-4 items-center px-5 py-4">
		<div
			class="w-9 h-9 ring-2 ring-c-on-bg/25 overflow-hidden rounded-full transition transform 
			relative shadow-lg shadow-c-shadow/[var(--o-shadow-strong)]"
		>
			<Avatar str={$page.data.session?.user.email || ''} class="w-full h-full relative" />
		</div>
		<div class="min-w-0 flex-1 flex flex-col -mt-0.5">
			<p class="flex-1 min-w-0 overflow-hidden overflow-ellipsis font-bold text-xl">Account</p>
			<p
				class="flex-1 min-w-0 overflow-hidden overflow-ellipsis font-semibold text-xs text-c-on-bg/50 mt-0.5"
			>
				{$page.data.session?.user.email}
			</p>
		</div>
	</div>
	{#if $userSummary}
		<div class="w-full flex justify-stretch px-5 py-1 -mt-1">
			{#if $userSummary.product_id}
				<ProductIdBadge
					href="/account"
					class="w-full mt-0.25"
					productId={$userSummary.product_id}
				/>
			{:else}
				<Button class="w-full mt-0.25" href="/pricing" size="sm">
					{$LL.Pricing.SubscribeButton()}
				</Button>
			{/if}
		</div>
		<div class="w-full relative z-20 mt-4">
			<div class="w-full h-2px rounded-full bg-c-bg-tertiary" />
		</div>
		<div class="w-full flex flex-col items-start px-5 py-3">
			<p class="text-c-on-bg/50 text-xs">{$LL.Account.RemainingImagesTitle()}</p>
			<p class="font-bold text-lg mt-1">
				{$userSummary.total_remaining_credits.toLocaleString($locale)}
			</p>
		</div>
	{/if}
	<div class="w-full relative z-20">
		<div class="w-full h-2px rounded-full bg-c-bg-tertiary" />
	</div>
	<div class="w-full flex flex-col justify-start">
		{#if isSuperAdmin($userSummary?.roles || []) || isGalleryAdmin($userSummary?.roles || [])}
			<DropdownItem href="/admin" onClick={closeAccountMenu}>
				<div class="flex-1 min-w-0 flex items-center justify-start gap-2.5">
					<IconWrench
						class="transition w-6 h-6 text-c-text {!$isTouchscreen
							? 'group-hover:text-c-primary'
							: ''}"
					/>
					<p
						class="flex-1 min-w-0 overflow-hidden overflow-ellipsis text-left transition text-c-on-bg {!$isTouchscreen
							? 'group-hover:text-c-primary'
							: ''}"
					>
						{$LL.Admin.AdminTab()}
					</p>
				</div>
			</DropdownItem>
		{/if}
		<DropdownItem href="/account" onClick={closeAccountMenu}>
			<div class="flex-1 min-w-0 flex items-center justify-start gap-2.5">
				<IconUser
					class="transition w-6 h-6 text-c-text {!$isTouchscreen
						? 'group-hover:text-c-primary'
						: ''}"
				/>
				<p
					class="flex-1 min-w-0 overflow-hidden overflow-ellipsis text-left transition text-c-on-bg {!$isTouchscreen
						? 'group-hover:text-c-primary'
						: ''}"
				>
					{$LL.Account.ManageAccountButton()}
				</p>
			</div>
		</DropdownItem>
		<DropdownItem
			onClick={async () => {
				closeAccountMenu();
				try {
					await supabase.auth.signOut();
					logSignOut({
						'SC - Stripe Product Id': $userSummary?.product_id,
						'SC - Locale': $locale,
						'SC - Advanced Mode': $advancedModeApp,
						'SC - Page': `${$page.url.pathname}${$page.url.search}`
					});
				} catch (error) {
					console.log(error);
				}
			}}
		>
			<div class="flex-1 min-w-0 flex items-center justify-start gap-2.5">
				<IconSignOut
					class="transition w-6 h-6 text-c-text {!$isTouchscreen
						? 'group-hover:text-c-primary'
						: ''}"
				/>
				<p
					class="flex-1 min-w-0 overflow-hidden overflow-ellipsis text-left transition text-c-on-bg {!$isTouchscreen
						? 'group-hover:text-c-primary'
						: ''}"
				>
					{$LL.SignIn.SignOutButton()}
				</p>
			</div>
		</DropdownItem>
	</div>
</DropdownWrapper>
