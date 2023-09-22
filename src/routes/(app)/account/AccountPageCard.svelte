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
		distanceToEnd !== undefined && containerWidth !== undefined ? distanceToEnd > 24 : false;
</script>

<div
	bind:clientWidth={containerWidth}
	class="w-full flex flex-col justify-start items-start rounded-2xl bg-c-bg relative z-0
	shadow-xl shadow-c-shadow/[var(--o-shadow-strong)] ring-2 ring-c-bg-secondary overflow-hidden"
>
	<div
		on:scroll={onScroll}
		class="w-full flex flex-col items-start {overflowXScroll
			? 'overflow-x-auto overflow-y-hidden'
			: ''} hide-scrollbar"
	>
		<div bind:clientWidth={innerContainerWidth} class="min-w-full flex flex-col">
			<slot />
		</div>
	</div>
	<div
		class="{showChevron
			? 'translate-x-0 opacity-100'
			: 'translate-x-full opacity-0'} transform transition absolute flex flex-col items-end justify-start bg-gradient-to-l
			from-c-bg to-c-bg/0 rounded-r-2xl right-0 top-0 h-full w-16 pointer-events-none"
	>
		<div
			class="w-full flex justify-end items-center px-1.5 py-3.5 bg-gradient-to-l
			from-c-bg from-[40%] to-c-bg/0"
		>
			<IconChevronDown class="w-5 h-5 text-c-on-bg/50 transform -rotate-90" />
		</div>
	</div>
</div>
