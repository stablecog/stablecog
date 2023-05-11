<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/MetaTag.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import PageWrapper from '$components/PageWrapper.svelte';
	import { getRelativeDate } from '$ts/helpers/getRelativeDate';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { navbarHeight } from '$ts/stores/navbarHeight';
	import Input from '$components/Input.svelte';
	import IconSearch from '$components/icons/IconSearch.svelte';
	import { browser } from '$app/environment';
	import { createInfiniteQuery, createQuery } from '@tanstack/svelte-query';
	import { banOrUnbanUsers, getAllUsers, type TAllUsersPage } from '$ts/queries/getAllUsers';
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
	import IconWarning from '$components/icons/IconWarning.svelte';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';

	let searchString: string;
	let searchStringDebounced: string | undefined = undefined;
	let searchTimeout: NodeJS.Timeout;
	let searchDebounceMs = 300;
	let usersInput: HTMLInputElement;
	$: searchString, setDebouncedSearch(searchString);

	let selectedFilterDropdownItem: TStripeSupportedProductIdSubscriptions = '';

	const filterDropdownItems: TTab<TStripeSupportedProductIdSubscriptions>[] = [
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
		},
		{
			label: $LL.Admin.Users.BannedTitle(),
			value: 'banned'
		}
	];

	$: allUsersQuery = browser
		? createInfiniteQuery({
				queryKey: ['all_users_query', searchStringDebounced, selectedFilterDropdownItem ?? ''],
				queryFn: async (lastPage) => {
					const res = await getAllUsers({
						cursor: lastPage?.pageParam,
						search: searchStringDebounced,
						access_token: $page.data.session?.access_token,
						active_product_id:
							selectedFilterDropdownItem === 'banned' ? undefined : selectedFilterDropdownItem,
						banned: selectedFilterDropdownItem === 'banned' ? true : undefined
					});
					return res;
				},
				getNextPageParam: (lastPage: TAllUsersPage) => {
					if (!lastPage.next) return undefined;
					return lastPage.next;
				}
		  })
		: undefined;

	$: totalCounts = $allUsersQuery?.data?.pages?.[0]?.total_counts;

	type TDropdownState = 'main' | 'gift-credits' | 'ban-user' | 'unban-user';
	let isDropdownOpen: {
		[id: string]: {
			isOpen: boolean;
			state: TDropdownState;
			buttonElement?: HTMLElement | undefined;
		};
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
	let banOrUnbanUserInput: HTMLInputElement;
	let banOrUnbanUserInputValue: string;

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
		if (banOrUnbanUserInput) {
			banOrUnbanUserInputValue = '';
			banOrUnbanUserInput.value = '';
		}
		const newIsOpen = shouldOpen !== undefined ? shouldOpen : !isDropdownOpen[id].isOpen;
		for (const key in isDropdownOpen) {
			isDropdownOpen[key] = { ...isDropdownOpen[key], isOpen: false, state: 'main' };
		}
		isDropdownOpen[id] = {
			...isDropdownOpen[id],
			isOpen: newIsOpen,
			state: 'main'
		};
		if (!newIsOpen) creditToAdd = undefined;
	}

	function changeUserDropdownState(id: string, state: TDropdownState) {
		if (!isDropdownOpen) return;
		isDropdownOpen[id] = { ...isDropdownOpen[id], isOpen: true, state };
	}

	let creditToAdd: { user_id: string; credit_type_id: string } | undefined = undefined;
	async function giftCredits(user_id: string, credit_type_id: string) {
		toggleUserDropdown(user_id, false);
		try {
			const res = await giftCreditsToUser({
				access_token: $page.data.session?.access_token,
				user_id,
				credit_type_id
			});
			if (!res.added) return;
			creditToAdd = undefined;
			$allUsersQuery?.refetch();
		} catch (e) {
			console.log(e);
		}
	}

	async function _banOrUnbanUsers({
		user_ids,
		action
	}: {
		user_ids: string[];
		action: 'ban' | 'unban';
	}) {
		if (banOrUnbanUserInputValue !== $LL.Admin.Users.ConfirmAction.ConfirmActionReferenceText())
			return;
		try {
			user_ids.forEach((id) => toggleUserDropdown(id, false));
			const res = await banOrUnbanUsers({
				access_token: $page.data.session?.access_token || '',
				user_ids,
				action
			});
			console.log(res);
			$allUsersQuery?.refetch();
		} catch (e) {
			console.log(e);
		}
	}
