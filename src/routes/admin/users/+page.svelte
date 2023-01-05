<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/MetaTag.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { supabase } from '$ts/constants/supabase';
	import type { PostgrestError } from '@supabase/supabase-js';
	import { onMount } from 'svelte';
	import PageWrapper from '$components/PageWrapper.svelte';
	import type { IStripeSubscriptionTier } from '$ts/types/stripe';
	import TierBadge from '$components/TierBadge.svelte';
	import { getRelativeDate } from '$ts/helpers/getRelativeDate';
	import { getDateString } from '$ts/helpers/date';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';

	interface TUser {
		id: string;
		created_at: string;
		updated_at: string;
		email: string;
		stripe_customer_id: string;
		subscription_tier: IStripeSubscriptionTier;
		subscription_category: 'GIFTED' | 'FRIEND_BOUGHT';
	}

	interface TUserRes {
		data: TUser[] | null;
		error: PostgrestError | null;
	}

	let users: TUser[];
	let startDate: Date;

	onMount(async () => {
		getUsers();
	});

	async function getUsers() {
		if (!supabase) return;
		try {
			const { data, error }: TUserRes = await supabase
				.from('user')
				.select('*')
				.order('created_at', { ascending: false });
			console.log('Server data:', data, error);
			if (data) {
				users = data;
			}
			startDate = new Date(
				users
					.map((u) => u.created_at)
					.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0]
			);
		} catch (error) {
			console.log(error);
		}
	}
</script>

<MetaTag
	title="Users | Admin"
	description="Free, easy to use, multilingual and open-source AI image generator using Stable Diffusion."
	imageUrl="{canonicalUrl}/previews/home.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<PageWrapper>
	<div class="flex justify-center z-10 sticky top-20 md:top-22 -mt-5">
		<div
			class="flex flex-col bg-c-bg ring-2 ring-c-bg-secondary rounded-2xl shadow-lg 
			shadow-c-shadow/[var(--o-shadow-normal)] -mx-3.5"
		>
			<div class="flex flex-wrap gap-3 md:gap-8 p-3">
				<div class="flex gap-3 items-center">
					<TierBadge tier={'PRO'} size="md" />
					<p class="font-bold text-xl text-c-primary pr-4">
						{users
							? users.filter((u) => u.subscription_tier === 'PRO').length -
							  users.filter((u) => u.subscription_category === 'GIFTED').length -
							  users.filter((u) => u.subscription_category === 'FRIEND_BOUGHT').length
							: '--'}
					</p>
				</div>
				<div class="flex gap-3 items-center">
					<TierBadge tier={'FREE'} size="md" />
					<p class="font-bold text-xl text-c-on-bg pr-4">
						{users ? users.filter((u) => u.subscription_tier === 'FREE').length : '---'}
					</p>
				</div>
			</div>
			<div class="w-full bg-c-bg-secondary h-2px" />
			<div class="w-full flex justify-center p-3 text-xs text-c-on-bg/50">
				{startDate
					? `${getRelativeDate({ date: startDate.toString(), decimals: 1 })} • ${getDateString(
							startDate
					  )}`
					: '---------- • ----------'}
			</div>
		</div>
	</div>
	<div class="flex flex-col items-center my-auto gap-8 z-0 mt-6 -mx-3.5">
		<div class="w-full md:max-w-4xl flex flex-col items-center justify-center gap-2">
			{#if users}
				{#each users as user}
					<div
						class="w-full max-w-2xl flex justify-between items-stretch gap-5 
						bg-c-bg-secondary rounded-xl shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] p-3 md:p-4"
					>
						<div class="flex flex-col justify-center flex-shrink min-w-0 overflow-hidden">
							<p
								class="max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap 
								text-sm font-semibold text-c-on-bg/75 px-1.5 -mt-0.5"
							>
								{user.email}
							</p>
							<p
								class="max-w-full text-xxs text-c-on-bg/40 bg-c-on-bg/5 rounded-md px-2 py-1 mt-2 break-all"
							>
								{user.id}
							</p>
							<p class="max-w-full text-xxs text-c-on-bg/40 mt-2 break-all px-1.5">
								{getRelativeDate({ date: user.created_at })}
							</p>
						</div>
						<div class="flex flex-col items-end justify-center">
							<TierBadge tier={user.subscription_tier} />
							<a
								href="https://dashboard.stripe.com/customers/{user.stripe_customer_id}"
								target="_blank"
								class="text-xs text-c-on-bg/40 bg-c-on-bg/5 rounded-lg px-2.5 py-1.5 mt-2.5 transition ring-0 ring-c-primary/25 {!$isTouchscreen
									? 'hover:text-c-primary hover:bg-c-primary/10 hover:ring-2'
									: ''}"
							>
								{user.stripe_customer_id}
							</a>
						</div>
					</div>
				{/each}
			{:else}
				<p class="text-c-on-bg/50 py-6.5">{$LL.Shared.LoadingParagraph()}</p>
			{/if}
		</div>
	</div>
</PageWrapper>
