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
	import { tooltip } from '$ts/actions/tooltip';
	import IconBrain from '$components/icons/IconBrain.svelte';
	import { modelTooltip } from '$ts/constants/tooltips';
	import { browser } from '$app/environment';

	export let disabled = false;
	export let searchString: string;
	export let inputShadow: 'normal' | 'strongest' = 'normal';
	export let modelIdFilters: TAvailableGenerationModelId[];
	export let searchInputIsFocused = false;

	let searchStringLocal = searchString ?? '';
	let inputElement: HTMLInputElement;
	let isFiltersOpen = false;

	$: hasAnyFilter = modelIdFilters?.length > 0;
	$: searchStringLocal, onSearchStringLocalChanged();

	function clearAllFilters() {
		modelIdFilters = [];
		isFiltersOpen = false;
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
		const params = $page.url.searchParams;
		params.delete('q');
		const paramsString = params.toString();
		window.history.replaceState(
			{},
			'',
			`${$page.url.pathname}${paramsString !== '' ? '?' : ''}${params}`
		);
	}

	function setSearchString() {
		if (!searchStringLocal) {
			resetSearchString();
			return;
		}
		searchString = searchStringLocal;
		const params = $page.url.searchParams;
		params.set('q', searchString);
		const paramsString = params.toString();
		window.history.replaceState(
			{},
			'',
			`${$page.url.pathname}${paramsString !== '' ? '?' : ''}${params}`
		);
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
</script>

<div class="w-full flex flex-col z-40">
	<div class="w-full flex gap-1.5">
		<form on:submit|preventDefault={search} class="flex-1 min-w-0 flex gap-2">
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
			>
				<IconSearch slot="icon" class="w-full h-full" />
			</Input>
		</form>
		<SubtleButton shadow={inputShadow} hasRing={false} onClick={toggleFiltersPanel}>
			<Morpher morphed={isFiltersOpen}>
				<div slot="0" class="w-7 h-7">
					<IconAdjustmentsVertical
						class="w-full h-full text-c-on-bg transition transform {isFiltersOpen
							? 'rotate-90'
							: 'rotate-0'} not-touch:group-hover/iconbutton:text-c-primary"
					/>
				</div>
				<div slot="1" class="w-7 h-7">
					<IconChevronDown
						class="w-full h-full text-c-on-bg transition transform {isFiltersOpen
							? 'rotate-180'
							: 'rotate-90'} not-touch:group-hover/iconbutton:text-c-primary"
					/>
				</div>
			</Morpher>
		</SubtleButton>
	</div>
	{#if isFiltersOpen}
		<div
			transition:expandCollapse|local={{ duration: 200, easing: quadOut }}
			class="w-full flex flex-col"
		>
			<div class="w-full flex flex-row justify-center flex-wrap pt-3 px-0.5">
				<TabLikeFilterDropdown
					class="w-full md:max-w-[20rem]"
					name={$LL.Home.ModelDropdown.Title()}
					bind:values={modelIdFilters}
					items={$availableModelIdDropdownItems}
				>
					<div
						slot="title"
						use:tooltip={$modelTooltip}
						class="p-3.5 flex items-center justify-center"
					>
						<IconBrain class="w-6 h-6 text-c-on-bg/35" />
					</div>
				</TabLikeFilterDropdown>
			</div>
		</div>
	{/if}
	{#if modelIdFilters && modelIdFilters.length > 0}
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
