<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import IconBrain from '$components/icons/IconBrain.svelte';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import IconDimensions from '$components/icons/IconDimensions.svelte';
	import IconFilter from '$components/icons/IconFilter.svelte';
	import IconImageSearch from '$components/icons/IconImageSearch.svelte';
	import IconTrashcan from '$components/icons/IconTrashcan.svelte';
	import IconUserAlt from '$components/icons/IconUserAlt.svelte';
	import SubtleButton from '$components/primitives/buttons/SubtleButton.svelte';
	import TagButton from '$components/primitives/buttons/TagButton.svelte';
	import TabLikeFilterDropdown from '$components/primitives/tabBars/TabLikeFilterDropdown.svelte';
	import TabLikeInput from '$components/primitives/tabBars/TabLikeInput.svelte';
	import Morpher from '$components/utils/Morpher.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import {
		availableModelIdDropdownItems,
		modelIdToDisplayName,
		type TAvailableGenerationModelId
	} from '$ts/constants/generationModels';
	import {
		aspectRatioDropdownItems,
		type TAvailableAspectRatio
	} from '$ts/constants/generationSize';
	import { sessionStore } from '$ts/constants/supabase';
	import { logGallerySearch, logHistorySearch } from '$ts/helpers/loggers';
	import { isUUID } from '$ts/helpers/uuid';
	import { appVersion } from '$ts/stores/appVersion';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { userSummary } from '$ts/stores/user/summary';
	import { quadOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import IconSearch from '../icons/IconSearch.svelte';
	import Input from '../primitives/Input.svelte';

	export let disabled = false;
	export let searchString: string;
	export let inputShadow: 'normal' | 'strongest' = 'normal';
	export let modelIdFilters: TAvailableGenerationModelId[];
	export let usernameFilters: string[] | undefined = undefined;
	export let searchInputIsFocused = false;
	export let type: 'gallery' | 'admin-gallery' | 'default' = 'default';
	export let aspectRatioFilters: TAvailableAspectRatio[];

	let searchStringLocal = searchString ?? '';
	let usernameSearchStringLocal = '';
	let inputElement: HTMLInputElement;
	let isFiltersOpen = false;
	let usernameInputElement: HTMLInputElement;

	$: searchStringLocal, onSearchStringLocalChanged();
	$: hasAnyFilter =
		modelIdFilters?.length > 0 ||
		aspectRatioFilters?.length > 0 ||
		(usernameFilters && usernameFilters.length > 0) ||
		isUUID(searchString);

	function clearAllFilters() {
		modelIdFilters = [];
		isFiltersOpen = false;
		aspectRatioFilters = [];
		if (isUUID(searchString)) {
			clearSearchString();
		}
		clearUsernameFilters();
	}

	function search() {
		setSearchString();
		if ($page.url.pathname === '/gallery') {
			logGallerySearch({
				'SC - Locale': $locale,
				'SC - User Id': $sessionStore?.user.id,
				'SC - Stripe Product Id': $userSummary?.product_id,
				'SC - App Version': $appVersion
			});
		} else if ($page.url.pathname === '/history') {
			logHistorySearch({
				'SC - Locale': $locale,
				'SC - User Id': $sessionStore?.user.id,
				'SC - Stripe Product Id': $userSummary?.product_id,
				'SC - App Version': $appVersion
			});
		}
	}

	function onSearchStringLocalChanged() {
		if (!browser || searchStringLocal) return;
		resetSearchString();
	}

	function resetSearchString() {
		searchString = '';
	}

	function setSearchString() {
		if (!searchStringLocal) {
			resetSearchString();
			return;
		}
		searchString = searchStringLocal;
	}

	function onKeyPress(
		e: KeyboardEvent & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		const key = e.code;
		if (key === 'Enter' && $isTouchscreen) {
			inputElement.blur();
		}
	}

	function toggleFiltersPanel() {
		isFiltersOpen = !isFiltersOpen;
	}

	function clearSearchString() {
		searchStringLocal = '';
		searchString = '';
	}

	function clearUsernameFilters() {
		usernameSearchStringLocal = '';
		usernameFilters = [];
	}

	async function onUsernameFieldSubmit() {
		if (!usernameSearchStringLocal) return;
		if (!usernameFilters) usernameFilters = [];
		const arr = usernameSearchStringLocal
			.replaceAll(' ', '')
			.split(',')
			.map((i) => i.toLowerCase());
		const filteredArr = arr.filter((i) => !usernameFilters?.includes(i));
		usernameFilters = [...usernameFilters, ...filteredArr];
		usernameSearchStringLocal = '';
		usernameInputElement?.focus();
	}
</script>

<div class="flex w-full flex-col items-center">
	<form on:submit|preventDefault={search} class="flex w-full gap-1.5">
		<div class="flex min-w-0 flex-1">
			<Input
				onFocus={() => (searchInputIsFocused = true)}
				onBlur={() => (searchInputIsFocused = false)}
				{disabled}
				class="w-full"
				enterkeyhint="search"
				{onKeyPress}
				bind:value={searchStringLocal}
				bind:inputElement
				title={$LL.Gallery.SearchInput.Title()}
				hasIcon
				hasClearButton
				bg="bg-secondary"
				shadow={inputShadow}
				onClearButtonClicked={resetSearchString}
				iconForButton={IconSearch}
				iconForButtonLabel={$LL.Gallery.SearchInput.Title()}
			>
				<IconSearch slot="icon" class="h-full w-full" />
			</Input>
		</div>
		<SubtleButton
			class="px-3 py-2 md:p-3"
			noPadding
			label={isFiltersOpen ? 'Collapse Filters' : 'Expand Filters'}
			shadow={inputShadow}
			hasRing={false}
			onClick={toggleFiltersPanel}
		>
			<Morpher morphed={isFiltersOpen}>
				<div slot="0" class="h-6 w-6 md:h-7 md:w-7">
					<IconFilter
						class="h-full w-full transform text-c-on-bg transition {isFiltersOpen
							? 'rotate-90'
							: 'rotate-0'} not-touch:group-hover:text-c-primary"
					/>
				</div>
				<div slot="1" class="h-6 w-6 md:h-7 md:w-7">
					<IconChevronDown
						class="h-full w-full transform text-c-on-bg transition {isFiltersOpen
							? 'rotate-180'
							: 'rotate-90'} not-touch:group-hover:text-c-primary"
					/>
				</div>
			</Morpher>
		</SubtleButton>
	</form>
	{#if isFiltersOpen}
		<div class="flex w-full flex-col pt-3">
			<div
				in:fly={{ duration: 150, easing: quadOut, y: -12, opacity: 0 }}
				class="flex w-full flex-col items-center justify-center gap-3 px-0.5 md:flex-row"
			>
				<TabLikeFilterDropdown
					class="w-full md:w-1/3"
					name={$LL.Home.ModelDropdown.Title()}
					nameIcon={IconBrain}
					bind:values={modelIdFilters}
					items={$availableModelIdDropdownItems}
				/>
				<TabLikeFilterDropdown
					class="w-full md:w-1/3"
					name={$LL.Home.AspectRatioDropdown.Title()}
					nameIcon={IconDimensions}
					bind:values={aspectRatioFilters}
					items={$aspectRatioDropdownItems}
				/>
				{#if type === 'gallery' || type === 'admin-gallery'}
					<form on:submit|preventDefault={onUsernameFieldSubmit} class="w-full md:w-1/3">
						<TabLikeInput
							name={$LL.Gallery.UsernameFilterInput.Title()}
							placeholder={$LL.Gallery.UsernameFilterInput.Placeholder()}
							class="w-full"
							inputmode="search"
							type="text"
							icon={IconUserAlt}
							bind:inputElement={usernameInputElement}
							bind:value={usernameSearchStringLocal}
							dontHandleKeypress
						/>
					</form>
				{/if}
			</div>
		</div>
	{/if}
	{#if hasAnyFilter}
		<div class="mt-0.5 flex w-full justify-center px-0.5">
			<div class="flex flex-wrap justify-start gap-2 pt-3">
				{#if hasAnyFilter}
					<TagButton
						icon={IconTrashcan}
						hasMaxWidth={false}
						hasCancelIcon={false}
						onClick={clearAllFilters}
						text={$LL.Shared.ClearAllButton()}
						color="secondary"
					/>
				{/if}
				{#if isUUID(searchString)}
					<TagButton
						icon={IconImageSearch}
						hasMaxWidth={false}
						hasCancelIcon={true}
						onClick={clearSearchString}
						text={$LL.Shared.SimilarToTitle({ item: searchString.slice(0, 6) })}
						color="primary"
					/>
				{/if}
				{#each modelIdFilters as modelIdFilter}
					<TagButton
						icon={IconBrain}
						text={$LL.Home.ModelTag({ modelName: $modelIdToDisplayName[modelIdFilter] })}
						onClick={() => {
							modelIdFilters = modelIdFilters.filter((i) => i !== modelIdFilter);
						}}
					/>
				{/each}
				{#each aspectRatioFilters as aspectRatioFilter}
					<TagButton
						icon={IconDimensions}
						text={$aspectRatioDropdownItems.find((i) => i.value === aspectRatioFilter)?.label || ''}
						onClick={() => {
							aspectRatioFilters = aspectRatioFilters.filter((i) => i !== aspectRatioFilter);
						}}
					/>
				{/each}
				{#if usernameFilters !== undefined && usernameFilters.length > 0}
					{#each usernameFilters as usernameFilter}
						<TagButton
							icon={IconUserAlt}
							text={$LL.Gallery.UsernameFilterInput.Tag({ username: usernameFilter })}
							onClick={() => {
								if (usernameFilters === undefined) return;
								usernameFilters = usernameFilters.filter((i) => i !== usernameFilter);
							}}
						/>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</div>
