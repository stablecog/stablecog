<script lang="ts">
	import { browser } from '$app/environment';
	import ProductIdBadge from '$components/badges/ProductIdBadge.svelte';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconSearch from '$components/icons/IconSearch.svelte';
	import IconWarning from '$components/icons/IconWarning.svelte';
	import Input from '$components/primitives/Input.svelte';
	import ToggleIndicator from '$components/primitives/ToggleIndicator.svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import DropdownItem from '$components/primitives/dropdown/DropdownItem.svelte';
	import DropdownWrapper from '$components/primitives/dropdown/DropdownWrapper.svelte';
	import TabLikeDropdown from '$components/primitives/tabBars/TabLikeDropdown.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import ScrollAreaWithChevron from '$components/utils/ScrollAreaWithChevron.svelte';
	import PageWrapper from '$components/wrappers/PageWrapper.svelte';
	import { env } from '$env/dynamic/public';
	import LL, { locale } from '$i18n/i18n-svelte';
	import {
		adminPanelUsersSearchString,
		adminPanelUsersView
	} from '$routes/(app)/admin/users/constants.js';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { staticAssetBaseUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import type { TStripeSupportedProductIdSubscriptions } from '$ts/constants/stripePublic';
	import { sessionStore } from '$ts/constants/supabase';
	import { getRelativeDate } from '$ts/helpers/getRelativeDate';
	import { getTitleFromProductId } from '$ts/helpers/stripe/plan';
	import {
		banOrUnbanDomains,
		banOrUnbanUsers,
		getAllUsers,
		type TAllUsersPage
	} from '$ts/queries/getAllUsers';
	import { getCreditOptions } from '$ts/queries/getCreditsList';
	import { giftCreditsToUser } from '$ts/queries/giftCreditsToUser';
	import { hydrated } from '$ts/stores/hydrated.js';
	import { navbarHeight } from '$ts/stores/navbarHeight';
	import type { TTab } from '$ts/types/main';
	import { createInfiniteQuery, createQuery } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';
	import IntersectionObserver from 'svelte-intersection-observer';
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export let data;

	let searchString: string;

	if (!hydrated) {
		adminPanelUsersSearchString.set(data.searchString);
		searchString = data.searchString;
	} else {
		searchString = $adminPanelUsersSearchString;
	}

	let searchTimeout: NodeJS.Timeout;
	let searchDebounceMs = 300;
	let usersInput: HTMLInputElement;

	$: searchString, setDebouncedSearch(searchString);

	const viewDropdownItems: TTab<TStripeSupportedProductIdSubscriptions>[] = [
		{
			label: $LL.Shared.AllTitle(),
			value: ''
		},
		{
			label: getTitleFromProductId($LL, env.PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION),
			value: env.PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION
		},
		{
			label: getTitleFromProductId($LL, env.PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION),
			value: env.PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION
		},
		{
			label: getTitleFromProductId($LL, env.PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION),
			value: env.PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION
		},
		{
			label: $LL.Admin.Users.BannedTitle(),
			value: 'banned'
		}
	];

	$: allUsersQuery = browser
		? createInfiniteQuery({
				queryKey: ['all_users_query', $adminPanelUsersSearchString, $adminPanelUsersView ?? ''],
				queryFn: async (lastPage) => {
					const res = await getAllUsers({
						cursor: lastPage?.pageParam,
						search: $adminPanelUsersSearchString,
						access_token: $sessionStore?.access_token,
						active_product_id: $adminPanelUsersView === 'banned' ? undefined : $adminPanelUsersView,
						banned: $adminPanelUsersView === 'banned' ? true : undefined
					});
					return res;
				},
				getNextPageParam: (lastPage: TAllUsersPage) => {
					if (!lastPage.next) return undefined;
					return lastPage.next;
				},
				initialPageParam: undefined
			})
		: undefined;

	$: totalCounts = $allUsersQuery?.data?.pages?.[0]?.total_counts;

	type TDropdownState =
		| 'main'
		| 'gift-credits'
		| 'ban-user'
		| 'unban-user'
		| 'ban-domain'
		| 'unban-domain';
	let isDropdownOpen: {
		[id: string]: {
			isOpen: boolean;
			state: TDropdownState;
			buttonElement?: HTMLElement | undefined;
			delete_data?: boolean;
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
					buttonElement: undefined,
					delete_data: false
				};
			});
		isDropdownOpen = { ...isDropdownOpen };
		deleteData = false;
	}

	$: creditOptions = browser
		? createQuery({
				queryKey: ['admin_credit_options'],
				queryFn: async () => {
					const res = await getCreditOptions({
						access_token: $sessionStore?.access_token
					});
					return res;
				}
			})
		: undefined;

	async function setDebouncedSearch(searchString: string | undefined) {
		if (!browser) return;
		clearTimeout(searchTimeout);
		if (!searchString) {
			adminPanelUsersSearchString.set('');
			return;
		}
		searchTimeout = setTimeout(async () => {
			if (searchString) {
				adminPanelUsersSearchString.set(searchString);
			} else {
				adminPanelUsersSearchString.set('');
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
				access_token: $sessionStore?.access_token,
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
		action,
		delete_data
	}: {
		user_ids: string[];
		action: 'ban' | 'unban';
		delete_data?: boolean;
	}) {
		if (banOrUnbanUserInputValue !== $LL.Admin.Users.ConfirmAction.ConfirmActionReferenceText())
			return;
		try {
			user_ids.forEach((id) => toggleUserDropdown(id, false));
			const res = await banOrUnbanUsers({
				access_token: $sessionStore?.access_token || '',
				user_ids,
				action,
				delete_data
			});
			console.log(res);
			$allUsersQuery?.refetch();
		} catch (e) {
			console.log(e);
		}
	}

	let deleteData = false;

	async function _banOrUnbanDomains({
		userId,
		domains,
		action
	}: {
		userId: string;
		domains: string[];
		action: 'ban' | 'unban';
	}) {
		if (banOrUnbanUserInputValue !== $LL.Admin.Users.ConfirmAction.ConfirmActionReferenceText())
			return;
		try {
			toggleUserDropdown(userId, false);
			const res = await banOrUnbanDomains({
				access_token: $sessionStore?.access_token || '',
				domains,
				action
			});
			console.log(res);
			$allUsersQuery?.refetch();
		} catch (e) {
			console.log(e);
		}
	}

	onMount(() => {
		adminPanelUsersSearchString.set(searchString);
	});
</script>

<MetaTag
	title="Users | Admin"
	description="Stablecog admin panel. Free, multilingual and open-source AI image generator using Stable Diffusion, FLUX, and Kandinsky."
	image_url="{staticAssetBaseUrl}/previews/home-{previewImageVersion}.png"
/>

<svelte:window
	on:scroll|passive={() => {
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
	<div class="relative flex w-full justify-center py-2.5">
		<div
			class="-mx-3.5 flex max-w-[calc(100%+1.75rem)] flex-col rounded-2xl bg-c-bg shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] ring-2
			ring-c-bg-secondary"
		>
			<div class="flex flex-wrap gap-3 p-3 md:gap-8">
				{#each totalCounts ?? Array(4)
						.fill(1)
						.map((i) => ({ product_id: '----', count: '----' })) as item}
					<div class="flex items-center gap-3">
						<ProductIdBadge
							productId={item.product_id}
							loading={item.product_id === '----'}
							size="md"
						/>
						<p class="pr-4 text-xl font-bold text-c-primary">
							{item.count}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<div
		style="top: {$navbarHeight}px"
		class="sticky z-40 -mx-3.5 flex w-[calc(100%+1.75rem)] justify-center py-2 transition {scrollDirection ===
		'up'
			? 'translate-y-0 opacity-100'
			: 'pointer-events-none -translate-y-22 opacity-0'}"
	>
		<div class="flex w-full max-w-2xl gap-2">
			<div class="min-w-0 flex-1 rounded-xl">
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
					<IconSearch slot="icon" class="h-full w-full" />
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
					items={viewDropdownItems}
					bind:value={$adminPanelUsersView}
				/>
			</div>
		</div>
	</div>
	<div
		class="z-0 -mx-3.5 my-auto mt-2 flex w-[calc(100%+1.75rem)] flex-col items-center gap-8 pb-2"
	>
		<div class="flex w-full flex-col items-center justify-center gap-2 md:max-w-4xl">
			{#if !$allUsersQuery || $allUsersQuery.isLoading}
				<div
					class="flex w-full flex-1 flex-col items-center justify-center px-4 py-6 text-center text-c-on-bg/50"
				>
					<div
						in:scale={{
							duration: 200,
							easing: quadOut,
							opacity: 0,
							start: 0.5
						}}
						class="h-12 w-12"
					>
						<IconAnimatedSpinner class="h-full w-full" />
					</div>
					<p class="mt-2 opacity-0">
						{$LL.Shared.SearchingTitle()}
					</p>
					<div class="h-[2vh]" />
				</div>
			{:else if !$allUsersQuery.data || $allUsersQuery.isError}
				<p class="py-6.5 text-c-on-bg/50">{$allUsersQuery.error}</p>
			{:else if $allUsersQuery.data.pages.length === 1 && (!$allUsersQuery.data.pages[0].users || $allUsersQuery.data.pages[0].users.length === 0)}
				<div
					class="flex w-full flex-1 flex-col items-center justify-center px-4 py-6 text-center text-c-on-bg/50"
				>
					<div class="h-12 w-12">
						<IconSearch class="h-full w-full" />
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
							class="flex w-full max-w-2xl flex-col
							rounded-xl bg-c-bg-secondary p-3 shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] md:p-4"
						>
							{#if user.banned_at}
								<div class="flex w-full flex-wrap items-center gap-2">
									<div
										class="flex items-center gap-2 rounded-md bg-c-danger/15 px-2 py-1 text-sm font-bold text-c-danger"
									>
										<IconWarning class="-ml-0.5 h-4 w-4 flex-shrink-0" />
										<p class="min-w-0 flex-1 overflow-hidden overflow-ellipsis">
											{$LL.Admin.Users.BannedTitle()}
										</p>
									</div>
									<div class="flex items-center">
										<div class="flex max-w-full flex-wrap gap-3 text-xxs">
											<div class="flex flex-col px-1.5">
												<p class="font-semibold text-c-on-bg/75">
													{$LL.Admin.Users.BannedAtTitle()}
												</p>
												<p class="mt-1 text-c-on-bg/50">
													{getRelativeDate({ date: user.banned_at, locale: $locale })}
												</p>
											</div>
											<div class="flex flex-col px-1.5">
												<p class="font-semibold text-c-on-bg/75">
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
								<div class="mb-3 mt-4 h-2px w-full rounded-full bg-c-on-bg/5" />
							{/if}
							<div class="flex w-full flex-row items-center justify-between gap-5">
								<div class="flex flex-1 flex-col items-start justify-center">
									<div class="flex max-w-full flex-col items-start">
										<button
											bind:this={isDropdownOpen[user.id].buttonElement}
											class="flex max-w-full flex-col items-start justify-start rounded transition
											not-touch:hover:bg-c-primary/15 not-touch:hover:text-c-primary"
											on:click|stopPropagation|capture={() => toggleUserDropdown(user.id)}
										>
											<p
												class="-mt-0.5 max-w-full overflow-hidden break-all px-1.5 py-0.5 text-left text-sm font-semibold"
											>
												{user.email}
											</p>
										</button>
										<a
											href="/{user.username}"
											data-sveltekit-preload-data="hover"
											target="_blank"
											class="group max-w-full overflow-hidden break-all rounded px-1.5 py-0.5 text-left text-sm
											font-medium text-c-on-bg/60 transition not-touch:hover:bg-c-primary/15 not-touch:hover:text-c-primary"
										>
											<span
												class="font-normal text-c-on-bg/30 transition not-touch:group-hover:text-c-primary/50"
												>@</span
											>{user.username}
										</a>
										<div class="relative mt-0.5">
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
														class="mt-1.5 w-64 max-w-[80vw]"
													>
														{#if userDropdownState === 'ban-user' || userDropdownState === 'unban-user' || userDropdownState === 'ban-domain' || userDropdownState === 'unban-domain'}
															<ScrollAreaWithChevron
																class="relative flex max-h-[min(50vh,16rem)] w-full flex-col justify-start"
															>
																<div class="flex flex-col gap-2 px-2 py-2">
																	<p class="px-2 pb-2 pt-1 text-xs leading-normal text-c-on-bg/50">
																		{@html $LL.Admin.Users.ConfirmAction.ConfirmActionParagraph({
																			confirmActionText: `<span class="text-c-danger">${$LL.Admin.Users.ConfirmAction.ConfirmActionReferenceText()}</span>`
																		})}
																	</p>
																	<form
																		on:submit|preventDefault={() => {
																			if (
																				userDropdownState === 'ban-domain' ||
																				userDropdownState === 'unban-domain'
																			) {
																				_banOrUnbanDomains({
																					userId: user.id,
																					domains: [user.email.split('@')[1]],
																					action: user.banned_at ? 'unban' : 'ban'
																				});
																			} else {
																				_banOrUnbanUsers({
																					user_ids: [user.id],
																					action: user.banned_at ? 'unban' : 'ban',
																					delete_data: deleteData
																				});
																			}
																		}}
																		class="flex w-full flex-col gap-2"
																	>
																		{#if userDropdownState === 'ban-user'}
																			<div class="flex w-full items-center justify-start pb-1">
																				<button
																					type="button"
																					on:click={() => {
																						deleteData = !deleteData;
																					}}
																					class="group relative flex items-center justify-start gap-2 overflow-hidden rounded-full
																					p-1 pr-3"
																				>
																					<ButtonHoverEffect noPadding color="on-bg" />
																					<ToggleIndicator isToggled={deleteData} color="danger" />
																					<p
																						class="shrink transition {deleteData === true
																							? 'text-c-danger'
																							: 'text-c-on-bg'} min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap font-semibold"
																					>
																						{$LL.Admin.Users.DeleteDataButton()}
																					</p>
																				</button>
																			</div>
																		{/if}
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
																			{userDropdownState === 'ban-domain' ||
																			userDropdownState === 'unban-domain'
																				? user.banned_at
																					? $LL.Admin.Users.UnbanDomainButton()
																					: $LL.Admin.Users.BanDomainButton()
																				: user.banned_at
																					? $LL.Admin.Users.UnbanUserButton()
																					: $LL.Admin.Users.BanUserButton()}
																		</Button>
																	</form>
																</div>
															</ScrollAreaWithChevron>
														{:else if userDropdownState === 'gift-credits' && $creditOptions && $creditOptions.data && $creditOptions.data.length > 0}
															<ScrollAreaWithChevron
																class="relative flex max-h-[min(50vh,16rem)] w-full flex-col justify-start"
															>
																<div class="flex w-full flex-col justify-start bg-c-bg-secondary">
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
																			<div class="flex w-full items-center justify-between gap-5">
																				{#if creditToAdd && creditToAdd.user_id === user.id && creditToAdd.credit_type_id === creditOption.id}
																					<p
																						class="w-full text-center text-sm font-bold text-c-on-bg transition
																						not-touch:group-hover:text-c-primary"
																					>
																						{$LL.Shared.ConfirmQuestionMarkButton()}
																					</p>
																				{:else}
																					<p
																						class="min-w-0 flex-shrink
																					 text-left text-sm font-medium text-c-on-bg text-c-on-bg/60 transition
																					 not-touch:group-hover:text-c-primary"
																					>
																						{creditOption.name}
																					</p>
																					<p
																						class="text-right text-sm font-bold text-c-on-bg transition
																						not-touch:group-hover:text-c-primary"
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
															<div class="flex w-full flex-col justify-start bg-c-bg-secondary">
																<DropdownItem
																	onClick={() => changeUserDropdownState(user.id, 'gift-credits')}
																>
																	<p
																		class="text-left text-c-on-bg transition not-touch:group-hover:text-c-primary"
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
																	<div class="flex max-w-full items-center gap-2">
																		<IconWarning
																			class="h-5 w-5 flex-shrink-0 text-c-danger transition not-touch:group-hover:text-c-primary"
																		/>
																		<p
																			class="min-w-0 flex-1 overflow-hidden overflow-ellipsis text-left text-c-danger
																			transition not-touch:group-hover:text-c-primary"
																		>
																			{user.banned_at
																				? $LL.Admin.Users.UnbanUserButton()
																				: $LL.Admin.Users.BanUserButton()}
																		</p>
																	</div>
																</DropdownItem>
																<DropdownItem
																	onClick={() =>
																		user.banned_at
																			? changeUserDropdownState(user.id, 'unban-domain')
																			: changeUserDropdownState(user.id, 'ban-domain')}
																>
																	<div class="flex max-w-full items-center gap-2">
																		<IconWarning
																			class="h-5 w-5 flex-shrink-0 text-c-danger transition not-touch:group-hover:text-c-primary"
																		/>
																		<p
																			class="min-w-0 flex-1 overflow-hidden overflow-ellipsis text-left text-c-danger
																			transition not-touch:group-hover:text-c-primary"
																		>
																			{user.banned_at
																				? $LL.Admin.Users.UnbanDomainButton()
																				: $LL.Admin.Users.BanDomainButton()}
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
										class="mt-1 max-w-full break-all rounded-md bg-c-on-bg/5 px-2 py-1 text-xxs text-c-on-bg/50"
									>
										{user.id}
									</p>
									<div class="mt-2.5 flex max-w-full flex-wrap gap-3 text-xxs">
										<div class="flex flex-col px-1.5">
											<p class="font-semibold text-c-on-bg/75">
												{$LL.Account.Meta.AccountCreationTitle()}
											</p>
											<p class="mt-1 text-c-on-bg/50">
												{getRelativeDate({ date: user.created_at, locale: $locale })}
											</p>
										</div>
										<div class="flex flex-col px-1.5">
											<p class="font-semibold text-c-on-bg/75">
												{$LL.Account.Meta.LastSeenTitle()}
											</p>
											<p class="mt-1 text-c-on-bg/50">
												{getRelativeDate({ date: user.last_seen_at, locale: $locale })}
											</p>
										</div>
									</div>
								</div>
								<div class="flex flex-1 flex-col items-end justify-center">
									<ProductIdBadge class="max-w-full" productId={user.product_id} size="sm" />
									<a
										rel="noreferrer"
										href="https://dashboard.stripe.com/customers/{user.stripe_customer_id}"
										target="_blank"
										class="mt-2.5 max-w-full rounded-lg bg-c-on-bg/5 px-2.5 py-1.5
										text-xs text-c-on-bg/50 ring-0 ring-c-primary/20 transition
										not-touch:hover:bg-c-primary/10 not-touch:hover:text-c-primary not-touch:hover:ring-2"
									>
										{user.stripe_customer_id}
									</a>
								</div>
							</div>
							{#if user.credits}
								<div class="mt-3.5 w-full text-xxs md:text-xs">
									<div class="flex w-full items-center gap-3 rounded-t-md bg-c-on-bg/6 py-1.5">
										<p class="w-1/4 max-w-full break-all px-2 font-semibold text-c-on-bg/75">
											{$LL.Shared.Credits.CreditsTable.CreditTypeTitle()}
										</p>
										<p class="w-1/4 max-w-full break-all px-2 font-semibold text-c-on-bg/75">
											{$LL.Shared.Credits.CreditsTable.RemainingCreditsTitle()}
										</p>
										<p class="w-1/4 max-w-full break-all px-2 font-semibold text-c-on-bg/75">
											{$LL.Shared.Credits.CreditsTable.ExpiryTitle()}
										</p>
										<p class="w-1/4 max-w-full break-all px-2 font-semibold text-c-on-bg/75">
											{$LL.Shared.Credits.CreditsTable.LastReplenish()}
										</p>
									</div>
									{#each user.credits as credit, index}
										<div
											class="flex w-full items-center py-1.5 {(index + 1) % 2 === 0
												? 'bg-c-on-bg/6'
												: 'bg-c-on-bg/3'} {index === user.credits.length - 1
												? 'rounded-b-md'
												: ''} gap-3"
										>
											<p class="w-1/4 max-w-full break-all px-2 text-c-on-bg/50">
												{credit.credit_type.stripe_product_id || credit.credit_type.name === 'Free'
													? getTitleFromProductId($LL, credit.credit_type.stripe_product_id)
													: credit.credit_type.name}
											</p>
											<p class="w-1/4 max-w-full break-all px-2 text-c-on-bg/50">
												{credit.remaining_amount.toLocaleString($locale)}
											</p>
											<p class="w-1/4 max-w-full break-all px-2 text-c-on-bg/50">
												{getRelativeDate({ date: credit.expires_at, locale: $locale })}
											</p>
											<p class="w-1/4 max-w-full break-all px-2 text-c-on-bg/50">
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
							class="mt-6 flex w-full flex-row items-center justify-center"
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
