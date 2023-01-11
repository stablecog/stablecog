<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/MetaTag.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { supabase } from '$ts/constants/supabase';
	import { onMount } from 'svelte';
	import PageWrapper from '$components/PageWrapper.svelte';
	import type { IStripeSubscriptionTier } from '$ts/types/stripe';
	import TierBadge from '$components/TierBadge.svelte';
	import { getRelativeDate } from '$ts/helpers/getRelativeDate';
	import { getDateString } from '$ts/helpers/date';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { navbarHeight } from '$ts/stores/navbarHeight';
	import Input from '$components/Input.svelte';
	import IconSearch from '$components/icons/IconSearch.svelte';

	interface TUser {
		id: string;
		created_at: string;
		updated_at: string;
		email: string;
		stripe_customer_id: string;
		subscription_tier: IStripeSubscriptionTier;
		subscription_category: 'GIFTED' | 'FRIEND_BOUGHT';
	}

	let users: TUser[];
	let initialUsers: TUser[];
	let startDate: Date;
	let proCount: number;
	let freeCount: number;
	let giftedCount: number;
	let friendBoughtCount: number;
	let searchString: string;
	const maxResCount = 100;

	onMount(async () => {
		getUsers();
	});

	async function getUsers() {
		if (!supabase) return;
		try {
			const userRes = await supabase
				.from('user')
				.select('*')
				.order('created_at', { ascending: false })
				.not('confirmed_at', 'is', null)
				.limit(maxResCount);
			if (userRes.data) {
				users = userRes.data;
				initialUsers = [...users];
			}
			const [proCountRes, freeCountRes, giftedCountRes, friendBoughtCountRes, startDateRes] =
				await Promise.all([
					supabase
						.from('user')
						.select('*', { head: true, count: 'exact' })
						.match({ subscription_tier: 'PRO' }),
					supabase
						.from('user')
						.select('*', { head: true, count: 'exact' })
						.filter('subscription_tier', 'eq', 'FREE')
						.not('confirmed_at', 'is', null),
					supabase
						.from('user')
						.select('*', { head: true, count: 'exact' })
						.match({ subscription_category: 'GIFTED' }),
					supabase
						.from('user')
						.select('*', { head: true, count: 'exact' })
						.match({ subscription_category: 'FRIEND_BOUGHT' }),
					supabase
						.from('user')
						.select('created_at')
						.order('created_at', { ascending: true })
						.limit(1)
				]);
			if (
				proCountRes.count &&
				freeCountRes.count &&
				giftedCountRes.count &&
				friendBoughtCountRes.count &&
				startDateRes.data?.[0].created_at
			) {
				proCount = proCountRes.count;
				freeCount = freeCountRes.count;
				giftedCount = giftedCountRes.count;
				friendBoughtCount = friendBoughtCountRes.count;
				startDate = new Date(startDateRes.data?.[0].created_at);
			}
		} catch (error) {
			console.log(error);
		}
	}

	const atTheTopThreshold = 80;
	const minScrollThreshold = 40;
	let searchTimeout: NodeJS.Timeout;
	let searchDebounceMs = 200;
	let searchStatus: 'idle' | 'searching' | 'searched' = 'idle';

	$: searchString, searchWithDebounce(searchString);

	let scrollDirection: 'up' | 'down' = 'up';
	let oldScrollY = 0;
	let atTheTop = true;

	async function searchWithDebounce(s: string) {
		if (!initialUsers) return;
		if (searchTimeout) {
			clearTimeout(searchTimeout);
			searchStatus = 'idle';
		}
		if (!s) {
			users = [...initialUsers];
			searchStatus = 'idle';
			return;
		}
		if (searchStatus === 'searching') return;
		searchTimeout = setTimeout(async () => {
			search(s);
		}, searchDebounceMs);
	}

	async function search(s: string) {
		searchStatus = 'searching';
		try {
			const { data, error } = await supabase
				.from('user')
				.select('*')
				.ilike('email', `%${s}%`)
				.limit(maxResCount);
			if (error) console.log(error);
			if (data) users = [...data];
		} catch (error) {
			console.log(error);
		} finally {
			searchStatus = 'searched';
		}
	}
</script>

<MetaTag
	title="Users | Admin"
	description="Free, easy to use, multilingual and open-source AI image generator using Stable Diffusion."
	imageUrl="{canonicalUrl}/previews/home.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<svelte:window
	on:scroll={() => {
		if (Math.abs(window.scrollY) < atTheTopThreshold) {
			atTheTop = true;
			return;
		} else {
			atTheTop = false;
		}
		if (Math.abs(window.scrollY - oldScrollY) < minScrollThreshold) return;
		if (window.scrollY > oldScrollY) {
			scrollDirection = 'down';
		} else {
			scrollDirection = 'up';
		}
		oldScrollY = window.scrollY;
	}}
/>

<PageWrapper noPadding>
	<div class="w-full flex justify-center py-2.5">
		<div
			class="flex flex-col bg-c-bg ring-2 ring-c-bg-secondary rounded-2xl shadow-lg 
			shadow-c-shadow/[var(--o-shadow-normal)] -mx-3.5"
		>
			<div class="flex flex-wrap gap-3 md:gap-8 p-3">
				<div class="flex gap-3 items-center">
					<TierBadge tier={'PRO'} size="md" />
					<p class="font-bold text-xl text-c-primary pr-4">
						{proCount !== undefined ? proCount - giftedCount - friendBoughtCount : '---'}
					</p>
				</div>
				<div class="flex gap-3 items-center">
					<TierBadge tier={'FREE'} size="md" />
					<p class="font-bold text-xl text-c-on-bg pr-4">
						{freeCount !== undefined ? freeCount : '----'}
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
	<div
		style="top: {$navbarHeight}px"
		class="w-full py-2 flex justify-center sticky z-10 transition {scrollDirection === 'up'
			? 'translate-y-0 opacity-100'
			: '-translate-y-22 pointer-events-none opacity-0'}"
	>
		<Input
			disabled={!initialUsers || scrollDirection === 'down'}
			class="w-full max-w-2xl -mx-3.5"
			bind:value={searchString}
			title={$LL.Gallery.SearchInput.Title()}
			hasIcon
			hasClearButton
			bg="bg-secondary"
			shadow={!atTheTop ? 'strongest' : 'normal'}
		>
			<IconSearch slot="icon" class="w-full h-full" />
		</Input>
	</div>
	<div class="flex flex-col items-center my-auto gap-8 z-0 mt-2 -mx-3.5">
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
								class="text-xs text-c-on-bg/40 bg-c-on-bg/5 rounded-lg px-2.5 py-1.5 mt-2.5 transition ring-0 ring-c-primary/20 {!$isTouchscreen
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
