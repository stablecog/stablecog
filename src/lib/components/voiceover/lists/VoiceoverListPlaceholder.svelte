<script lang="ts">
	import {
		listItemGap,
		listItemHeight,
		listItemWidth,
		listPadding
	} from '$components/voiceover/lists/constants';

	export let text: string;
	export let gap = listItemGap;
	export let padding = listPadding;
	export let horizontal = false;
</script>

<div class="w-full h-full flex {horizontal ? '' : 'flex-col'} overflow-hidden">
	<div
		style="gap: {gap}px; padding: {padding}px"
		class="flex {horizontal ? 'h-full justify-start' : 'w-full flex-col'} opacity-50"
	>
		{#each Array.from({ length: 15 }) as _}
			<div
				style={horizontal ? `width: ${listItemWidth}px` : `height: ${listItemHeight}px`}
				class="{horizontal ? 'h-full' : 'w-full'} bg-c-bg-secondary rounded-lg md:rounded-xl"
			/>
		{/each}
	</div>
	<div
		class="absolute left-0 top-0 w-full h-full flex flex-col text-center
    items-center justify-center text-c-on-bg/50 text-sm"
	>
		<p
			class="w-full relative {horizontal
				? 'py-2 md:py-3.5'
				: 'py-4'} break-words px-6 md:lg:px-4 xl:px-8 md:ring-2 md:bg-c-bg
			md:ring-c-bg-secondary md:shadow-xl md:shadow-c-shadow/[var(--o-shadow-normal)]"
		>
			{text}
		</p>
	</div>
</div>
