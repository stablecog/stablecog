<script lang="ts">
	import { page } from '$app/stores';
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import type { pageNavbarItem } from '$components/navigation/pageNavbar/types';

	export let items: pageNavbarItem[];
	export let iconSet: ConstructorOfATypedSvelteComponent | undefined = undefined;

	let elements: { width: number }[] = Array.from({ length: items.length }, () => ({
		width: 0
	}));

	$: selectedIndex = items.findIndex((item) => {
		if (item.strictMatch) {
			return $page.url.pathname === item.href;
		}
		return $page.url.pathname.startsWith(item.href);
	});
	$: selectedElementWidth = elements[selectedIndex].width;
	$: selectedElementTranslateX = elements
		.slice(0, selectedIndex)
		.reduce((acc, curr) => acc + curr.width, 0);

	let containerWidth: number;
	let innerContainerWidth: number;
	let scrollLeft: number = 0;

	$: distanceToEnd =
		innerContainerWidth !== undefined && scrollLeft !== undefined && containerWidth !== undefined
			? innerContainerWidth - scrollLeft - containerWidth
			: undefined;
	$: showChevron = distanceToEnd !== undefined ? distanceToEnd > 16 : false;

	function onScroll(e: Event) {
		const target = e.target as HTMLElement;
		scrollLeft = target.scrollLeft;
	}
</script>

<div bind:clientWidth={containerWidth} class="relative z-0 w-full overflow-hidden">
	<div class="relative z-0 w-full overflow-hidden {showChevron ? 'list-fade' : ''}">
		<div
			on:scroll={onScroll}
			class="hide-scrollbar flex w-full flex-row items-center justify-start overflow-x-scroll"
		>
			<div bind:clientWidth={innerContainerWidth} class="flex items-center justify-start px-1">
				<div class="relative flex items-center justify-start">
					{#each items as item, index}
						{@const isSelected = item.strictMatch
							? $page.url.pathname === item.href
							: $page.url.pathname.startsWith(item.href)}
						<a
							bind:clientWidth={elements[index].width}
							href={item.href}
							data-sveltekit-preload-data="hover"
							class="group relative whitespace-nowrap px-4 pb-4 pt-2 text-base font-medium transition md:px-5 md:text-lg"
						>
							<ButtonHoverEffect paddingClass="pb-2" size="md" color="on-bg-faded" />
							{#if iconSet}
								<svelte:component
									this={iconSet}
									type={item.icon}
									class="h-4 w-4 flex-shrink-0 transition {isSelected
										? 'text-c-on-bg'
										: 'text-c-on-bg/60'}"
								/>
							{/if}
							<p class="transition {isSelected ? 'text-c-on-bg' : 'text-c-on-bg/60'}">
								{item.name}
							</p>
						</a>
					{/each}
					<div
						style="width: {selectedElementWidth}px; transform: translateX({selectedElementTranslateX}px)"
						class="pointer-events-none absolute bottom-0 left-0 h-5px rounded-t-full bg-c-on-bg transition-all"
					/>
				</div>
			</div>
		</div>
	</div>
	<div class="h-2px w-full rounded-full bg-c-bg-secondary" />
</div>

<style>
	.list-fade {
		mask-image: linear-gradient(to left, transparent 0rem, black 3rem);
	}
</style>
