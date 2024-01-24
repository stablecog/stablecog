<script lang="ts">
	import { page } from '$app/stores';
	import SubtleButton from '$components/primitives/buttons/SubtleButton.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { logGallerySearch, logHistorySearch } from '$ts/helpers/loggers';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { appVersion } from '$ts/stores/appVersion';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { userSummary } from '$ts/stores/user/summary';
	import Input from '../primitives/Input.svelte';
	import IconSearch from '../icons/IconSearch.svelte';
	import TabLikeFilterDropdown from '$components/primitives/tabBars/TabLikeFilterDropdown.svelte';
	import {
		availableModelIdDropdownItems,
		modelIdToDisplayName,
		type TAvailableGenerationModelId
	} from '$ts/constants/generationModels';
	import Morpher from '$components/utils/Morpher.svelte';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import TagButton from '$components/primitives/buttons/TagButton.svelte';
	import IconTrashcan from '$components/icons/IconTrashcan.svelte';
	import IconBrain from '$components/icons/IconBrain.svelte';
	import { browser } from '$app/environment';
	import { isUUID } from '$ts/helpers/uuid';
	import IconImageSearch from '$components/icons/IconImageSearch.svelte';
	import { setUrlParam } from '$ts/helpers/setUrlParam';
	import { quadOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import TabLikeInput from '$components/primitives/tabBars/TabLikeInput.svelte';
	import IconUserAlt from '$components/icons/IconUserAlt.svelte';
	import IconFilter from '$components/icons/IconFilter.svelte';

	export let disabled = false;
	export let searchString: string;
	export let inputShadow: 'normal' | 'strongest' = 'normal';
	export let modelIdFilters: TAvailableGenerationModelId[];
	export let usernameFilters: string[] | undefined = undefined;
	export let searchInputIsFocused = false;
	export let type: 'gallery' | 'default' = 'default';

	let searchStringLocal = searchString ?? '';
	let usernameSearchStringLocal = '';
	let inputElement: HTMLInputElement;
	let isFiltersOpen = false;
	let usernameInputElement: HTMLInputElement;

	$: searchStringLocal, onSearchStringLocalChanged();
	$: modelIdFilters,
		setUrlParam({
			key: 'mi',
			value: modelIdFilters
		});
	$: searchString, setUrlParam({ key: 'q', value: searchString });
	$: usernameFilters, setUrlParam({ key: 'un', value: usernameFilters });
	$: hasAnyFilter =
		modelIdFilters?.length > 0 ||
		(usernameFilters && usernameFilters.length > 0) ||
		isUUID(searchString);

	function clearAllFilters() {
		modelIdFilters = [];
		isFiltersOpen = false;
		if (isUUID(searchString)) {
			clearSearchString();
		}
		clearUsernameFilters();
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
		const arr = usernameSearchStringLocal.replaceAll(' ', '').split(',');
		const filteredArr = arr.filter((i) => !usernameFilters?.includes(i));
		usernameFilters = [...usernameFilters, ...filteredArr];
		usernameSearchStringLocal = '';
		usernameInputElement?.focus();
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
					<IconFilter
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
	{#if isFiltersOpen}
		<div
			in:fly={{ duration: 150, easing: quadOut, y: -25, opacity: 0 }}
			class="w-full flex flex-col md:flex-row justify-center items-center px-0.5 gap-3 pt-3"
		>
			<TabLikeFilterDropdown
				class="w-full md:max-w-[15rem]"
				name={$LL.Home.ModelDropdown.Title()}
				nameIcon={IconBrain}
				bind:values={modelIdFilters}
				items={$availableModelIdDropdownItems}
			/>
			{#if type === 'gallery'}
				<form on:submit|preventDefault={onUsernameFieldSubmit} class="w-full md:max-w-[15rem]">
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
	{/if}
	{#if hasAnyFilter}
		<div class="w-full flex justify-center px-0.5 mt-0.5">
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
				{#each modelIdFilters as item}
					<TagButton
						icon={IconBrain}
						text={$LL.Home.ModelTag({ modelName: $modelIdToDisplayName[item] })}
						onClick={() => {
							modelIdFilters = modelIdFilters.filter((i) => i !== item);
						}}
					/>
				{/each}
			</div>
		</div>
	{/if}
</div>
