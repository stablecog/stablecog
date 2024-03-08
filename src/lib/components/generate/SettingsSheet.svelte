<script lang="ts">
	import SettingsPanel from '$components/generate/SettingsPanel.svelte';
	import { mdBreakpoint } from '$components/generationFullScreen/constants';
	import type { TAvailableSchedulerId } from '$ts/constants/schedulers';
	import { windowWidth } from '$ts/stores/window';
	import type { TTab } from '$ts/types/main';

	export let isOpen: boolean;
	export let isCheckCompleted: boolean;
	export let promptBarHeight: number | undefined;
	export let horizontalListHeight: number | undefined;
	export let promptBarEstimatedHeightRem: number;
	export let horizontalListHeightEstimatedRem: number;
	export let openSignInModal: () => void;
	export let supportedSchedulerIdDropdownItems: TTab<TAvailableSchedulerId>[];
</script>

<div
	style="transform: translateY({!$windowWidth || !promptBarHeight || !horizontalListHeight
		? `calc(100% - env(safe-area-inset-bottom) - ${
				promptBarEstimatedHeightRem + horizontalListHeightEstimatedRem
			}rem)`
		: $windowWidth < mdBreakpoint && isOpen
			? '0%'
			: `calc(100% - ${promptBarHeight + horizontalListHeight}px)`});"
	class="z-40 flex h-[min(calc(100%-3rem),60rem)] w-full flex-col gap-1 rounded-t-2xl bg-c-bg ring-2 ring-c-bg-secondary
		md:rounded-none md:ring-0 {isOpen
		? 'shadow-sheet-open shadow-c-shadow/[var(--o-shadow-strongest)]'
		: 'shadow-sheet-closed shadow-c-shadow/[var(--o-shadow-stronger)]'} absolute
		bottom-0 left-0 transform overflow-hidden transition duration-300 md:hidden md:overflow-auto md:bg-transparent md:shadow-none"
>
	<div
		class="z-50 flex h-full w-full flex-1 flex-col overflow-hidden transition {$windowWidth &&
		$windowWidth < mdBreakpoint &&
		isOpen
			? 'opacity-100'
			: 'pointer-events-none opacity-0'}"
	>
		{#if $windowWidth && $windowWidth < mdBreakpoint}
			<SettingsPanel
				rounding="top"
				{openSignInModal}
				{isCheckCompleted}
				{supportedSchedulerIdDropdownItems}
			/>
		{/if}
	</div>
	<div
		class="w-full flex-shrink-0"
		style="height: {!$windowWidth || !promptBarHeight || !horizontalListHeight
			? `calc(env(safe-area-inset-bottom) + ${
					promptBarEstimatedHeightRem + horizontalListHeightEstimatedRem
				}rem)`
			: `${
					promptBarHeight + (isOpen && $windowWidth < mdBreakpoint ? 4 : horizontalListHeight)
				}px`}"
	/>
</div>
