<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Avatar from '$components/avatar/Avatar.svelte';
	import Button from '$components/buttons/Button.svelte';
	import DropdownItem from '$components/DropdownItem.svelte';
	import IconHome from '$components/icons/IconHome.svelte';
	import IconSignOut from '$components/icons/IconSignOut.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import ProductIdBadge from '$components/badges/ProductIdBadge.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { logSignOut } from '$ts/helpers/loggers';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { userSummary } from '$ts/stores/user/summary';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import { appVersion } from '$ts/stores/appVersion';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import WantEmailCard from '$components/WantsEmailCard.svelte';
	import { onMount } from 'svelte';
	import { wantsEmail } from '$ts/stores/user/wantsEmail.js';
	import IconPen from '$components/icons/IconPen.svelte';
	import WithChangeUsernameModal from '$components/WithChangeUsernameModal.svelte';
	import NoBgButton from '$components/buttons/NoBgButton.svelte';
	import SubtleButton from '$components/buttons/SubtleButton.svelte';
	import IconExternalLink from '$components/icons/IconExternalLink.svelte';
	import AccountDetailLine from '$routes/(app)/account/AccountDetailLine.svelte';
	import { getRelativeDate } from '$ts/helpers/getRelativeDate';
	import AccountPageCard from '$routes/(app)/account/AccountPageCard.svelte';
	import IconToken from '$components/icons/IconToken.svelte';

	$: if (!$page.data.session?.user.id) {
		goto(`/sign-in?redirect_to=${encodeURIComponent($page.url.pathname)}`);
	}

	async function signOut() {
		if (!$page.data.supabase) return;
		try {
			await $page.data.supabase.auth.signOut();
			userSummary.set(null);
			logSignOut({
				'SC - User Id': $page.data.session?.user.id,
				'SC - Stripe Product Id': $userSummary?.product_id,
				'SC - Locale': $locale,
				'SC - Advanced Mode': $advancedModeApp,
				'SC - Page': `${$page.url.pathname}${$page.url.search}`,
				'SC - App Version': $appVersion
			});
		} catch (error) {
			console.log(error);
		}
	}

	let mounted = false;
	let wantsEmailChecked = $userSummary?.wants_email === true ? true : false;

	$: [wantsEmailChecked], onWantsEmailCheckedChanged();
	$: [$wantsEmail], onWantsEmailChanged();

	function onWantsEmailCheckedChanged() {
		if (mounted) {
			wantsEmail.set(wantsEmailChecked);
		}
	}

	function onWantsEmailChanged() {
		if (mounted && $wantsEmail !== null && $wantsEmail !== wantsEmailChecked) {
			wantsEmailChecked = $wantsEmail;
		}
	}

	onMount(() => {
		if ($wantsEmail !== null) {
			wantsEmailChecked = $wantsEmail;
		}
		mounted = true;
	});
</script>

