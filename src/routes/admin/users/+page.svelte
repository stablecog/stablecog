<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/MetaTag.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { onMount } from 'svelte';
	import PageWrapper from '$components/PageWrapper.svelte';
	import { getRelativeDate } from '$ts/helpers/getRelativeDate';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { navbarHeight } from '$ts/stores/navbarHeight';
	import Input from '$components/Input.svelte';
	import IconSearch from '$components/icons/IconSearch.svelte';
	import { browser } from '$app/environment';
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import { getAllUsers, type TAllUsersPage } from '$ts/queries/getAllUsers';
	import ProductIdBadge from '$components/ProductIdBadge.svelte';
	import { scale } from 'svelte/transition';
	import IconLoadingSlim from '$components/icons/IconLoadingSlim.svelte';
	import { quadOut } from 'svelte/easing';
	import Button from '$components/buttons/Button.svelte';
	import IntersectionObserver from 'svelte-intersection-observer';

	let searchString: string;
	let searchStringDebounced: string | undefined = undefined;
	let searchTimeout: NodeJS.Timeout;
	let searchDebounceMs = 300;
	$: searchString, setDebouncedSearch(searchString);

	interface TCount {
		product_id: string;
		count: number;
	}
	let totalCounts: TCount[];

	$: allUsersQuery = browser
		? createInfiniteQuery({
				queryKey: ['all_users_query', searchStringDebounced],
				queryFn: async (lastPage) => {
					const res = await getAllUsers({
						cursor: lastPage?.pageParam,
						search: searchStringDebounced,
						access_token: $page.data.session?.access_token
					});
					const { total_count, total_count_by_product_id } = res;
					if (total_count !== undefined && total_count_by_product_id !== undefined) {
						let withProductIdTotal = 0;
						let withProductId: TCount[] = [];
						for (const productId in total_count_by_product_id) {
							withProductIdTotal += total_count_by_product_id[productId];
							withProductId.push({
								product_id: productId,
								count: total_count_by_product_id[productId]
							});
						}
						const freeCount = total_count - withProductIdTotal;
						totalCounts = [{ product_id: 'free', count: freeCount }, ...withProductId];
					}
					return res;
				},
				getNextPageParam: (lastPage: TAllUsersPage) => {
					if (!lastPage.next) return undefined;
					return lastPage.next;
				}
		  })
		: undefined;

	async function setDebouncedSearch(searchString: string | undefined) {
		if (!browser) return;
		clearTimeout(searchTimeout);
		if (!searchString) {
			searchStringDebounced = '';
			console.log('searchStringDebounced is set to empty');
			return;
		}
		searchTimeout = setTimeout(async () => {
			if (searchString) {
				searchStringDebounced = searchString;
			} else {
				searchStringDebounced = '';
			}
		}, searchDebounceMs);
	}

	onMount(async () => {});

	const atTheTopThreshold = 80;
	const minScrollThreshold = 40;

	let scrollDirection: 'up' | 'down' = 'up';
	let oldScrollY = 0;
	let atTheTop = true;

	let bottomDiv: HTMLElement;

	let canAutoFetch = true;
	let canAutoFetchTimeout: NodeJS.Timeout;
	const autoFetchNextPage = () => {
		if (!canAutoFetch || $allUsersQuery?.isFetchingNextPage) return;
		clearTimeout(canAutoFetchTimeout);
		canAutoFetch = false;
		$allUsersQuery?.fetchNextPage();
		canAutoFetchTimeout = setTimeout(() => {
			canAutoFetch = true;
		}, 1000);
	};
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
				{#each totalCounts ?? Array(3)
						.fill(1)
						.map((i) => ({ product_id: '----', count: '----' })) as item}
					<div class="flex gap-3 items-center">
						<ProductIdBadge
							productId={item.product_id}
							planText={item.product_id === '----' ? item.product_id : undefined}
							size="md"
						/>
						<p
							class="font-bold text-xl pr-4  {item.product_id !== undefined &&
							item.product_id !== 'free'
								? 'text-c-primary'
								: 'text-c-on-bg'}"
						>
							{item.count}
						</p>
					</div>
				{/each}
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
			disabled={scrollDirection === 'down'}
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
	<div class="flex flex-col items-center my-auto gap-8 z-0 mt-2 -mx-3.5 pb-2">
		<div class="w-full md:max-w-4xl flex flex-col items-center justify-center gap-2">
			{#if !$allUsersQuery || $allUsersQuery.isInitialLoading}
				<div
					class="w-full flex flex-col text-c-on-bg/60 flex-1 py-6 px-4 justify-center items-center text-center"
				>
					<div
						in:scale|local={{
							duration: 200,
							easing: quadOut,
							opacity: 0,
							start: 0.5
						}}
						class="w-12 h-12"
					>
						<IconLoadingSlim class="animate-spin-faster w-full h-full" />
					</div>
					<p class="mt-2 opacity-0">
						{$LL.Shared.SearchingTitle()}
					</p>
					<div class="h-[2vh]" />
				</div>
			{:else if !$allUsersQuery.data || $allUsersQuery.isError}
				<p class="text-c-on-bg/50 py-6.5">{$allUsersQuery.error}</p>
			{:else if $allUsersQuery.data.pages.length === 1 && (!$allUsersQuery.data.pages[0].users || $allUsersQuery.data.pages[0].users.length === 0)}
				<div
					class="w-full flex flex-col text-c-on-bg/60 flex-1 py-6 px-4 justify-center items-center text-center"
				>
					<div class="w-12 h-12">
						<IconSearch class="w-full h-full" />
					</div>
					<p class="mt-2">
						{$LL.Shared.NoResultsFoundTitle()}
					</p>
					<div class="h-[2vh]" />
				</div>
			{:else}
				{#each $allUsersQuery.data.pages as allUsersQueryPage}
					{#each allUsersQueryPage.users as user (user.id)}
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
								<ProductIdBadge productId={user.product_id} size="sm" />
								<a
									rel="noreferrer"
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
				{/each}
				{#if $allUsersQuery?.hasNextPage}
					<IntersectionObserver
						on:intersect={autoFetchNextPage}
						rootMargin="100%"
						element={bottomDiv}
					>
						<div
							bind:this={bottomDiv}
							class="w-full flex flex-row items-center justify-center mt-6"
						>
							<Button
								withSpinner
								size="sm"
								loading={$allUsersQuery.isFetchingNextPage}
								onClick={() => $allUsersQuery?.fetchNextPage()}
							>
								{$LL.Shared.LoadMoreButton()}
							</Button>
						</div>
					</IntersectionObserver>
				{/if}
			{/if}
		</div>
	</div>
</PageWrapper>
