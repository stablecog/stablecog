<script lang="ts">
	import { page } from '$app/stores';
	import DropdownItem from '$components/DropdownItem.svelte';
	import HealthIndicator from '$components/HealthIndicator.svelte';
	import IconAdvanced from '$components/icons/IconAdvanced.svelte';
	import IconDarkMode from '$components/icons/IconDarkMode.svelte';
	import IconGalleryFilled from '$components/icons/IconGalleryFilled.svelte';
	import IconLanguage from '$components/icons/IconLanguage.svelte';
	import IconLocale from '$components/icons/IconLocale.svelte';
	import IconServer from '$components/icons/IconServer.svelte';
	import ToggleIndicator from '$components/ToggleIndicator.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { languageName } from '$ts/helpers/languageName';
	import { pLogSubmitToGallery, uLogSubmitToGallery } from '$ts/helpers/loggers';
	import { parseUrlStr } from '$ts/helpers/parseUrlStr';
	import { advancedMode } from '$ts/stores/advancedMode';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { serverUrl } from '$ts/stores/serverUrl';
	import { shouldSubmitToGallery } from '$ts/stores/shouldSubmitToGallery';
	import { theme } from '$ts/stores/theme';
	import type { TCurrentSettingsPage } from '$ts/types/main';

	export let onSwitchServerClick: () => void;
	export let navigateToLanguagePage: () => void;
	export let height: number | undefined;
	export let currentPage: TCurrentSettingsPage;
</script>

<div bind:clientHeight={height} class="w-full bg-c-bg-secondary flex flex-col justify-start">
	{#if $serverUrl}
		<DropdownItem disabled={currentPage !== 'settings'} twoLine onClick={onSwitchServerClick}>
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
					<p class="flex-shrink min-w-0 text-xs text-left break-all font-normal text-c-on-bg/60">
						{$serverUrl ? parseUrlStr($serverUrl) : 'Not connected'}
					</p>
				</div>
			</div>
		</DropdownItem>
	{/if}
	<DropdownItem
		disabled={currentPage !== 'settings'}
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
		disabled={currentPage !== 'settings'}
		onClick={() => {
			advancedMode.set($advancedMode === false ? true : false);
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
		disabled={currentPage !== 'settings'}
		onClick={() => {
			theme.set($theme === 'dark' ? 'light' : 'dark');
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
	<div class="w-full flex flex-col relative">
		<DropdownItem disabled={currentPage !== 'settings'} onClick={navigateToLanguagePage}>
			<div class="flex-1 flex min-w-0 items-center justify-between gap-2">
				<div class="flex-1 min-w-0 flex items-center justify-start gap-2.5">
					<IconLanguage
						class="transition w-6 h-6 text-c-text {!$isTouchscreen
							? 'group-hover:text-c-primary'
							: ''}"
					/>
					<div class="flex-1 min-w-0 flex items-center overflow-hidden gap-2.5">
						<div class="w-5 h-5 rounded-sm overflow-hidden flex-shrink-0">
							<IconLocale locale={$locale} class="w-full h-full" />
						</div>
						<p
							class="flex-shrink min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap text-left transition text-c-on-bg {!$isTouchscreen
								? 'group-hover:text-c-primary'
								: ''}"
						>
							{languageName($locale).of($locale)}
						</p>
					</div>
				</div>
			</div>
		</DropdownItem>
	</div>
</div>