<MetaTag
	title="Account | Stablecog"
	description="Manage your Stablecog account. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	image_url="{canonicalUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

{#if !$page.data.session?.user.email}
	<div class="w-full flex justify-center items-center my-auto">
		<IconAnimatedSpinner class="w-10 h-10 text-c-on-bg/60" />
	</div>
{:else}
	<div class="w-full flex flex-col items-center justify-center pt-6 pb-6 md:pb-8 md:px-3">
		<div class="w-full max-w-4xl px-3">
			<AccountPageCard>
				<div class="w-full flex flex-wrap items-center gap-4 px-5 py-4 md:px-6">
					<div class="flex items-center justify-between gap-3">
						<Avatar
							text={$userSummary?.username || ''}
							class="w-8 h-8 ring-2 ring-c-on-bg/25 overflow-hidden rounded-full transition transform
							relative shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] flex-shrink-0"
						/>
						<WithChangeUsernameModal let:trigger>
							<NoBgButton class="mt-0 -ml-2" noPadding {trigger} hoverFrom="left">
								<div class="flex-shrink min-w-0 flex items-center gap-2 px-2 py-2">
									<p
										class="not-touch:group-hover:text-c-primary text-c-on-bg text-xl transition
										font-semibold flex-shrink min-w-0 overflow-hidden overflow-ellipsis"
									>
										<span
											class="text-c-on-bg/50 transition not-touch:group-hover:text-c-primary/50 font-normal"
											>@</span
										>{$userSummary?.username}
									</p>
									<IconPen
										class="w-3.5 h-3.5 text-c-on-bg/50 transition not-touch:group-hover:text-c-primary/50 flex-shrink-0"
									/>
								</div>
							</NoBgButton>
						</WithChangeUsernameModal>
					</div>
					<SubtleButton target="_blank" href="/user/{$userSummary?.username}">
						<div class="flex items-center gap-2 px-1">
							<p class="text-base font-semibold flex flex-shrink min-w-0">
								{$LL.Shared.VisitProfileButton()}
							</p>
							<IconExternalLink class="text-c-on-bg w-6 h-6 -mr-1" />
						</div>
					</SubtleButton>
				</div>
				<AccountDetailLine title={$LL.Shared.EmailInput.Placeholder()}>
					<NoBgButton noPadding class="-mx-3 -my-3" href="/account/change-email" hoverFrom="left">
						<div class="flex-shrink min-w-0 flex items-center gap-2 px-4 py-3.5">
							<p
								class="not-touch:group-hover:text-c-primary text-c-on-bg transition
								font-semibold flex-shrink min-w-0 overflow-hidden overflow-ellipsis text-left"
							>
								{$page.data.session.user.email}
							</p>
							<IconPen
								class="w-3.5 h-3.5 text-c-on-bg/50 transition not-touch:group-hover:text-c-primary/50 flex-shrink-0"
							/>
						</div>
					</NoBgButton>
				</AccountDetailLine>
				<AccountDetailLine title={$LL.Account.RemainingCreditsTitle()}>
					<div class="flex items-center justify-start px-1">
						<IconToken class="w-4.5 h-4.5 -ml-1 flex-shrink-0" />
						<p class="font-semibold text-left">
							{($userSummary?.total_remaining_credits || 0).toLocaleString($locale)}
						</p>
					</div>
				</AccountDetailLine>
				{#if ($userSummary?.renews_at && $userSummary?.renews_at_credit_amount) || ($userSummary?.more_free_credits_at && $userSummary?.more_free_credits_at_credit_amount)}
					<AccountDetailLine title={$LL.Account.UpcomingCreditsTitle()}>
						<div class="flex items-center justify-start px-1">
							<IconToken class="w-4.5 h-4.5 -ml-1 flex-shrink-0 text-c-on-bg" />
							<p class="font-semibold text-left text-c-on-bg">
								{$userSummary.renews_at_credit_amount ??
									$userSummary.more_free_credits_at_credit_amount}&nbsp;&nbsp;<span
									class="bg-c-on-bg/10 text-c-on-bg/75 rounded-md px-1.75 py-1 font-medium text-sm align-middle"
								>
									{getRelativeDate({
										date: $userSummary.renews_at ?? $userSummary.more_free_credits_at,
										locale: $locale,
										dateStyle: 'long'
									})}</span
								>
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
									class="max-w-full bg-c-bg p-3px absolute -right-2.5 -top-4.5 z-10 flex items-center justify-center rounded-md pointer-events-none"
								>
									<p
										class="w-full whitespace-nowrap overflow-hidden overflow-ellipsis text-center text-xs rounded
										font-semibold px-1 {$userSummary.renews_at
											? 'bg-c-success/15 text-c-success ring-c-success/35'
											: 'bg-c-danger/15 text-c-danger ring-c-danger/35'} ring-1"
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
						<p class="text-left font-semibold px-1">
							{getRelativeDate({
								date: $userSummary.renews_at ?? $userSummary.cancels_at,
								locale: $locale
							})}
						</p>
					</AccountDetailLine>
				{/if}
				<AccountDetailLine id="manage" title={$LL.Account.ManageSubscriptionTitle()}>
					{#if $userSummary?.product_id}
						<div class="w-full md:w-auto flex flex-wrap items-center gap-2.5 md:-my-0.75">
							<Button
								noPadding
								class="w-full md:w-auto px-4.5 py-3.5"
								size="sm"
								href={$page.data.customer_portal_url}
							>
								{$LL.Account.ManageSubscriptionButton()}
							</Button>
							<Button noPadding class="w-full md:w-auto px-4.5 py-3.5" size="sm" href={'/pricing'}>
								{$LL.Account.ComparePlansButton()}
							</Button>
						</div>
					{:else}
						<Button
							noPadding
							class="w-full md:w-auto px-4.5 py-3.5 md:-my-0.75"
							size="sm"
							href="/pricing"
						>
							{$LL.Pricing.SubscribeButton()}
						</Button>
					{/if}
				</AccountDetailLine>
				<div class="w-full h-2px bg-c-bg-secondary" />
				<div class="w-full flex justify-start items-center">
					<WantEmailCard
						bg="primary"
						bind:checked={wantsEmailChecked}
						oneLine
						padding="p-5 md:px-6"
					/>
				</div>
				<div class="w-full h-2px bg-c-bg-secondary" />
				<div class="w-full flex flex-wrap items-stretch">
					<DropdownItem href="/generate" class="w-full md:w-auto md:flex-1">
						<div
							class="flex transition justify-center items-center gap-2 text-c-on-bg
							not-touch:group-hover:text-c-primary"
						>
							<IconHome class="w-6 h-6" />
							<p>{$LL.Shared.GoHomeButton()}</p>
						</div>
					</DropdownItem>
					<div class="w-full h-2px md:h-auto md:w-2px bg-c-bg-secondary" />
					<DropdownItem onClick={signOut} class="w-full md:w-auto md:flex-1">
						<div
							class="flex transition justify-center items-center gap-2 text-c-on-bg
							not-touch:group-hover:text-c-primary"
						>
							<IconSignOut class="w-6 h-6" />
							<p>{$LL.SignIn.SignOutButton()}</p>
						</div>
					</DropdownItem>
				</div>
			</AccountPageCard>
		</div>
	</div>
{/if}
