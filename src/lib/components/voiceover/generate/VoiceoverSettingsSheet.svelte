<script lang="ts">
	import { mdBreakpoint } from '$components/generationFullScreen/constants';
	import VoiceoverSettingsPanel from '$components/voiceover/generate/VoiceoverSettingsPanel.svelte';
	import { windowWidth } from '$ts/stores/window';
	import { onMount } from 'svelte';

	export let isOpen: boolean;
	export let isCheckCompleted: boolean;
	export let promptBarHeight: number | undefined;
	export let horizontalListHeight: number | undefined;
	export let promptBarEstimatedHeightRem: number;
	export let horizontalListHeightEstimatedRem: number;
</script>

<div
	style="transform: translateY({!$windowWidth || !promptBarHeight || !horizontalListHeight
		? `calc(100% - env(safe-area-inset-bottom) - ${
				promptBarEstimatedHeightRem + horizontalListHeightEstimatedRem
		  }rem)`
		: $windowWidth < mdBreakpoint && isOpen
		? '0%'
		: `calc(100% - ${promptBarHeight + horizontalListHeight}px)`});"
	class="w-full h-[min(calc(100%-7.5rem),60rem)] z-40 gap-1 flex flex-col bg-c-bg rounded-t-2xl ring-2 ring-c-bg-secondary
		md:ring-0 md:rounded-none {isOpen
		? 'shadow-sheet-open shadow-c-shadow/[var(--o-shadow-strongest)]'
		: 'shadow-sheet-closed shadow-c-shadow/[var(--o-shadow-stronger)]'} md:shadow-none
		md:bg-transparent fixed left-0 bottom-0 md:hidden transform transition duration-250 overflow-hidden md:overflow-auto"
>
	<div
		class="w-full flex-1 h-full overflow-hidden flex flex-col z-50 transition {$windowWidth &&
		$windowWidth < mdBreakpoint &&
		isOpen
			? 'opacity-100'
			: 'opacity-0 pointer-events-none'}"
	>
		<!-- <VoiceoverSettingsPanel rounding="top" {isCheckCompleted} /> -->
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
