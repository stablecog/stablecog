<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import DropdownItem from '$components/DropdownItem.svelte';
	import IconHome from '$components/icons/IconHome.svelte';
	import IconLoading from '$components/icons/IconLoading.svelte';
	import IconSignOut from '$components/icons/IconSignOut.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import PageWrapper from '$components/PageWrapper.svelte';
	import TierBadge from '$components/TierBadge.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { supabase } from '$ts/constants/supabase';
	import { mLogSignOut } from '$ts/helpers/loggers';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	$: if (!$page.data.session?.user.id) {
		goto(`/sign-in?redirect_to=${encodeURIComponent($page.url.pathname)}`);
	}

	async function signOut() {
		try {
			await supabase.auth.signOut();
			mLogSignOut({
				'SC - Plan': $page.data.tier,
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
				class="w-full max-w-xl mt-6 flex flex-col rounded-2xl bg-c-bg overflow-hidden relative z-0 
				shadow-xl shadow-c-shadow/[var(--o-shadow-strong)] ring-2 ring-c-bg-secondary"
			>
				<div class="w-full flex items-center gap-4 p-4 md:p-6 overflow-hidden">
					<p
						class="w-10 h-10 flex items-center justify-center bg-c-bg ring-2 ring-c-primary/50 rounded-full
							text-c-on-bg font-semibold transition shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] {!$isTouchscreen
							? 'group-hover:text-c-primary group-hover:ring-c-primary'
							: ''}"
					>
						{$page.data.session.user.email.slice(0, 2).toUpperCase()}
					</p>
					<p class="font-semibold flex-shrink overflow-hidden overflow-ellipsis">
						{$page.data.session.user.email}
					</p>
				</div>
				<div class="w-full h-2px bg-c-bg-secondary" />
				<div class="w-full flex flex-wrap items-center justify-between p-4 md:p-5 gap-5 md:gap-8">
					<div class="flex flex-col items-start px-1">
						<p class="text-c-on-bg/60 text-sm px-0.5 -mt-1">
							{$LL.Account.SubscriptionPlanTitle()}
						</p>
						<TierBadge class="mt-1.5" size="lg" tier={$page.data.tier} />
					</div>
					<Button
						class="w-full md:w-auto"
						size="sm"
						href={data.customerPortalSession && $page.data.tier !== 'FREE'
							? data.customerPortalSession.url
							: '/pro'}
					>
						{data.customerPortalSession && $page.data.tier !== 'FREE'
							? $LL.Account.ManageSubscriptionButton()
							: $LL.Pro.BecomeProButton()}
					</Button>
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
