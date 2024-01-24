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

<div bind:clientWidth={containerWidth} class="w-full overflow-hidden z-0 relative">
	<div class="w-full overflow-hidden z-0 relative {showChevron ? 'list-fade' : ''}">
		<div
			on:scroll={onScroll}
			class="w-full flex flex-row justify-start items-center overflow-x-scroll hide-scrollbar"
		>
			<div bind:clientWidth={innerContainerWidth} class="px-1 flex justify-start items-center">
				<div class="flex justify-start items-center relative">
					{#each items as item, index}
						{@const isSelected = item.strictMatch
							? $page.url.pathname === item.href
							: $page.url.pathname.startsWith(item.href)}
						<a
							bind:clientWidth={elements[index].width}
							href={item.href}
							data-sveltekit-preload-data="hover"
							class="whitespace-nowrap px-4 md:px-5 pt-2 pb-4 text-base md:text-lg transition font-medium relative group"
						>
							<ButtonHoverEffect paddingClass="pb-2" size="md" color="on-bg" />
							{#if iconSet}
								<svelte:component
									this={iconSet}
									type={item.icon}
									class="w-4 h-4 flex-shrink-0 transition {isSelected
										? 'text-c-on-bg'
										: 'text-c-on-bg/50'}"
								/>
							{/if}
							<p class="transition {isSelected ? 'text-c-on-bg' : 'text-c-on-bg/50'}">
								{item.name}
							</p>
						</a>
					{/each}
					<div
						style="width: {selectedElementWidth}px; transform: translateX({selectedElementTranslateX}px)"
						class="absolute left-0 bottom-0 rounded-t-full h-5px bg-c-on-bg transition-all pointer-events-none"
					/>
				</div>
			</div>
		</div>
	</div>
	<div class="w-full h-2px rounded-full bg-c-bg-secondary" />
</div>

<style>
	.list-fade {
		mask-image: linear-gradient(to left, transparent 0rem, black 3rem);
	}
</style>
