<script lang="ts">
	import SettingsPanel from '$components/generate/SettingsPanel.svelte';
	import { mdBreakpoint } from '$components/generationFullScreen/constants';
	import type { TAvailableSchedulerId } from '$ts/constants/schedulers';
	import { windowWidth } from '$ts/stores/window';
	import type { TTab } from '$ts/types/main';
	import { onMount } from 'svelte';

	export let isOpen: boolean;
	export let isCheckCompleted: boolean;
	export let promptBarHeight: number | undefined;
	export let horizontalListHeight: number | undefined;
	export let promptBarEstimatedHeightRem: number;
	export let horizontalListHeightEstimatedRem: number;
	export let isInferenceStepsValid: <T>(s: T) => boolean;
	export let openSignInModal: () => void;
	export let supportedSchedulerIdDropdownItems: TTab<TAvailableSchedulerId>[];

	let mounted = true;
	onMount(() => {
		mounted = true;
	});
</script>

<div
	style="transform: translateY({!$windowWidth || !promptBarHeight || !horizontalListHeight
		? `calc(100% - env(safe-area-inset-bottom) - ${
				promptBarEstimatedHeightRem + horizontalListHeightEstimatedRem
		  }rem)`
		: $windowWidth < mdBreakpoint && isOpen
		? '0%'
		: `calc(100% - ${promptBarHeight + horizontalListHeight}px)`});"
	class="w-full h-[min(calc(100%-3rem),60rem)] z-40 gap-1 flex flex-col bg-c-bg rounded-t-2xl ring-2 ring-c-bg-secondary
										md:ring-0 md:rounded-none {isOpen
		? 'shadow-sheet-open shadow-c-shadow/[var(--o-shadow-strongest)]'
		: 'shadow-sheet-closed shadow-c-shadow/[var(--o-shadow-stronger)]'} md:shadow-none
										md:bg-transparent absolute left-0 bottom-0 md:hidden transform transition duration-250 overflow-hidden md:overflow-auto"
>
	<div
		class="w-full flex-1 h-full overflow-hidden flex flex-col z-50 transition {$windowWidth &&
		$windowWidth < mdBreakpoint &&
		isOpen
			? 'opacity-100'
			: 'opacity-0 pointer-events-none'}"
	>
		{#if mounted}
			<SettingsPanel
				rounding="top"
				{openSignInModal}
				{isCheckCompleted}
				{isInferenceStepsValid}
				{supportedSchedulerIdDropdownItems}
			/>
		{/if}
	</div>
	<div
		class="flex-shrink-0 w-full"
		style="height: {!$windowWidth || !promptBarHeight || !horizontalListHeight
			? `calc(env(safe-area-inset-bottom) + ${
					promptBarEstimatedHeightRem + horizontalListHeightEstimatedRem
			  }rem)`
			: `${
					promptBarHeight + (isOpen && $windowWidth < mdBreakpoint ? 4 : horizontalListHeight)
			  }px`}"
	/>
</div>
