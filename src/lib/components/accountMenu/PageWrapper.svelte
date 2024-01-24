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
		: 'absolute left-0 top-0'} transform transition duration-300 overflow-hidden z-0 shadow-navbar {currentPage !==
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
		class="w-full flex flex-col justify-start max-h-[calc(60vh-4rem)] md:max-h-[calc(70vh-4rem)] transition-all duration-100 hide-scrollbar
    shadow-settings-page bg-c-bg-secondary shadow-c-shadow/[var(--o-shadow-stronger)] rounded-b-xl"
	>
		<slot />
	</ScrollAreaWithChevron>
</div>
