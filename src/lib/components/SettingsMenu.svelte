<script lang="ts">
	import DropdownItem from '$components/DropdownItem.svelte';
	import IconDarkMode from '$components/icons/IconDarkMode.svelte';
	import ToggleIndicator from '$components/ToggleIndicator.svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import { parsedUrl } from '$ts/helpers/parsedUrl';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { serverUrl } from '$ts/stores/serverUrl';
	import { theme } from '$ts/stores/theme';
	import IconServer from './icons/IconServer.svelte';

	export let onSwitchServer: () => void;
	export let closeSettings: () => void;
</script>

<div
	transition:expandCollapse={{ durationMultiplier: 0.8 }}
	class="w-60 max-w-full bg-c-bg-secondary rounded-xl flex flex-col justify-start shadow-lg 
  shadow-c-shadow/[var(--o-shadow-normal)] absolute right-0 top-0 overflow-hidden z-50"
>
	<div class="w-full flex flex-col">
		<DropdownItem onClick={onSwitchServer}>
			<div class="flex-1 min-w-0 flex flex-col items-start gap-1">
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
						{$serverUrl ? 'Switch' : 'Set'} Server
					</p>
				</div>
				<p class="w-full text-xs text-left break-all font-normal text-c-on-bg/60">
					{$serverUrl ? parsedUrl($serverUrl) : 'Not connected'}
				</p>
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
