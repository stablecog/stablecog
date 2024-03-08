<script lang="ts">
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';

	export let overflowXScroll = true;

	let containerWidth: number | undefined;
	let scrollContainerScrollLeft = 0;
	let innerContainerWidth: number | undefined;

	function onScroll(e: Event) {
		const target = e.target as HTMLDivElement;
		scrollContainerScrollLeft = target.scrollLeft;
	}

	$: distanceToEnd =
		innerContainerWidth !== undefined &&
		containerWidth !== undefined &&
		scrollContainerScrollLeft !== undefined
			? innerContainerWidth - (containerWidth + scrollContainerScrollLeft)
			: undefined;
	$: showChevron =
		distanceToEnd !== undefined && containerWidth !== undefined ? distanceToEnd > 16 : false;
</script>

<div
	bind:clientWidth={containerWidth}
	class="relative z-0 flex w-full flex-col items-start justify-start overflow-hidden rounded-2xl
	bg-c-bg shadow-xl shadow-c-shadow/[var(--o-shadow-strong)] ring-2 ring-c-bg-secondary"
>
	<div
		on:scroll={onScroll}
		class="flex w-full flex-col items-start {overflowXScroll
			? 'overflow-x-auto overflow-y-hidden'
			: ''} hide-scrollbar"
	>
		<div bind:clientWidth={innerContainerWidth} class="flex min-w-full flex-col">
			<slot />
		</div>
	</div>
	<div
		class="{showChevron
			? 'translate-x-0 opacity-100'
			: 'translate-x-full opacity-0'} pointer-events-none absolute right-0 top-0 flex h-full w-16 transform
			flex-col items-end justify-start rounded-r-2xl bg-gradient-to-l from-c-bg to-c-bg/0 transition"
	>
		<div
			class="flex w-full items-center justify-end bg-gradient-to-l from-c-bg from-[40%]
			to-c-bg/0 px-1.5 py-3.5"
		>
			<IconChevronDown class="h-5 w-5 -rotate-90 transform text-c-on-bg/50" />
		</div>
	</div>
</div>
