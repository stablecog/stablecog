<script lang="ts">
	import DropdownItem from '$components/DropdownItem.svelte';
	import IconDarkMode from '$components/icons/IconDarkMode.svelte';
	import IconLanguage from '$components/icons/IconLanguage.svelte';
	import IconLocale from '$components/icons/IconLocale.svelte';
	import ScrollAreaWithChevron from '$components/ScrollAreaWithChevron.svelte';
	import ToggleIndicator from '$components/ToggleIndicator.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { languageName } from '$ts/helpers/language';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { theme, themeApp } from '$ts/stores/theme';
	import type { TCurrentSettingsPage } from '$ts/types/main';

	export let navigateToLanguagePage: () => void;
	export let height: number | undefined;
	export let currentPage: TCurrentSettingsPage;
</script>

<ScrollAreaWithChevron
	bind:clientHeight={height}
	class="w-full flex flex-col justify-start max-h-[50vh] relative"
>
	<div class="w-full bg-c-bg-secondary flex flex-col justify-start">
		<DropdownItem
			disabled={currentPage !== 'settings'}
			onClick={() => {
				const val = $themeApp === 'dark' ? 'light' : 'dark';
				themeApp.set(val);
				theme.set(val);
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
				<ToggleIndicator isToggled={$themeApp !== 'light'} />
			</div>
		</DropdownItem>
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
</ScrollAreaWithChevron>
