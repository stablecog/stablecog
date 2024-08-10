<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import type { TGenerationImageCardType } from '$components/generationImage/types';
	import IconImageSearch from '$components/icons/IconImageSearch.svelte';
	import {
		logGalleryExploreSimilarClicked,
		logUserProfileExploreSimilarClicked
	} from '$ts/helpers/loggers';
	import { appVersion } from '$ts/stores/appVersion';
	import type { TGenerationWithSelectedOutput } from '$ts/stores/user/generation';
	import { sessionStore } from '$ts/constants/supabase';

	import { userSummary } from '$ts/stores/user/summary';

	export let generation: TGenerationWithSelectedOutput;
	export let cardType: TGenerationImageCardType;
	export let setSearchQuery: (query: string) => void;
	export { classes as class };
	let classes = '';

	const searchParams = new URLSearchParams(browser ? window.location.search : $page.url.search);

	const searchParamsWithOutputId = new URLSearchParams(searchParams);
	searchParamsWithOutputId.set('q', generation.selected_output.id);
	const searchParamsWithOutputIdString = searchParamsWithOutputId.toString();
	const searchParamsWithOutputIdStringFinal = searchParamsWithOutputIdString
		? `?${searchParamsWithOutputIdString}`
		: '';

	$: exploreSimilarUrl = `${
		cardType === 'user-profile' ? `/${generation.user.username}` : '/gallery'
	}${searchParamsWithOutputIdStringFinal}`;

	function onClick() {
		setSearchQuery(generation.selected_output.id);
		const logParams = {
			'SC - Output Id': generation.selected_output.id,
			'SC - User Id': $sessionStore?.user.id,
			'SC - Stripe Product Id': $userSummary?.product_id,
			'SC - App Version': $appVersion,
			'SC - Clicked Output Id': generation.selected_output.id
		};
		if (cardType === 'user-profile') {
			logUserProfileExploreSimilarClicked(logParams);
		} else {
			logGalleryExploreSimilarClicked(logParams);
		}
	}
</script>

<a
	href={exploreSimilarUrl}
	data-sveltekit-preload-data="hover"
	on:click={onClick}
	class="group/explorebutton relative z-0 touch-manipulation overflow-hidden rounded-full bg-c-bg p-2.5 transition
	before:absolute before:left-0 before:top-0 before:h-full before:w-full
	before:-translate-x-full before:transform
	before:rounded-full before:bg-c-primary before:transition before:not-touch:hover:translate-x-0 {classes}"
	aria-label="Explore Similar"
>
	<IconImageSearch
		class="relative size-6 text-c-on-bg transition
			not-touch:group-hover/explorebutton:text-c-on-primary"
	/>
</a>
