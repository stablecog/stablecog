<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { logGallerySearch } from '$ts/helpers/loggers';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { appVersion } from '$ts/stores/appVersion';
	import { userSummary } from '$ts/stores/user/summary';
	import Input from './Input.svelte';
	import IconSearch from './icons/IconSearch.svelte';

	export let disabled = false;
	export let searchString: string;
	export let inputShadow: 'normal' | 'strongest' = 'normal';

	let searchStringLocal: string;

	function search() {
		setSearchString();
		logGallerySearch({
			'SC - Search Query': searchString,
			'SC - Advanced Mode': $advancedModeApp,
			'SC - Locale': $locale,
			'SC - User Id': $page.data.session?.user.id,
			'SC - Stripe Product Id': $userSummary?.product_id,
			'SC - App Version': $appVersion
		});
	}

	function setSearchString() {
		if (!searchStringLocal) {
			searchString = '';
			return;
		}
		searchString = searchStringLocal;
	}
</script>

<form on:submit|preventDefault={search} class="w-full max-w-full flex gap-2">
	<Input
		{disabled}
		class="flex-1 min-w-0"
		bind:value={searchStringLocal}
		title={$LL.Gallery.SearchInput.Title()}
		hasIcon
		hasClearButton
		bg="bg-secondary"
		shadow={inputShadow}
		onClearButtonClicked={setSearchString}
	>
		<IconSearch slot="icon" class="w-full h-full" />
	</Input>
</form>
