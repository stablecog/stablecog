<script lang="ts">
	import { page } from '$app/stores';
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
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
</script>

<div class="w-full overflow-y-scroll hide-scrollbar">
	<div class="min-w-full">
		<div class="min-w-full px-1">
			<div class="min-w-full flex items-center relative">
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
		<div class="min-w-full h-2px rounded-full bg-c-bg-secondary" />
	</div>
</div>
