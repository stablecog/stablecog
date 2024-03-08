<script lang="ts">
	import DropdownItem from '$components/primitives/dropdown/DropdownItem.svelte';
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
	<div class="flex w-full flex-col justify-start bg-c-bg-secondary">
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
				<div class="flex min-w-0 flex-1 items-center gap-3 overflow-hidden">
					<div class="h-5 w-5 overflow-hidden rounded-sm">
						<IconLocale type={locale} class="h-full w-full" />
					</div>
					<p
						class="min-w-0 flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap text-left
							 text-c-on-bg transition not-touch:group-hover:text-c-primary"
					>
						{languageName(locale).of(locale)}
					</p>
				</div>
			</DropdownItem>
		{/each}
	</div>
</PageWrapper>
