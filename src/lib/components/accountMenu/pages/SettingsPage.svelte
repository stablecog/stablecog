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
	<div class="flex w-full flex-col justify-start bg-c-bg-secondary">
		<DropdownItem
			onClick={() => {
				const val = $themeApp === 'dark' ? 'light' : 'dark';
				themeApp.set(val);
				theme.set(val);
			}}
		>
			<div class="flex min-w-0 flex-1 items-center justify-between gap-2">
				<div class="flex min-w-0 flex-1 items-center justify-start gap-2.5">
					<IconDarkMode
						class="text-c-text h-6 w-6 transition not-touch:group-hover:text-c-primary"
					/>
					<p
						class="min-w-0 flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap text-left
						text-c-on-bg transition not-touch:group-hover:text-c-primary"
					>
						{$LL.Settings.DarkModeToggle()}
					</p>
				</div>
				<ToggleIndicator isToggled={$themeApp !== 'light'} />
			</div>
		</DropdownItem>
		<DropdownItem onClick={() => setAccountMenuDropdownPage('language')}>
			<div class="flex min-w-0 flex-1 items-center justify-between gap-2">
				<div class="flex min-w-0 flex-1 items-center justify-start gap-2.5">
					<IconLanguage
						class="text-c-text h-6 w-6 transition not-touch:group-hover:text-c-primary"
					/>
					<div class="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden">
						<div class="h-5 w-5 flex-shrink-0 overflow-hidden rounded-sm">
							<IconLocale type={$locale} class="h-full w-full" />
						</div>
						<p
							class="min-w-0 flex-shrink overflow-hidden overflow-ellipsis whitespace-nowrap
							text-left text-c-on-bg transition not-touch:group-hover:text-c-primary"
						>
							{languageName($locale).of($locale)}
						</p>
					</div>
				</div>
			</div>
		</DropdownItem>
	</div>
</PageWrapper>
