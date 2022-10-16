<script lang="ts">
	import DropdownItem from '$components/DropdownItem.svelte';
	import HealthIndicator from '$components/HealthIndicator.svelte';
	import IconAdvanced from '$components/icons/IconAdvanced.svelte';
	import IconDarkMode from '$components/icons/IconDarkMode.svelte';
	import ToggleIndicator from '$components/ToggleIndicator.svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import { parseUrlStr } from '$ts/helpers/parseUrlStr';
	import { advancedMode } from '$ts/stores/advancedMode';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { serverUrl } from '$ts/stores/serverUrl';
	import { theme } from '$ts/stores/theme';
	import IconServer from './icons/IconServer.svelte';

	export let onSwitchServerClick: () => void;
	export let closeSettings: () => void;
</script>

<div
	transition:expandCollapse={{ duration: 200 }}
	class="w-68 max-w-[80vw] bg-c-bg-secondary rounded-xl flex flex-col justify-start shadow-lg 
  shadow-c-shadow/[var(--o-shadow-strong)] absolute right-0 top-0 overflow-hidden z-50"
>
	<div class="w-full flex flex-col">
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
					<div class="w-full flex items-center gap-2.5 px-0.5">
						<HealthIndicator class="-mx-3 -my-2.5" />
						<p class="flex-shrink min-w-0 text-xs text-left break-all font-normal text-c-on-bg/60">
							{$serverUrl ? parseUrlStr($serverUrl) : 'Not connected'}
						</p>
					</div>
				</div>
			</DropdownItem>
		{/if}
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
