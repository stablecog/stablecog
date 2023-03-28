<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/MetaTag.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { onMount } from 'svelte';
	import PageWrapper from '$components/PageWrapper.svelte';
	import { getRelativeDate } from '$ts/helpers/getRelativeDate';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { navbarHeight } from '$ts/stores/navbarHeight';
	import Input from '$components/Input.svelte';
	import IconSearch from '$components/icons/IconSearch.svelte';
	import { browser } from '$app/environment';
	import { createInfiniteQuery, createQuery } from '@tanstack/svelte-query';
	import { getAllUsers, type TAllUsersPage } from '$ts/queries/getAllUsers';
	import ProductIdBadge from '$components/badges/ProductIdBadge.svelte';
	import { scale } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import Button from '$components/buttons/Button.svelte';
	import IntersectionObserver from 'svelte-intersection-observer';
	import { getTitleFromProductId } from '$ts/helpers/stripe/plan';
	import type { TStripeSupportedProductIdSubscriptions } from '$ts/constants/stripePublic';
	import type { TTab } from '$ts/types/main';
	import {
		PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION,
		PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION,
		PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION
	} from '$env/static/public';
	import TabLikeDropdown from '$components/tabBars/TabLikeDropdown.svelte';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import { getCreditOptions } from '$ts/queries/getCreditsList';
	import DropdownWrapper from '$components/DropdownWrapper.svelte';
	import DropdownItem from '$components/DropdownItem.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import ScrollAreaWithChevron from '$components/ScrollAreaWithChevron.svelte';
	import { giftCreditsToUser } from '$ts/queries/giftCreditsToUser';

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
	let selectedActiveProductId: TStripeSupportedProductIdSubscriptions = '';

	const activeProductItems: TTab<TStripeSupportedProductIdSubscriptions>[] = [
		{
			label: $LL.Shared.AllTitle(),
			value: ''
		},
		{
			label: getTitleFromProductId($LL, PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION),
			value: PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION
		},
		{
			label: getTitleFromProductId($LL, PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION),
			value: PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION
		},
		{
			label: getTitleFromProductId($LL, PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION),
			value: PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION
		}
	];

	$: allUsersQuery = browser
		? createInfiniteQuery({
				queryKey: ['all_users_query', searchStringDebounced],
				queryFn: async (lastPage) => {
					const res = await getAllUsers({
						cursor: lastPage?.pageParam,
						search: searchStringDebounced,
						access_token: $page.data.session?.access_token,
						active_product_id: selectedActiveProductId
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

	type TDropdownState = 'main' | 'gift-credits';
	let isDropdownOpen: {
		[id: string]: { isOpen: boolean; state: TDropdownState; buttonElement?: HTMLElement };
	} = {};
	$: $allUsersQuery, onAllUsersQueryChanged();

	function onAllUsersQueryChanged() {
		if (!browser) return;
		$allUsersQuery?.data?.pages
			.flatMap((page) => page.users)
			.forEach((user) => {
				if (!isDropdownOpen) isDropdownOpen = {};
				isDropdownOpen[user.id] = {
					isOpen: false,
					state: 'main',
					buttonElement: undefined
				};
			});
		isDropdownOpen = { ...isDropdownOpen };
	}

	$: creditOptions = browser
		? createQuery({
				queryKey: ['admin_credit_options'],
				queryFn: async () => {
					const res = await getCreditOptions({
						access_token: $page.data.session?.access_token
					});
					return res;
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

	function toggleUserDropdown(id: string, shouldOpen?: boolean) {
		if (!isDropdownOpen) return;
		const newIsOpen = shouldOpen !== undefined ? shouldOpen : !isDropdownOpen[id].isOpen;
		for (const key in isDropdownOpen) {
			isDropdownOpen[key] = { ...isDropdownOpen[key], isOpen: false, state: 'main' };
		}
		isDropdownOpen[id] = {
			...isDropdownOpen[id],
			isOpen: newIsOpen,
			state: 'main'
		};
	}

	function changeUserDropdownState(id: string, state: TDropdownState) {
		if (!isDropdownOpen) return;
		isDropdownOpen[id] = { ...isDropdownOpen[id], isOpen: true, state };
	}

	async function giftCredits(user_id: string, credit_type_id: string) {
		toggleUserDropdown(user_id, false);
		const res = await giftCreditsToUser({
			access_token: $page.data.session?.access_token,
			user_id,
			credit_type_id
		});
		if (!res.added) return;
		$allUsersQuery?.refetch();
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
			class="w-[calc(100%+1.75rem)] max-w-3xl -mx-3.5 flex flex-col bg-c-bg ring-2 ring-c-bg-secondary rounded-2xl shadow-lg 
			shadow-c-shadow/[var(--o-shadow-normal)]"
		>
			<div class="flex flex-wrap gap-3 md:gap-8 p-3">
				{#each totalCounts ?? Array(4)
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
		class="w-[calc(100%+1.75rem)] -mx-3.5 py-2 flex justify-center sticky z-40 transition {scrollDirection ===
		'up'
			? 'translate-y-0 opacity-100'
			: '-translate-y-22 pointer-events-none opacity-0'}"
	>
		<div class="w-full flex max-w-2xl gap-2">
			<div class="flex-1 min-w-0 rounded-xl">
				<Input
					disabled={scrollDirection === 'down'}
					class="w-full"
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
			<div
				class="flex w-36 max-w-full rounded-xl transition {!atTheTop
					? 'shadow-lg shadow-c-shadow/[var(--o-shadow-strongest)]'
					: ''}"
			>
				<TabLikeDropdown
					class="w-full"
					name="Active Product ID"
					items={activeProductItems}
					hasTitle={false}
					bind:value={selectedActiveProductId}
				/>
			</div>
		</div>
	</div>
	<div class="flex flex-col items-center my-auto gap-8 z-0 mt-2 -mx-3.5 pb-2">
		<div class="w-full md:max-w-4xl flex flex-col items-center justify-center gap-2">
			{#if !$allUsersQuery || $allUsersQuery.isInitialLoading}
				<div
					class="w-full flex flex-col text-c-on-bg/50 flex-1 py-6 px-4 justify-center items-center text-center"
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
						<IconAnimatedSpinner class="w-full h-full" />
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
					class="w-full flex flex-col text-c-on-bg/50 flex-1 py-6 px-4 justify-center items-center text-center"
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
						{@const isUserDropdownOpen = isDropdownOpen?.[user.id].isOpen}
						{@const userDropdownState = isDropdownOpen?.[user.id].state || 'main'}
						<div
							class="w-full max-w-2xl flex flex-col 
							bg-c-bg-secondary rounded-xl shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] p-3 md:p-4"
						>
							<div class="w-full flex flex-row items-center justify-between gap-5">
								<div class="flex flex-col items-start justify-center flex-shrink min-w-0">
									<div class="flex flex-col">
										<button
											bind:this={isDropdownOpen[user.id].buttonElement}
											class="flex flex-col items-start justify-start transition rounded {!$isTouchscreen
												? 'hover:bg-c-primary/15 hover:text-c-primary'
												: ''}"
											on:click|stopPropagation|capture={() => toggleUserDropdown(user.id)}
										>
											<p
												class="max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap 
												text-sm font-semibold px-1.5 py-0.5 -mt-0.5"
											>
												{user.email}
											</p>
										</button>
										<div class="relative">
											{#if isUserDropdownOpen}
												<div
													use:clickoutside={{
														callback: () => toggleUserDropdown(user.id, false),
														exclude: isDropdownOpen[user.id].buttonElement,
														capture: false
													}}
													class="relative"
												>
													<DropdownWrapper alignment="left-0 top-0" class="w-52 mt-1.5">
														{#if userDropdownState === 'gift-credits' && $creditOptions && $creditOptions.data && $creditOptions.data.length > 0}
															<ScrollAreaWithChevron
																class="w-full flex flex-col justify-start max-h-[min(50vh,20rem)] relative"
															>
																<div class="w-full bg-c-bg-secondary flex flex-col justify-start">
																	{#each $creditOptions.data.sort((a, b) => b.amount - a.amount) as creditOption}
																		<DropdownItem
																			onClick={() => giftCredits(user.id, creditOption.id)}
																		>
																			<div class="w-full flex justify-between items-center gap-5">
																				<p
																					class="flex-shrink min-w-0
																					text-c-on-bg transition text-sm text-left font-medium text-c-on-bg/60 {!$isTouchscreen
																						? 'group-hover:text-c-primary'
																						: ''}"
																				>
																					{creditOption.name}
																				</p>
																				<p
																					class="text-c-on-bg transition text-sm text-right font-bold {!$isTouchscreen
																						? 'group-hover:text-c-primary'
																						: ''}"
																				>
																					{creditOption.amount.toLocaleString($locale)}
																				</p>
																			</div>
																		</DropdownItem>
																	{/each}
																</div>
															</ScrollAreaWithChevron>
														{:else}
															<div class="w-full bg-c-bg-secondary flex flex-col justify-start">
																<DropdownItem
																	onClick={() => changeUserDropdownState(user.id, 'gift-credits')}
																>
																	<p
																		class="text-left text-c-on-bg transition {!$isTouchscreen
																			? 'group-hover:text-c-primary'
																			: ''}"
																	>
																		{$LL.Admin.Users.GiftCreditsButton()}
																	</p>
																</DropdownItem>
															</div>
														{/if}
													</DropdownWrapper>
												</div>
											{/if}
										</div>
									</div>
									<p
										class="max-w-full text-xxs text-c-on-bg/50 bg-c-on-bg/5 rounded-md px-2 py-1 mt-2 break-all"
									>
										{user.id}
									</p>
									<p class="max-w-full text-xxs text-c-on-bg/50 mt-2 break-all px-1.5">
										{getRelativeDate({ date: user.created_at })} • {getRelativeDate({
											date: user.last_sign_in_at
										})} • {getRelativeDate({
											date: user.last_seen_at
										})}
									</p>
								</div>
								<div class="flex flex-col items-end justify-center">
									<ProductIdBadge productId={user.product_id} size="sm" />
									<a
										rel="noreferrer"
										href="https://dashboard.stripe.com/customers/{user.stripe_customer_id}"
										target="_blank"
										class="text-xs text-c-on-bg/50 bg-c-on-bg/5 rounded-lg px-2.5 py-1.5 mt-2.5 transition ring-0 ring-c-primary/20 {!$isTouchscreen
											? 'hover:text-c-primary hover:bg-c-primary/10 hover:ring-2'
											: ''}"
									>
										{user.stripe_customer_id}
									</a>
								</div>
							</div>
							{#if user.credits}
								<div class="w-full mt-2.5">
									{#each user.credits as credit, index}
										<div
											class="w-full flex items-center py-1 {index % 2 === 0
												? 'bg-c-on-bg/5'
												: ''} text-xs rounded-md gap-3"
										>
											<p class="w-1/4 md:w-24 px-2 text-c-on-bg/75">
												{credit.credit_type.stripe_product_id || credit.credit_type.name === 'Free'
													? getTitleFromProductId($LL, credit.credit_type.stripe_product_id)
													: credit.credit_type.name}
											</p>
											<p class="w-1/4 md:w-24 px-2 text-c-on-bg/75">
												{credit.remaining_amount.toLocaleString($locale)}
											</p>
											<p class="w-1/4 md:w-24 px-2 text-c-on-bg/50">
												{getRelativeDate({ date: credit.expires_at })}
											</p>
											<p class="w-1/4 md:w-24 px-2 text-c-on-bg/50">
												{credit.replenished_at
													? getRelativeDate({ date: credit.replenished_at })
													: ''}
											</p>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					{/each}
				{/each}
				{#if $allUsersQuery?.hasNextPage}
					<IntersectionObserver
						on:intersect={autoFetchNextPage}
						rootMargin="300%"
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
