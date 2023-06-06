<script lang="ts">
	import DropdownItem from '$components/DropdownItem.svelte';
	import PageWrapper from '$components/accountMenu/PageWrapper.svelte';
	import type { TAccountDropdownPage } from '$components/accountMenu/types';
	import IconLocale from '$components/icons/IconLocale.svelte';
	import { locale, setLocale } from '$i18n/i18n-svelte';
	import { isLocale, locales } from '$i18n/i18n-util';
	import { loadLocaleAsync } from '$i18n/i18n-util.async';
	import { modalCloseDelay } from '$ts/constants/main';
	import { languageName } from '$ts/helpers/language';
	import { localeLS } from '$ts/stores/localeLS';

	export let closeMenu: () => void;
	export let height: number;
	export let currentPage: TAccountDropdownPage;

	const switchToLocale = async (loc: Locales) => {
		if (!isLocale(loc) || (loc === $locale && loc === $localeLS)) return;
		await loadLocaleAsync(loc);
		setLocale(loc);
		localeLS.set(loc);
		document.querySelector('html')?.setAttribute('lang', loc);
	};
</script>

<PageWrapper bind:height {currentPage} thisPage="language">
	<div class="w-full bg-c-bg-secondary flex flex-col justify-start">
		{#each locales as locale}
			<DropdownItem
				padding="lg"
				onClick={async () => {
					await switchToLocale(locale);
					setTimeout(() => {
						closeMenu();
					}, modalCloseDelay);
				}}
			>
				<div class="flex-1 min-w-0 flex items-center overflow-hidden gap-3">
					<div class="w-5 h-5 rounded-sm overflow-hidden">
						<IconLocale type={locale} class="w-full h-full" />
					</div>
					<p
						class="flex-1 min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap text-left
							 transition text-c-on-bg not-touch:group-hover:text-c-primary"
					>
						{languageName(locale).of(locale)}
					</p>
				</div>
			</DropdownItem>
		{/each}
	</div>
</PageWrapper>
