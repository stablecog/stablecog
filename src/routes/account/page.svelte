<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import DropdownItem from '$components/DropdownItem.svelte';
	import IconHome from '$components/icons/IconHome.svelte';
	import IconLoading from '$components/icons/IconLoading.svelte';
	import IconLogout from '$components/icons/IconLogout.svelte';
	import IconSubscriptionTier from '$components/icons/IconSubscriptionTier.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { supabase } from '$ts/constants/supabase';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	$: if (!$page.data.session?.user.id) {
		goto(`/login?redirect_to=${encodeURIComponent($page.url.pathname)}`);
	}

	async function logout() {
		try {
			await supabase.auth.signOut();
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

{#if !$page.data.session?.user.email}
	<div class="w-full flex-1 flex flex-col py-8 px-5 justify-center items-center">
		<IconLoading class="w-10 h-10 text-c-on-bg/50 animate-spin-faster" />
	</div>
{:else}
	<div class="w-full flex-1 flex flex-col py-6 px-5">
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
						<p
							class="mt-2 font-bold flex items-center gap-1.5 px-3 py-1 rounded-lg border-2 {$page
								.data.tier === 'PRO'
								? 'bg-c-primary/15 border-c-primary/15 text-c-primary'
								: 'bg-c-on-bg/15 border-c-on-bg/15 text-c-on-bg'}"
						>
							<IconSubscriptionTier type={$page.data.tier} class="w-5 h-5 -ml-1" />
							<span>{$page.data.tier}</span>
						</p>
					</div>
					<Button
						class="w-full md:w-auto"
						size="sm"
						href={data.customerPortalSession ? data.customerPortalSession.url : '/pro'}
					>
						{data.customerPortalSession ? 'Manage Subscription' : $LL.Pro.BecomeProButton()}
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
					<DropdownItem onClick={logout} class="w-full md:w-auto md:flex-1">
						<div
							class="flex transition justify-center items-center gap-2 text-c-on-bg {!$isTouchscreen
								? 'group-hover:text-c-primary'
								: ''}"
						>
							<IconLogout class="w-6 h-6" />
							<p>{$LL.Shared.LogoutButton()}</p>
						</div>
					</DropdownItem>
				</div>
			</div>
		</div>
	</div>
{/if}
