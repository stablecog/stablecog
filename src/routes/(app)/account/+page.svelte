<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Avatar from '$components/avatar/Avatar.svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import DropdownItem from '$components/primitives/dropdown/DropdownItem.svelte';
	import IconHome from '$components/icons/IconHome.svelte';
	import IconSignOut from '$components/icons/IconSignOut.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import ProductIdBadge from '$components/badges/ProductIdBadge.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { logSignOut } from '$ts/helpers/loggers';
	import { userSummary } from '$ts/stores/user/summary';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import { appVersion } from '$ts/stores/appVersion';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import WantsEmailCard from '$components/cards/WantsEmailCard.svelte';
	import { onMount } from 'svelte';
	import { wantsEmail } from '$ts/stores/user/wantsEmail.js';
	import IconPen from '$components/icons/IconPen.svelte';
	import WithChangeUsernameModal from '$components/utils/WithChangeUsernameModal.svelte';
	import NoBgButton from '$components/primitives/buttons/NoBgButton.svelte';
	import SubtleButton from '$components/primitives/buttons/SubtleButton.svelte';
	import IconExternalLink from '$components/icons/IconExternalLink.svelte';
	import AccountDetailLine from '$routes/(app)/account/AccountDetailLine.svelte';
	import { getRelativeDate } from '$ts/helpers/getRelativeDate';
	import AccountPageCard from '$routes/(app)/account/AccountPageCard.svelte';
	import IconToken from '$components/icons/IconToken.svelte';
	import { sessionStore, supabaseStore } from '$ts/constants/supabase';
	import { writable } from 'svelte/store';

	$: if (!$sessionStore?.user.id) {
		goto(`/sign-in?rd_to=${encodeURIComponent($page.url.pathname)}`);
	}

	async function signOut() {
		if (!$supabaseStore) return;
		try {
			await $supabaseStore.auth.signOut();
			userSummary.set(null);
			logSignOut({
				'SC - User Id': $sessionStore?.user.id,
				'SC - Stripe Product Id': $userSummary?.product_id,
				'SC - Locale': $locale,
				'SC - Page': `${$page.url.pathname}${$page.url.search}`,
				'SC - App Version': $appVersion
			});
		} catch (error) {
			console.log(error);
		}
	}

	let mounted = false;
	let wantsEmailChecked = writable($userSummary?.wants_email === true ? true : false);

	$: [$wantsEmailChecked], onWantsEmailCheckedChanged();
	$: [$wantsEmail], onWantsEmailChanged();

	function onWantsEmailCheckedChanged() {
		if (mounted) {
			wantsEmail.set($wantsEmailChecked);
		}
	}

	function onWantsEmailChanged() {
		if (mounted && $wantsEmail !== null && $wantsEmail !== $wantsEmailChecked) {
			wantsEmailChecked.set($wantsEmail);
		}
	}

	onMount(() => {
		if ($wantsEmail !== null) {
			wantsEmailChecked.set($wantsEmail);
		}
		mounted = true;
	});
</script>

<MetaTag
	title="Account | Stablecog"
	description="Manage your Stablecog account. Free, multilingual and open-source AI image generator using Stable Diffusion, FLUX, and Kandinsky."
	image_url="{canonicalUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

