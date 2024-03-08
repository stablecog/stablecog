<script lang="ts">
	import { mdBreakpoint } from '$components/generationFullScreen/constants';
	import VoiceoverSettingsPanel from '$components/voiceover/generate/VoiceoverSettingsPanel.svelte';
	import { windowWidth } from '$ts/stores/window';

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
	class="z-40 flex h-[min(calc(100%-7.5rem),60rem)] w-full flex-col gap-1 rounded-t-2xl bg-c-bg ring-2 ring-c-bg-secondary
		md:rounded-none md:ring-0 {isOpen
		? 'shadow-sheet-open shadow-c-shadow/[var(--o-shadow-strongest)]'
		: 'shadow-sheet-closed shadow-c-shadow/[var(--o-shadow-stronger)]'} fixed
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
			<VoiceoverSettingsPanel rounding="top" {isCheckCompleted} />
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
