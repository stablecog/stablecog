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

<div class="flex h-full w-full {horizontal ? '' : 'flex-col'} overflow-hidden">
	<div
		style="gap: {gap}px; padding: {padding}px"
		class="flex {horizontal ? 'h-full justify-start' : 'w-full flex-col'} opacity-50"
	>
		{#each Array.from({ length: 15 }) as _}
			<div
				style={horizontal ? `width: ${listItemWidth}px` : `height: ${listItemHeight}px`}
				class="{horizontal ? 'h-full' : 'w-full'} rounded-lg bg-c-bg-secondary md:rounded-xl"
			/>
		{/each}
	</div>
	<div
		class="absolute left-0 top-0 flex h-full w-full flex-col items-center
    justify-center text-center text-sm text-c-on-bg/50"
	>
		<p
			class="relative w-full {horizontal
				? 'py-2 md:py-3.5'
				: 'py-4'} break-words px-6 md:bg-c-bg md:shadow-xl md:shadow-c-shadow/[var(--o-shadow-normal)] md:ring-2
			md:ring-c-bg-secondary md:lg:px-4 xl:px-8"
		>
			{text}
		</p>
	</div>
</div>
