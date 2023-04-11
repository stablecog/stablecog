<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
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

	let searchTimeout: NodeJS.Timeout;
	let searchDebounceMs = 500;
	$: searchStringLocal, setDebouncedSearch(searchStringLocal);

	async function setDebouncedSearch(searchStringLocal: string | undefined) {
		if (!browser) return;
		clearTimeout(searchTimeout);
		if (!searchStringLocal) {
			searchString = '';
			return;
		}
		searchTimeout = setTimeout(async () => {
			if (searchStringLocal) {
				searchString = searchStringLocal;
				if ($page.url.pathname === '/gallery') {
					logGallerySearch({
						'SC - Search Query': searchStringLocal,
						'SC - Advanced Mode': $advancedModeApp,
						'SC - Locale': $locale,
						'SC - User Id': $page.data.session?.user.id,
						'SC - Stripe Product Id': $userSummary?.product_id,
						'SC - App Version': $appVersion
					});
				}
			} else {
				searchString = '';
			}
		}, searchDebounceMs);
	}
</script>

<Input
	{disabled}
	class="max-w-full"
	bind:value={searchStringLocal}
	title={$LL.Gallery.SearchInput.Title()}
	hasIcon
	hasClearButton
	bg="bg-secondary"
	shadow={inputShadow}
>
	<IconSearch slot="icon" class="w-full h-full" />
</Input>
