<script lang="ts">
	import DropdownItem from '$components/DropdownItem.svelte';
	import IconLocale from '$components/icons/IconLocale.svelte';
	import { locale, setLocale } from '$i18n/i18n-svelte';
	import { isLocale, locales } from '$i18n/i18n-util';
	import { loadLocaleAsync } from '$i18n/i18n-util.async';
	import { defaultLocale, modalCloseDelay } from '$ts/constants/main';
	import { languageName } from '$ts/helpers/languageName';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { localeLS } from '$ts/stores/localeLS';
	import type { TCurrentSettingsPage } from '$ts/types/main';

	export let closeSettings: () => void;
	export let height: number | undefined;
	export let currentPage: TCurrentSettingsPage;

	const switchToLocale = async (loc: Locales) => {
		if (!isLocale(loc) || (loc === $locale && loc === $localeLS)) return;
		await loadLocaleAsync(loc);
		setLocale(loc);
		localeLS.set(loc);
		document.querySelector('html')?.setAttribute('lang', loc);
	};
</script>

<div
	bind:clientHeight={height}
	class="w-full bg-c-bg-secondary rounded-b-xl shadow-settings-page shadow-c-shadow/[var(--o-shadow-stronger)] 
	flex flex-col justify-start overflow-hidden relative z-0"
>
	{#each locales as locale}
		<DropdownItem
			disabled={currentPage === 'settings'}
			onClick={async () => {
				await switchToLocale(locale);
				setTimeout(() => {
					closeSettings();
				}, modalCloseDelay);
			}}
		>
			<div class="flex-1 min-w-0 flex items-center overflow-hidden gap-3">
				<div class="w-5 h-5 rounded-sm overflow-hidden">
					<IconLocale {locale} class="w-full h-full" />
				</div>
				<p
					class="flex-1 min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap text-left
           transition text-c-on-bg {!$isTouchscreen ? 'group-hover:text-c-primary' : ''}"
				>
					{languageName(locale).of(locale)}
				</p>
			</div>
		</DropdownItem>
	{/each}
</div>
