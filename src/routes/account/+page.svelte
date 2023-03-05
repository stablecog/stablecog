<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Avatar from '$components/Avatar.svelte';
	import Button from '$components/buttons/Button.svelte';
	import DropdownItem from '$components/DropdownItem.svelte';
	import IconHome from '$components/icons/IconHome.svelte';
	import IconLoading from '$components/icons/IconLoading.svelte';
	import IconSignOut from '$components/icons/IconSignOut.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import PageWrapper from '$components/PageWrapper.svelte';
	import ProductIdBadge from '$components/ProductIdBadge.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { supabase } from '$ts/constants/supabase';
	import { mLogSignOut } from '$ts/helpers/loggers';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { userSummary } from '$ts/stores/user/summary';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	$: if (!$page.data.session?.user.id) {
		goto(`/sign-in?redirect_to=${encodeURIComponent($page.url.pathname)}`);
	}

	async function signOut() {
		try {
			await supabase.auth.signOut();
			mLogSignOut({
				'SC - Stripe Product Id': $userSummary?.product_id,
				'SC - Locale': $locale,
				'SC - Advanced Mode': $advancedModeApp,
				'SC - Page': `${$page.url.pathname}${$page.url.search}`
			});
		} catch (error) {
			console.log(error);
		}
	}
</script>

<MetaTag
	title="Account | Stablecog"
	description="Manage your Stablecog account."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<PageWrapper>
	{#if !$page.data.session?.user.email}
		<div class="w-full flex justify-center items-center my-auto">
			<IconLoading class="w-10 h-10 text-c-on-bg/50 animate-spin-faster" />
		</div>
	{:else}
		<div class="w-full flex flex-col items-center justify-center my-auto">
			<h1 class="text-4xl font-bold">{$LL.Account.PageTitle()}</h1>
			<div
				class="w-full max-w-md md:max-w-xl mt-6 flex flex-col rounded-2xl bg-c-bg overflow-hidden relative z-0 
				shadow-xl shadow-c-shadow/[var(--o-shadow-strong)] ring-2 ring-c-bg-secondary"
			>
				<div class="w-full flex items-center gap-4 px-5 py-4 md:p-6 overflow-hidden">
					<div
						class="w-9 h-9 ring-2 ring-c-on-bg/25 overflow-hidden rounded-full transition transform 
						relative shadow-lg shadow-c-shadow/[var(--o-shadow-strong)]"
					>
						<Avatar str={$page.data.session?.user.email || ''} class="w-full h-full relative" />
					</div>
					<p class="font-semibold flex-shrink overflow-hidden overflow-ellipsis">
						{$page.data.session.user.email}
					</p>
				</div>
				<div class="w-full h-2px bg-c-bg-secondary" />
				<div
					class="w-full flex flex-wrap items-center justify-between px-4 py-5 md:p-5 gap-5 md:gap-8"
				>
					<div class="flex flex-col items-start px-0.5 -mt-2">
						<p class="text-c-on-bg/60 font-semibold px-1">
							{$LL.Account.SubscriptionPlanTitle()}
						</p>
						<ProductIdBadge class="mt-2" productId={$userSummary?.product_id} size="lg" />
					</div>
					<Button
						class="w-full md:w-auto"
						size="sm"
						href={data.customer_portal_url && $userSummary?.product_id
							? data.customer_portal_url
							: '/pricing'}
					>
						{$userSummary?.product_id
							? $LL.Account.ManageSubscriptionButton()
							: $LL.Pricing.SubscribeButton()}
					</Button>
				</div>
				<div class="w-full h-2px bg-c-bg-secondary" />
				<div class="w-full flex flex-col">
					<div class="w-full flex items-center flex-wrap justify-between py-5 gap-2">
						<p class="font-semibold text-c-on-bg/60 px-5 md:px-6">Remaining Images</p>
						<p class="font-bold text-right text-xl px-5 md:px-6">
							{($userSummary?.total_remaining_credits || 0).toLocaleString($locale)}
						</p>
					</div>
				</div>
				<div class="w-full h-2px bg-c-bg-secondary" />
				<div class="w-full flex flex-wrap items-stretch">
					<DropdownItem href="/" class="w-full md:w-auto md:flex-1">
						<div
							class="flex transition justify-center items-center gap-2 text-c-on-bg {!$isTouchscreen
								? 'group-hover:text-c-primary'
								: ''}"
						>
							<IconHome class="w-6 h-6" />
							<p>{$LL.Shared.GoHomeButton()}</p>
						</div>
					</DropdownItem>
					<div class="w-full h-2px md:h-auto md:w-2px bg-c-bg-secondary" />
					<DropdownItem onClick={signOut} class="w-full md:w-auto md:flex-1">
						<div
							class="flex transition justify-center items-center gap-2 text-c-on-bg {!$isTouchscreen
								? 'group-hover:text-c-primary'
								: ''}"
						>
							<IconSignOut class="w-6 h-6" />
							<p>{$LL.SignIn.SignOutButton()}</p>
						</div>
					</DropdownItem>
				</div>
			</div>
		</div>
	{/if}
</PageWrapper>
