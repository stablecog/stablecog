<script lang="ts">
	import type { TAccountDropdownPage } from '$components/accountMenu/types';
	import AccountPage from '$components/accountMenu/pages/AccountPage.svelte';
	import SettingsPage from '$components/accountMenu/pages/SettingsPage.svelte';
	import LanguagePage from '$components/accountMenu/pages/LanguagePage.svelte';
	import Header from '$components/accountMenu/Header.svelte';
	import LL from '$i18n/i18n-svelte';
	import DropdownWrapperTranslate from '$components/DropdownWrapperTranslate.svelte';

	export let closeMenu: () => void;
	let currentPage: TAccountDropdownPage = 'account';

	let heights: Record<TAccountDropdownPage, number> = {
		account: 0,
		settings: 0,
		language: 0
	};

	let titles: Record<TAccountDropdownPage, string>;

	$: titles = {
		account: $LL.Account.PageTitle(),
		settings: $LL.Settings.Title(),
		language: $LL.Language()
	};

	const onBackButtonClickedMap: Record<TAccountDropdownPage, (() => void) | undefined> = {
		account: undefined,
		settings: () => setAccountMenuDropdownPage('account'),
		language: () => setAccountMenuDropdownPage('settings')
	};

	async function setAccountMenuDropdownPage(page: TAccountDropdownPage) {
		currentPage = page;
	}
</script>

<DropdownWrapperTranslate class="w-72 max-w-[calc(100vw-1.25rem)]">
	<Header title={titles[currentPage]} onBackButtonClicked={onBackButtonClickedMap[currentPage]} />
	<div
		style="height: {heights[currentPage] ? `${heights[currentPage]}px` : 'auto'}"
		class="w-full flex flex-col relative transition-all duration-150"
	>
		<AccountPage
			bind:height={heights['account']}
			{closeMenu}
			{setAccountMenuDropdownPage}
			{currentPage}
		/>
		<SettingsPage bind:height={heights['settings']} {setAccountMenuDropdownPage} {currentPage} />
		<LanguagePage bind:height={heights['language']} {closeMenu} {currentPage} />
	</div>
</DropdownWrapperTranslate>