{#if !$sessionStore?.user.email}
	<div class="my-auto flex w-full items-center justify-center">
		<IconAnimatedSpinner class="h-10 w-10 text-c-on-bg/60" />
	</div>
{:else}
	<div class="flex w-full flex-col items-center justify-center pb-6 pt-6 md:px-3 md:pb-8">
		<div class="w-full max-w-4xl px-3">
			<AccountPageCard>
				<div class="flex w-full flex-wrap items-center gap-4 px-5 py-4 md:px-6">
					<div class="flex items-center justify-between gap-3">
						<Avatar
							text={$userSummary?.username || ''}
							class="relative h-8 w-8 flex-shrink-0 transform overflow-hidden rounded-full shadow-lg
							shadow-c-shadow/[var(--o-shadow-strong)] ring-2 ring-c-on-bg/25 transition"
						/>
						<WithChangeUsernameModal let:trigger>
							<NoBgButton class="-ml-2 mt-0" noPadding {trigger} hoverFrom="left">
								<div class="flex min-w-0 flex-shrink items-center gap-2 px-2 py-2">
									<p
										class="min-w-0 flex-shrink overflow-hidden overflow-ellipsis
										text-xl font-semibold text-c-on-bg transition not-touch:group-hover:text-c-primary"
									>
										<span
											class="font-normal text-c-on-bg/50 transition not-touch:group-hover:text-c-primary/50"
											>@</span
										>{$userSummary?.username}
									</p>
									<IconPen
										class="h-3.5 w-3.5 flex-shrink-0 text-c-on-bg/50 transition not-touch:group-hover:text-c-primary/50"
									/>
								</div>
							</NoBgButton>
						</WithChangeUsernameModal>
					</div>
					<Button
						noPadding
						size="sm"
						class="px-3.5 py-3 md:w-auto"
						type="subtle"
						target="_blank"
						href="/{$userSummary?.username}"
					>
						<div class="flex items-center gap-2">
							<p class="flex min-w-0 flex-shrink font-semibold">
								{$LL.Shared.VisitProfileButton()}
							</p>
							<IconExternalLink class="-my-0.5 -mr-1 h-6 w-6 text-c-on-bg" />
						</div>
					</Button>
				</div>
				<AccountDetailLine title={$LL.Shared.EmailInput.Placeholder()}>
					<NoBgButton noPadding class="-mx-3 -my-3" href="/account/change-email" hoverFrom="left">
						<div class="flex min-w-0 flex-shrink items-center gap-2 px-4 py-3.5">
							<p
								class="min-w-0 flex-shrink overflow-hidden
								overflow-ellipsis text-left font-semibold text-c-on-bg transition not-touch:group-hover:text-c-primary"
							>
								{$sessionStore.user.email}
							</p>
							<IconPen
								class="h-3.5 w-3.5 flex-shrink-0 text-c-on-bg/50 transition not-touch:group-hover:text-c-primary/50"
							/>
						</div>
					</NoBgButton>
				</AccountDetailLine>
				<AccountDetailLine title={$LL.Account.RemainingCreditsTitle()}>
					<div class="flex flex-row items-center justify-start">
						<div class="flex items-center justify-start px-1">
							<IconToken class="-ml-1 h-4.5 w-4.5 flex-shrink-0" />
							<p class="text-left font-semibold">
								{($userSummary?.total_remaining_credits || 0).toLocaleString($locale)}
							</p>
						</div>
						{#if $userSummary?.product_id}
							<Button
								noPadding
								noRounding
								class="-my-0.75 ml-2.5 w-full rounded-lg px-3 py-1.75 md:w-auto"
								size="sm"
								href="/pricing#credit-packs"
							>
								{$LL.Pricing.BuyCreditsButton()}
							</Button>
						{/if}
					</div>
				</AccountDetailLine>
				{#if ($userSummary?.renews_at && $userSummary?.renews_at_credit_amount) || ($userSummary?.more_free_credits_at && $userSummary?.more_free_credits_at_credit_amount)}
					<AccountDetailLine title={$LL.Account.UpcomingCreditsTitle()}>
						<div class="flex items-center justify-start">
							<div class="flex items-center justify-start px-1">
								<IconToken class="-ml-1 h-4.5 w-4.5 flex-shrink-0 text-c-on-bg" />
								<p class="text-left font-semibold text-c-on-bg">
									{$userSummary.renews_at_credit_amount ??
										$userSummary.more_free_credits_at_credit_amount}
								</p>
							</div>
							<p
								class="ml-1.5 rounded-md bg-c-on-bg/10 px-1.75 py-0.5 align-middle text-sm font-medium text-c-on-bg/75"
							>
								{getRelativeDate({
									date: $userSummary.renews_at ?? $userSummary.more_free_credits_at,
									locale: $locale,
									dateStyle: 'long'
								})}
							</p>
						</div>
					</AccountDetailLine>
				{/if}
				<AccountDetailLine title={$LL.Account.SubscriptionPlanTitle()}>
					<div class="flex items-center py-1.5">
						<div class="relative flex items-center">
							<ProductIdBadge
								class="-my-1.5"
								href="/pricing#plans"
								productId={$userSummary?.product_id}
								size="lg"
							/>
							{#if $userSummary?.product_id && ($userSummary.renews_at || $userSummary.cancels_at)}
								<div
									class="pointer-events-none absolute -right-2 -top-4 z-10 flex max-w-full items-center justify-center rounded-md bg-c-bg p-1.5px"
								>
									<p
										class="w-full overflow-hidden overflow-ellipsis whitespace-nowrap rounded px-1 text-center
										text-xs font-semibold {$userSummary.renews_at
											? 'bg-c-success/15 text-c-success ring-c-success/35'
											: 'bg-c-danger/15 text-c-danger ring-c-danger/35'} ring-1.5"
									>
										{$userSummary.renews_at
											? $LL.Account.Subscription.Status.ActiveTitle()
											: $LL.Account.Subscription.Status.CancellingTitle()}
									</p>
								</div>
							{/if}
						</div>
					</div>
				</AccountDetailLine>
				{#if $userSummary?.product_id && ($userSummary.renews_at || $userSummary.cancels_at)}
					<AccountDetailLine
						title={$userSummary.renews_at
							? $LL.Account.SubscriptionRenewalTitle()
							: $LL.Account.SubscriptionCancellationTitle()}
					>
						<p class="px-1 text-left font-semibold">
							{getRelativeDate({
								date: $userSummary.renews_at ?? $userSummary.cancels_at,
								locale: $locale
							})}
						</p>
					</AccountDetailLine>
				{/if}
				<AccountDetailLine id="manage" title={$LL.Account.ManageSubscriptionTitle()}>
					{#if $userSummary?.product_id}
						<div class="flex w-full flex-wrap items-center gap-2.5 md:-my-0.75 md:w-auto">
							<Button
								noPadding
								class="w-full px-3.5 py-3 md:w-auto"
								size="sm"
								href={$page.data.customer_portal_url}
							>
								{$LL.Account.ManageSubscriptionButton()}
							</Button>
							<Button
								noPadding
								type="subtle"
								class="w-full px-3.5 py-3 md:order-first md:w-auto"
								size="sm"
								href={'/pricing'}
							>
								{$LL.Account.ComparePlansButton()}
							</Button>
						</div>
					{:else}
						<Button
							noPadding
							class="w-full px-4.5 py-3 md:-my-0.75 md:w-auto"
							size="sm"
							href="/pricing"
						>
							{$LL.Pricing.SubscribeButton()}
						</Button>
					{/if}
				</AccountDetailLine>
				<div class="h-2px w-full bg-c-bg-secondary" />
				<div class="flex w-full items-center justify-start">
					<WantsEmailCard
						bg="primary"
						bind:checked={wantsEmailChecked}
						oneLine
						padding="p-5 md:px-6"
					/>
				</div>
				<div class="h-2px w-full bg-c-danger/15" />
				<div
					id="delete"
					class="flex w-full flex-wrap items-center justify-between gap-4 bg-c-danger/5 px-4 py-5 md:px-5"
				>
					<div class="flex flex-col px-1 md:-my-0.75 md:max-w-128">
						<p class="font-semibold text-c-danger">{$LL.Account.DeleteAccountTitle()}</p>
						<p class="mt-0.5 text-c-on-bg/75">{$LL.Account.DeleteAccountParagraph()}</p>
					</div>
					<Button
						noPadding
						type="danger"
						class="w-full px-4.5 py-3 md:-my-0.75 md:w-auto"
						size="sm"
						target="_blank"
						href="mailto:privacy@stablecog.com?subject=Delete%20my%20account&body=Please%20delete%20my%20account."
					>
						{$LL.Account.RequestDeletionButton()}
					</Button>
				</div>
				<div class="h-2px w-full bg-c-danger/15" />
				<div class="flex w-full flex-wrap items-stretch">
					<DropdownItem href="/generate" class="w-full md:w-auto md:flex-1">
						<div
							class="flex items-center justify-center gap-2 text-c-on-bg transition
							not-touch:group-hover:text-c-primary"
						>
							<IconHome class="h-6 w-6" />
							<p>{$LL.Shared.GoHomeButton()}</p>
						</div>
					</DropdownItem>
					<div class="h-2px w-full bg-c-bg-secondary md:h-auto md:w-2px" />
					<DropdownItem onClick={signOut} class="w-full md:w-auto md:flex-1">
						<div
							class="flex items-center justify-center gap-2 text-c-on-bg transition
							not-touch:group-hover:text-c-primary"
						>
							<IconSignOut class="h-6 w-6" />
							<p>{$LL.SignIn.SignOutButton()}</p>
						</div>
					</DropdownItem>
				</div>
			</AccountPageCard>
		</div>
	</div>
{/if}