</script>

<MetaTag
	title="Users | Admin"
	description="Stablecog admin panel. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	imageUrl="{canonicalUrl}/previews/home-{previewImageVersion}.png"
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

<PageWrapper noPadding class="z-10">
	<div class="w-full flex justify-center py-2.5 relative">
		<div
			class="max-w-[calc(100%+1.75rem)] -mx-3.5 flex flex-col bg-c-bg ring-2 ring-c-bg-secondary rounded-2xl shadow-lg
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
							class="font-bold text-xl pr-4 {item.product_id !== undefined &&
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
					bind:inputElement={usersInput}
					enterkeyhint="search"
					type="text"
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
					items={filterDropdownItems}
					hasTitle={false}
					bind:value={selectedFilterDropdownItem}
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
							{#if user.banned_at}
								<div class="w-full flex items-center flex-wrap gap-2">
									<div
										class="font-bold bg-c-danger/15 text-c-danger rounded-md flex items-center gap-2 px-2 py-1 text-sm"
									>
										<IconWarning class="w-4 h-4 flex-shrink-0 -ml-0.5" />
										<p class="flex-1 min-w-0 overflow-hidden overflow-ellipsis">
											{$LL.Admin.Users.BannedTitle()}
										</p>
									</div>
									<div class="flex items-center">
										<div class="max-w-full flex flex-wrap text-xxs gap-3">
											<div class="flex flex-col px-1.5">
												<p class="text-c-on-bg/75 font-semibold">
													{$LL.Admin.Users.BannedAtTitle()}
												</p>
												<p class="mt-1 text-c-on-bg/50">
													{getRelativeDate({ date: user.banned_at, locale: $locale })}
												</p>
											</div>
											<div class="flex flex-col px-1.5">
												<p class="text-c-on-bg/75 font-semibold">
													{user.data_deleted_at
														? $LL.Admin.Users.DataDeletedAtTitle()
														: $LL.Admin.Users.WillBeDeletedTitle()}
												</p>
												<p class="mt-1 text-c-on-bg/50">
													{getRelativeDate({
														date: user.data_deleted_at
															? user.data_deleted_at
															: user.scheduled_for_deletion_on,
														locale: $locale
													})}
												</p>
											</div>
										</div>
									</div>
								</div>
								<div class="w-full h-2px rounded-full bg-c-on-bg/5 mt-4 mb-3" />
							{/if}
							<div class="w-full flex flex-row items-center justify-between gap-5">
								<div class="flex-1 flex flex-col items-start justify-center">
									<div class="max-w-full flex flex-col items-start">
										<button
											bind:this={isDropdownOpen[user.id].buttonElement}
											class="max-w-full flex flex-col items-start justify-start transition rounded {!$isTouchscreen
												? 'hover:bg-c-primary/15 hover:text-c-primary'
												: ''}"
											on:click|stopPropagation|capture={() => toggleUserDropdown(user.id)}
										>
											<p
												class="text-left max-w-full overflow-hidden text-sm font-semibold px-1.5 py-0.5 -mt-0.5 break-all"
											>
												{user.email}
											</p>
										</button>
										<div class="relative">
											{#if isUserDropdownOpen}
												<div
													use:clickoutside={{
														callback: () => toggleUserDropdown(user.id, false),
														exclude: [isDropdownOpen[user.id].buttonElement],
														capture: false
													}}
													class="relative"
												>
													<DropdownWrapper
														alignment="left-0 top-0"
														class="w-64 max-w-[80vw] mt-1.5"
													>
														{#if userDropdownState === 'ban-user' || userDropdownState === 'unban-user'}
															<ScrollAreaWithChevron
																class="w-full flex flex-col justify-start max-h-[min(50vh,16rem)] relative"
															>
																<div class="px-2 py-2 flex flex-col gap-2">
																	<p class="px-2 pt-1 pb-2 text-xs text-c-on-bg/50 leading-normal">
																		{@html $LL.Admin.Users.ConfirmAction.ConfirmActionParagraph({
																			confirmActionText: `<span class="text-c-danger">${$LL.Admin.Users.ConfirmAction.ConfirmActionReferenceText()}</span>`
																		})}
																	</p>
																	<form
																		on:submit={() =>
																			_banOrUnbanUsers({
																				user_ids: [user.id],
																				action: user.banned_at ? 'unban' : 'ban'
																			})}
																		class="w-full flex flex-col gap-2"
																	>
																		<Input
																			noAutocomplete
																			title={$LL.Admin.Users.ConfirmAction.ConfirmActionInput.Placeholder()}
																			bind:value={banOrUnbanUserInputValue}
																			bind:inputElement={banOrUnbanUserInput}
																		/>
																		<Button
																			disabled={banOrUnbanUserInputValue !==
																				$LL.Admin.Users.ConfirmAction.ConfirmActionReferenceText()}
																			fadeOnDisabled
																			type="danger"
																			size="sm"
																		>
																			{user.banned_at
																				? $LL.Admin.Users.UnbanUserButton()
																				: $LL.Admin.Users.BanUserButton()}
																		</Button>
																	</form>
																</div>
															</ScrollAreaWithChevron>
														{:else if userDropdownState === 'gift-credits' && $creditOptions && $creditOptions.data && $creditOptions.data.length > 0}
															<ScrollAreaWithChevron
																class="w-full flex flex-col justify-start max-h-[min(50vh,16rem)] relative"
															>
																<div class="w-full bg-c-bg-secondary flex flex-col justify-start">
																	{#each $creditOptions.data.sort((a, b) => b.amount - a.amount) as creditOption}
																		<DropdownItem
																			onClick={() => {
																				if (
																					creditToAdd === undefined ||
																					creditToAdd.user_id !== user.id ||
																					creditToAdd.credit_type_id !== creditOption.id
																				) {
																					creditToAdd = {
																						user_id: user.id,
																						credit_type_id: creditOption.id
																					};
																					return;
																				}
																				giftCredits(user.id, creditOption.id);
																			}}
																		>
																			<div class="w-full flex justify-between items-center gap-5">
																				{#if creditToAdd && creditToAdd.user_id === user.id && creditToAdd.credit_type_id === creditOption.id}
																					<p
																						class="w-full text-c-on-bg transition text-sm text-center font-bold {!$isTouchscreen
																							? 'group-hover:text-c-primary'
																							: ''}"
																					>
																						{$LL.Shared.ConfirmQuestionMarkButton()}
																					</p>
																				{:else}
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
																				{/if}
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
																<DropdownItem
																	onClick={() =>
																		user.banned_at
																			? changeUserDropdownState(user.id, 'unban-user')
																			: changeUserDropdownState(user.id, 'ban-user')}
																>
																	<div class="max-w-full flex items-center gap-2">
																		<IconWarning
																			class="w-5 h-5 text-c-danger flex-shrink-0 {!$isTouchscreen
																				? 'group-hover:text-c-primary'
																				: ''}"
																		/>
																		<p
																			class="flex-1 min-w-0 overflow-hidden overflow-ellipsis text-left text-c-danger transition {!$isTouchscreen
																				? 'group-hover:text-c-primary'
																				: ''}"
																		>
																			{user.banned_at
																				? $LL.Admin.Users.UnbanUserButton()
																				: $LL.Admin.Users.BanUserButton()}
																		</p>
																	</div>
																</DropdownItem>
															</div>
														{/if}
													</DropdownWrapper>
												</div>
											{/if}
										</div>
									</div>
									<p
										class="max-w-full text-xxs text-c-on-bg/50 bg-c-on-bg/5 rounded-md px-2 py-1 mt-1 break-all"
									>
										{user.id}
									</p>
									<div class="max-w-full flex flex-wrap text-xxs mt-2.5 gap-3">
										<div class="flex flex-col px-1.5">
											<p class="text-c-on-bg/75 font-semibold">
												{$LL.Account.Meta.AccountCreationTitle()}
											</p>
											<p class="mt-1 text-c-on-bg/50">
												{getRelativeDate({ date: user.created_at, locale: $locale })}
											</p>
										</div>
										<div class="flex flex-col px-1.5">
											<p class="text-c-on-bg/75 font-semibold">
												{$LL.Account.Meta.LastSeenTitle()}
											</p>
											<p class="mt-1 text-c-on-bg/50">
												{getRelativeDate({ date: user.last_seen_at, locale: $locale })}
											</p>
										</div>
									</div>
								</div>
								<div class="flex-1 flex flex-col items-end justify-center">
									<ProductIdBadge class="max-w-full" productId={user.product_id} size="sm" />
									<a
										rel="noreferrer"
										href="https://dashboard.stripe.com/customers/{user.stripe_customer_id}"
										target="_blank"
										class="max-w-full text-xs text-c-on-bg/50 bg-c-on-bg/5 rounded-lg px-2.5 py-1.5 mt-2.5 transition ring-0 ring-c-primary/20 {!$isTouchscreen
											? 'hover:text-c-primary hover:bg-c-primary/10 hover:ring-2'
											: ''}"
									>
										{user.stripe_customer_id}
									</a>
								</div>
							</div>
							{#if user.credits}
								<div class="w-full mt-3.5 text-xxs md:text-xs">
									<div class="w-full flex items-center py-1.5 bg-c-on-bg/6 rounded-t-md gap-3">
										<p class="max-w-full break-all w-1/4 px-2 text-c-on-bg/75 font-semibold">
											{$LL.Shared.Credits.CreditsTable.CreditTypeTitle()}
										</p>
										<p class="max-w-full break-all w-1/4 px-2 text-c-on-bg/75 font-semibold">
											{$LL.Shared.Credits.CreditsTable.RemainingCreditsTitle()}
										</p>
										<p class="max-w-full break-all w-1/4 px-2 text-c-on-bg/75 font-semibold">
											{$LL.Shared.Credits.CreditsTable.ExpiryTitle()}
										</p>
										<p class="max-w-full break-all w-1/4 px-2 text-c-on-bg/75 font-semibold">
											{$LL.Shared.Credits.CreditsTable.LastReplenish()}
										</p>
									</div>
									{#each user.credits as credit, index}
										<div
											class="w-full flex items-center py-1.5 {(index + 1) % 2 === 0
												? 'bg-c-on-bg/6'
												: 'bg-c-on-bg/3'} {index === user.credits.length - 1
												? 'rounded-b-md'
												: ''} gap-3"
										>
											<p class="max-w-full break-all w-1/4 px-2 text-c-on-bg/50">
												{credit.credit_type.stripe_product_id || credit.credit_type.name === 'Free'
													? getTitleFromProductId($LL, credit.credit_type.stripe_product_id)
													: credit.credit_type.name}
											</p>
											<p class="max-w-full break-all w-1/4 px-2 text-c-on-bg/50">
												{credit.remaining_amount.toLocaleString($locale)}
											</p>
											<p class="max-w-full break-all w-1/4 px-2 text-c-on-bg/50">
												{getRelativeDate({ date: credit.expires_at, locale: $locale })}
											</p>
											<p class="max-w-full break-all w-1/4 px-2 text-c-on-bg/50">
												{credit.replenished_at
													? getRelativeDate({ date: credit.replenished_at, locale: $locale })
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
