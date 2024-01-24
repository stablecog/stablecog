<script lang="ts">
	import PageWrapper from '$components/accountMenu/PageWrapper.svelte';
	import type { TAccountDropdownPage } from '$components/accountMenu/types';
	import DropdownItem from '$components/primitives/dropdown/DropdownItem.svelte';
	import IconDarkMode from '$components/icons/IconDarkMode.svelte';
	import IconLanguage from '$components/icons/IconLanguage.svelte';
	import IconLocale from '$components/icons/IconLocale.svelte';
	import ToggleIndicator from '$components/primitives/ToggleIndicator.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { languageName } from '$ts/helpers/language';
	import { theme, themeApp } from '$ts/stores/theme';

	export let setAccountMenuDropdownPage: (p: TAccountDropdownPage) => void;
	export let height: number;
	export let currentPage: TAccountDropdownPage;
</script>

<PageWrapper bind:height {currentPage} thisPage="settings">
	<div class="w-full bg-c-bg-secondary flex flex-col justify-start">
		<DropdownItem
			onClick={() => {
				const val = $themeApp === 'dark' ? 'light' : 'dark';
				themeApp.set(val);
				theme.set(val);
			}}
		>
			<div class="flex-1 flex min-w-0 items-center justify-between gap-2">
				<div class="flex-1 min-w-0 flex items-center justify-start gap-2.5">
					<IconDarkMode
						class="transition w-6 h-6 text-c-text not-touch:group-hover:text-c-primary"
					/>
					<p
						class="flex-1 min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap text-left
						transition text-c-on-bg not-touch:group-hover:text-c-primary"
					>
						{$LL.Settings.DarkModeToggle()}
					</p>
				</div>
				<ToggleIndicator isToggled={$themeApp !== 'light'} />
			</div>
		</DropdownItem>
		<DropdownItem onClick={() => setAccountMenuDropdownPage('language')}>
			<div class="flex-1 flex min-w-0 items-center justify-between gap-2">
				<div class="flex-1 min-w-0 flex items-center justify-start gap-2.5">
					<IconLanguage
						class="transition w-6 h-6 text-c-text not-touch:group-hover:text-c-primary"
					/>
					<div class="flex-1 min-w-0 flex items-center overflow-hidden gap-2.5">
						<div class="w-5 h-5 rounded-sm overflow-hidden flex-shrink-0">
							<IconLocale type={$locale} class="w-full h-full" />
						</div>
						<p
							class="flex-shrink min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap
							text-left transition text-c-on-bg not-touch:group-hover:text-c-primary"
						>
							{languageName($locale).of($locale)}
						</p>
					</div>
				</div>
			</div>
		</DropdownItem>
	</div>
</PageWrapper>
