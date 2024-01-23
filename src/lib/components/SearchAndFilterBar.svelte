<script lang="ts">
	import { page } from '$app/stores';
	import SubtleButton from '$components/buttons/SubtleButton.svelte';
	import IconAdjustmentsVertical from '$components/icons/IconAdjustmentsVertical.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import { logGallerySearch, logHistorySearch } from '$ts/helpers/loggers';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { appVersion } from '$ts/stores/appVersion';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { userSummary } from '$ts/stores/user/summary';
	import { quadOut } from 'svelte/easing';
	import Input from './Input.svelte';
	import IconSearch from './icons/IconSearch.svelte';
	import TabLikeFilterDropdown from '$components/tabBars/TabLikeFilterDropdown.svelte';
	import {
		availableModelIdDropdownItems,
		modelIdToDisplayName,
		type TAvailableGenerationModelId
	} from '$ts/constants/generationModels';
	import Morpher from '$components/Morpher.svelte';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import TagButton from '$components/buttons/TagButton.svelte';
	import IconTrashcan from '$components/icons/IconTrashcan.svelte';
	import IconBrain from '$components/icons/IconBrain.svelte';
	import { browser } from '$app/environment';
	import { isUUID } from '$ts/helpers/uuid';
	import IconImageSearch from '$components/icons/IconImageSearch.svelte';
	import { setUrlParam } from '$ts/helpers/setUrlParam';
	import type { TTab } from '$ts/types/main';
	import { sortsDefault } from '$routes/(app)/gallery/constants';
	import TabLikeDropdown from '$components/tabBars/TabLikeDropdown.svelte';
	import IconMainSortView from '$components/icons/IconMainSortView.svelte';

	export let disabled = false;
	export let searchString: string;
	export let inputShadow: 'normal' | 'strongest' = 'normal';
	export let modelIdFilters: TAvailableGenerationModelId[];
	export let sorts: string[] | undefined = undefined;
	export let searchInputIsFocused = false;

	let searchStringLocal = searchString ?? '';
	let inputElement: HTMLInputElement;
	let isFiltersOpen = false;

	const mainSorts = ['trending', 'top', 'new'];
	let mainSortView = sorts?.find((i) => mainSorts.includes(i)) ?? 'new';

	const mainSortViews: TTab<string>[] = [
		{
			value: 'trending',
			label: $LL.Gallery.Sort.Options.Trending()
		},
		{
			value: 'top',
			label: $LL.Gallery.Sort.Options.Top()
		},
		{
			value: 'new',
			label: $LL.Gallery.Sort.Options.New()
		}
	];

	$: hasAnyFilter = modelIdFilters?.length > 0;
	$: searchStringLocal, onSearchStringLocalChanged();
	$: modelIdFilters,
		setUrlParam({
			key: 'mi',
			value: modelIdFilters
		});
	$: searchString, setUrlParam({ key: 'q', value: searchString });

	$: mainSortView, onMainSortViewChanged();
	$: sorts, setUrlParam({ key: 'sort', value: sorts, defaultValue: sortsDefault });

	function clearAllFilters() {
		modelIdFilters = [];
		isFiltersOpen = false;
		if (isUUID(searchString)) {
			clearSearchString();
		}
	}

	function search() {
		setSearchString();
		if ($page.url.pathname === '/gallery') {
			logGallerySearch({
				'SC - Advanced Mode': $advancedModeApp,
				'SC - Locale': $locale,
				'SC - User Id': $page.data.session?.user.id,
				'SC - Stripe Product Id': $userSummary?.product_id,
				'SC - App Version': $appVersion
			});
		} else if ($page.url.pathname === '/history') {
			logHistorySearch({
				'SC - Advanced Mode': $advancedModeApp,
				'SC - Locale': $locale,
				'SC - User Id': $page.data.session?.user.id,
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

	function onMainSortViewChanged() {
		if (!sorts) return;
		sorts = [mainSortView, ...sorts.filter((i) => !mainSorts.includes(i))];
	}

	function clearSearchString() {
		searchStringLocal = '';
		searchString = '';
	}
</script>

<div class="w-full flex flex-col items-center z-40">
	<form on:submit|preventDefault={search} class="w-full flex gap-1.5">
		<div class="flex-1 min-w-0 flex">
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
				<IconSearch slot="icon" class="w-full h-full" />
			</Input>
		</div>
		<SubtleButton
			class="py-2 px-3 md:p-3"
			noPadding
			label={isFiltersOpen ? 'Collapse Filters' : 'Expand Filters'}
			shadow={inputShadow}
			hasRing={false}
			onClick={toggleFiltersPanel}
		>
			<Morpher morphed={isFiltersOpen}>
				<div slot="0" class="w-6 h-6 md:w-7 md:h-7">
					<IconAdjustmentsVertical
						class="w-full h-full text-c-on-bg transition transform {isFiltersOpen
							? 'rotate-90'
							: 'rotate-0'} not-touch:group-hover/iconbutton:text-c-primary"
					/>
				</div>
				<div slot="1" class="w-6 h-6 md:w-7 md:h-7">
					<IconChevronDown
						class="w-full h-full text-c-on-bg transition transform {isFiltersOpen
							? 'rotate-180'
							: 'rotate-90'} not-touch:group-hover/iconbutton:text-c-primary"
					/>
				</div>
			</Morpher>
		</SubtleButton>
	</form>
	{#if sorts || isFiltersOpen}
		<div class="w-full flex flex-col md:flex-row justify-center items-center px-0.5 gap-3 mt-3">
			<!-- {#if sorts}
				<div class="w-full md:max-w-[15rem]">
					<TabLikeDropdown
						class="w-full"
						items={mainSortViews}
						hasTitle={false}
						name={$LL.Gallery.Sort.Title()}
						iconSet={IconMainSortView}
						bind:value={mainSortView}
					/>
				</div>
			{/if} -->
			{#if isFiltersOpen}
				<div class="w-full md:max-w-[15rem]">
					<TabLikeFilterDropdown
						class="w-full"
						name={$LL.Home.ModelDropdown.Title()}
						nameIcon={IconBrain}
						bind:values={modelIdFilters}
						items={$availableModelIdDropdownItems}
						dontScale
						hasTitle={false}
					/>
				</div>
			{/if}
		</div>
	{/if}
	{#if (modelIdFilters && modelIdFilters.length > 0) || isUUID(searchString)}
		<div class="w-full flex justify-center px-0.5 mt-0.5">
			<div class="flex flex-wrap justify-start gap-2 pt-3">
				{#if hasAnyFilter || isUUID(searchString)}
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
				{#each modelIdFilters as item}
					<TagButton
						text={$modelIdToDisplayName[item]}
						onClick={() => {
							modelIdFilters = modelIdFilters.filter((i) => i !== item);
						}}
					/>
				{/each}
			</div>
		</div>
	{/if}
</div>
