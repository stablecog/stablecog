<script lang="ts">
	import { page } from '$app/stores';
	import DropdownItem from '$components/DropdownItem.svelte';
	import HealthIndicator from '$components/HealthIndicator.svelte';
	import IconAdvanced from '$components/icons/IconAdvanced.svelte';
	import IconDarkMode from '$components/icons/IconDarkMode.svelte';
	import IconGalleryFilled from '$components/icons/IconGalleryFilled.svelte';
	import ToggleIndicator from '$components/ToggleIndicator.svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import { pLogSubmitToGallery, uLogSubmitToGallery } from '$ts/helpers/loggers';
	import { parseUrlStr } from '$ts/helpers/parseUrlStr';
	import { advancedMode } from '$ts/stores/advancedMode';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { serverUrl } from '$ts/stores/serverUrl';
	import { shouldSubmitToGallery } from '$ts/stores/shouldSubmitToGallery';
	import { theme } from '$ts/stores/theme';
	import IconServer from './icons/IconServer.svelte';
	import LL from '$i18n/i18n-svelte';

	export let onSwitchServerClick: () => void;
	export let closeSettings: () => void;

	/* export const switchLocale = async () => {
		const newLocale = locales.find((l) => l !== $locale);
		if (!newLocale) return;
		await loadLocaleAsync(newLocale);
		setLocale(newLocale);
		language.set(newLocale);
		document.querySelector('html')?.setAttribute('lang', newLocale);
	}; */
</script>

<div
	transition:expandCollapse|local={{ duration: 200 }}
	class="w-80 max-w-[calc(100vw-1.5rem)] ring-2 ring-c-bg-tertiary bg-c-bg-secondary rounded-xl flex flex-col justify-start shadow-lg 
  	shadow-c-shadow/[var(--o-shadow-strong)] absolute right-0 top-0 z-50 overflow-hidden"
>
	<div class="w-full flex flex-col justify-start overflow-hidden z-0 relative">
		<div class="w-full flex flex-col justify-start">
			{#if $serverUrl}
				<DropdownItem twoLine onClick={onSwitchServerClick}>
					<div class="flex-1 min-w-0 flex flex-col items-start gap-1.5 relative">
						<div class="w-full flex items-center justify-start gap-2.5">
							<IconServer
								class="transition w-6 h-6 text-c-text {!$isTouchscreen
									? 'group-hover:text-c-primary'
									: ''}"
							/>
							<p
								class="w-full text-left transition text-c-on-bg {!$isTouchscreen
									? 'group-hover:text-c-primary'
									: ''}"
							>
								{$LL.Settings.SwitchServerButton()}
							</p>
						</div>
						<div class="w-full flex items-center gap-3 px-0.5">
							{#if $page.url.pathname === '/' || $page.url.pathname === '/history'}
								<HealthIndicator class="-mx-3 -my-2.5" />
							{/if}

							<p
								class="flex-shrink min-w-0 text-xs text-left break-all font-normal text-c-on-bg/60"
							>
								{$serverUrl ? parseUrlStr($serverUrl) : 'Not connected'}
							</p>
						</div>
					</div>
				</DropdownItem>
			{/if}
			<DropdownItem
				onClick={() => {
					const val = $shouldSubmitToGallery === undefined ? true : !$shouldSubmitToGallery;
					shouldSubmitToGallery.set(val);
					if (val) {
						pLogSubmitToGallery('On');
						uLogSubmitToGallery('On');
					} else {
						pLogSubmitToGallery('Off');
						uLogSubmitToGallery('Off');
					}
					setTimeout(() => {
						closeSettings();
					}, 100);
				}}
			>
				<div class="flex-1 flex min-w-0 items-center justify-between gap-2">
					<div class="flex-1 min-w-0 flex items-center justify-start gap-2.5">
						<IconGalleryFilled
							class="transition w-6 h-6 text-c-text {!$isTouchscreen
								? 'group-hover:text-c-primary'
								: ''}"
						/>
						<p
							class="flex-1 min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap text-left transition text-c-on-bg {!$isTouchscreen
								? 'group-hover:text-c-primary'
								: ''}"
						>
							{$LL.Settings.SubmitToGalleryToggle()}
						</p>
					</div>
					<ToggleIndicator
						isToggled={$shouldSubmitToGallery === undefined ? false : $shouldSubmitToGallery}
					/>
				</div>
			</DropdownItem>
			<DropdownItem
				onClick={() => {
					advancedMode.set($advancedMode === false ? true : false);
					setTimeout(() => {
						closeSettings();
					}, 100);
				}}
			>
				<div class="flex-1 flex min-w-0 items-center justify-between gap-2">
					<div class="flex-1 min-w-0 flex items-center justify-start gap-2.5">
						<IconAdvanced
							class="transition w-6 h-6 text-c-text {!$isTouchscreen
								? 'group-hover:text-c-primary'
								: ''}"
						/>
						<p
							class="flex-1 min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap text-left transition text-c-on-bg {!$isTouchscreen
								? 'group-hover:text-c-primary'
								: ''}"
						>
							{$LL.Settings.AdvancedModeToggle()}
						</p>
					</div>
					<ToggleIndicator isToggled={$advancedMode !== false} />
				</div>
			</DropdownItem>
			<DropdownItem
				onClick={() => {
					theme.set($theme === 'dark' ? 'light' : 'dark');
					setTimeout(() => {
						closeSettings();
					}, 100);
				}}
			>
				<div class="flex-1 flex min-w-0 items-center justify-between gap-2">
					<div class="flex-1 min-w-0 flex items-center justify-start gap-2.5">
						<IconDarkMode
							class="transition w-6 h-6 text-c-text {!$isTouchscreen
								? 'group-hover:text-c-primary'
								: ''}"
						/>
						<p
							class="flex-1 min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap text-left transition text-c-on-bg {!$isTouchscreen
								? 'group-hover:text-c-primary'
								: ''}"
						>
							{$LL.Settings.DarkModeToggle()}
						</p>
					</div>
					<ToggleIndicator isToggled={$theme !== 'light'} />
				</div>
			</DropdownItem>
			<!-- <DropdownItem
				onClick={() => {
					switchLocale();
					setTimeout(() => {
						closeSettings();
					}, 100);
				}}
			>
				<div class="flex-1 flex min-w-0 items-center justify-between gap-2">
					<div class="flex-1 min-w-0 flex items-center justify-start gap-2.5">
						<IconLanguage
							class="transition w-6 h-6 text-c-text {!$isTouchscreen
								? 'group-hover:text-c-primary'
								: ''}"
						/>
						<div class="flex-1 min-w-0 flex items-center overflow-hidden gap-2">
							<div class="w-4.5 h-4.5 rounded overflow-hidden">
								<IconLocale locale={$locale} class="w-full h-full" />
							</div>
							<p
								class="flex-1 min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap text-left transition text-c-on-bg {!$isTouchscreen
									? 'group-hover:text-c-primary'
									: ''}"
							>
								{languageName($locale).of($locale)}
							</p>
						</div>
					</div>
				</div>
			</DropdownItem> -->
		</div>
	</div>
</div>
