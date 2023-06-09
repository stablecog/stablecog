<script lang="ts">
	import {
		listItemGap,
		listItemHeight,
		listItemWidth,
		listPadding
	} from '$components/voiceover/lists/constants';

	export let text: string;
	export let horizontal = false;
</script>

<div class="w-full h-full flex {horizontal ? '' : 'flex-col'} overflow-hidden">
	<div
		style="gap: {listItemGap}px; padding: {listPadding}px"
		class="flex {horizontal ? 'h-full justify-start' : 'w-full flex-col'} opacity-50"
	>
		{#each Array.from({ length: 20 }) as _}
			<div
				style={horizontal ? `width: ${listItemWidth}px` : `height: ${listItemHeight}px`}
				class="{horizontal ? 'h-full' : 'w-full'} bg-c-bg-secondary rounded-xl"
			/>
		{/each}
	</div>
	<div
		class="absolute left-0 top-0 w-full h-full flex flex-col text-center
    items-center justify-center text-c-on-bg/50 text-sm"
	>
		<p
			class="w-full relative py-5 lg:px-4 xl:px-8 {horizontal
				? ''
				: 'ring-2 bg-c-bg ring-c-bg-secondary shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]'}"
		>
			{text}
		</p>
	</div>
</div>
