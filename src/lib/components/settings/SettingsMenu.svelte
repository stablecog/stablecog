<script lang="ts">
	import DropdownWrapper from '$components/DropdownWrapper.svelte';
	import IconBack from '$components/icons/IconBack.svelte';
	import LanguagePage from '$components/settings/pages/LanguagePage.svelte';
	import SettingsPage from '$components/settings/pages/SettingsPage.svelte';
	import LL from '$i18n/i18n-svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { TCurrentSettingsPage } from '$ts/types/main';

	export let onSwitchServerClick: () => void;
	export let closeSettings: () => void;

	let currentPage: TCurrentSettingsPage = 'settings';
	let settingsPageHeight: number | undefined;
	let languagePageHeight: number | undefined;

	const navigateToLanguagePage = () => (currentPage = 'language');
</script>

<DropdownWrapper class="w-80 max-w-[calc(100vw-1.5rem)]">
	<div class="w-full flex">
		<button
			class="w-full relative bg-c-bg-secondary z-20 text-left px-6 h-full flex items-center transition-all self-stretch group"
			aria-label="Back"
			on:click={() => (currentPage = 'settings')}
			disabled={currentPage === 'settings'}
		>
			<div class="w-full h-full overflow-hidden z-0 absolute left-0 top-0">
				<div
					class="w-full h-full ease-out transition transform bg-c-primary/10
					absolute left-0 top-0 opacity-0 -translate-x-full {!$isTouchscreen && currentPage === 'language'
						? 'group-enabled:group-hover:translate-x-0 group-enabled:group-hover:opacity-100'
						: ''}"
				/>
			</div>
			<div
				class="transition-all transform {currentPage === 'language'
					? 'w-6 h-6 opacity-100 -ml-1 mr-2'
					: 'w-0 h-0 p-0 opacity-0 mx-0'} {!$isTouchscreen && currentPage === 'language'
					? 'group-hover:-translate-x-1'
					: ''}"
			>
				<IconBack
					class="w-full h-full transition {!$isTouchscreen ? 'group-hover:text-c-primary' : ''}"
				/>
			</div>
			<p
				class="py-4 flex-1 transition min-w-0 overflow-hidden overflow-ellipsis font-bold text-xl {!$isTouchscreen &&
				currentPage === 'language'
					? 'group-hover:text-c-primary'
					: ''}"
			>
				{currentPage === 'language' ? $LL.Language() : $LL.Settings.Title()}
			</p>
		</button>
	</div>
	<div class="w-full relative z-20">
		<div class="w-full h-2px rounded-full bg-c-bg-tertiary" />
	</div>
	<div
		style={currentPage === 'language' && languagePageHeight !== undefined
			? `height: ${languagePageHeight}px`
			: `height: ${settingsPageHeight}px`}
		class="w-full relative transition-all z-10"
	>
		<div
			class="w-full transition duration-300 {currentPage === 'settings'
				? 'opacity-100 translate-x-0'
				: 'opacity-0 -translate-x-1/3 pointer-events-none'}"
		>
			<SettingsPage
				{onSwitchServerClick}
				{navigateToLanguagePage}
				{currentPage}
				bind:height={settingsPageHeight}
			/>
		</div>
		<div
			class="absolute transition duration-300 left-0 top-0 w-full z-10 {currentPage === 'language'
				? 'translate-x-0'
				: 'translate-x-[calc(100%+1rem)] pointer-events-none'}"
		>
			<LanguagePage {closeSettings} {currentPage} bind:height={languagePageHeight} />
		</div>
	</div>
</DropdownWrapper>
