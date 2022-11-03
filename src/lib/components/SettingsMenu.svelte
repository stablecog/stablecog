<script lang="ts">
	import { page } from '$app/stores';
	import DropdownItem from '$components/DropdownItem.svelte';
	import HealthIndicator from '$components/HealthIndicator.svelte';
	import IconAdvanced from '$components/icons/IconAdvanced.svelte';
	import IconDarkMode from '$components/icons/IconDarkMode.svelte';
	import IconGalleryFilled from '$components/icons/IconGalleryFilled.svelte';
	import ToggleIndicator from '$components/ToggleIndicator.svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import { parseUrlStr } from '$ts/helpers/parseUrlStr';
	import { advancedMode } from '$ts/stores/advancedMode';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { serverUrl } from '$ts/stores/serverUrl';
	import { shouldSubmitToGallery } from '$ts/stores/shouldSubmitToGallery';
	import { theme } from '$ts/stores/theme';
	import IconServer from './icons/IconServer.svelte';

	export let onSwitchServerClick: () => void;
	export let closeSettings: () => void;
</script>

<div
	transition:expandCollapse|local={{ duration: 200 }}
	class="w-80 max-w-[80vw] ring-2 ring-c-bg-tertiary bg-c-bg-secondary rounded-xl flex flex-col justify-start shadow-lg 
  	shadow-c-shadow/[var(--o-shadow-strong)] absolute right-0 top-0 z-50 overflow-hidden"
>
	<div class="w-full flex flex-col justify-start overflow-hidden z-0 relative">
		<div class="w-full flex flex-col justify-start">
			{#if $serverUrl}
				<DropdownItem onClick={onSwitchServerClick}>
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
								Switch Server
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
					shouldSubmitToGallery.set($shouldSubmitToGallery ? false : true);
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
							Submit to Gallery
						</p>
					</div>
					<ToggleIndicator isToggled={$shouldSubmitToGallery} />
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
							Advanced Mode
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
							Dark Mode
						</p>
					</div>
					<ToggleIndicator isToggled={$theme !== 'light'} />
				</div>
			</DropdownItem>
		</div>
	</div>
</div>
