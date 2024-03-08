<script lang="ts">
	import ScrollAreaWithChevron from '$components/utils/ScrollAreaWithChevron.svelte';
	import { pageLevels } from '$components/accountMenu/constants';
	import type { TAccountDropdownPage } from '$components/accountMenu/types';
	export let height: number;
	export let currentPage: TAccountDropdownPage;
	export let thisPage: TAccountDropdownPage;
	export let isNotAbsolute = false;

	const thisPageLevel = pageLevels[thisPage];
	$: currentPageLevel = pageLevels[currentPage];
</script>

<div
	class="w-full {isNotAbsolute
		? ''
		: 'absolute left-0 top-0'} z-0 transform overflow-hidden shadow-navbar transition duration-300 {currentPage !==
	thisPage
		? 'pointer-events-none'
		: ''} {thisPageLevel > currentPageLevel
		? 'translate-x-full shadow-c-shadow/0'
		: thisPageLevel < currentPageLevel
			? '-translate-x-1/4 shadow-c-shadow/0'
			: 'translate-x-0 shadow-c-shadow/[var(--o-shadow-strongest)]'} {Math.abs(
		thisPageLevel - currentPageLevel
	) > 1
		? 'opacity-0'
		: 'opacity-100'}"
	bind:offsetHeight={height}
>
	<ScrollAreaWithChevron
		class="hide-scrollbar flex max-h-[calc(60vh-4rem)] w-full flex-col justify-start rounded-b-xl bg-c-bg-secondary shadow-settings-page
    shadow-c-shadow/[var(--o-shadow-stronger)] transition-all duration-100 md:max-h-[calc(70vh-4rem)]"
	>
		<slot />
	</ScrollAreaWithChevron>
</div>
