<script lang="ts">
	import { page } from '$app/stores';
	import type { TGenerationImageCardType } from '$components/generationImage/types';
	import IconImageSearch from '$components/icons/IconImageSearch.svelte';
	import {
		logGalleryExploreSimilarClicked,
		logUserProfileExploreSimilarClicked
	} from '$ts/helpers/loggers';
	import { appVersion } from '$ts/stores/appVersion';
	import type { TGenerationWithSelectedOutput } from '$ts/stores/user/generation';

	import { userSummary } from '$ts/stores/user/summary';

	export let generation: TGenerationWithSelectedOutput;
	export let cardType: TGenerationImageCardType;
	export let setSearchQuery: (query: string) => void;
	export { classes as class };
	let classes = '';

	$: exploreSimilarUrl = `${
		cardType === 'user-profile' ? `/user/${generation.user.username}` : '/gallery'
	}?q=${generation.selected_output.id}`;

	function onClick() {
		setSearchQuery(generation.selected_output.id);
		const logParams = {
			'SC - Output Id': generation.selected_output.id,
			'SC - User Id': $page.data.session?.user.id,
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
	class="touch-manipulation transition rounded-lg group/explorebutton {classes}"
	aria-label="Explore Similar"
>
	<div
		class="p-2.5 rounded-full bg-c-bg relative overflow-hidden z-0
		after:w-full after:h-full after:absolute after:left-0 after:top-0
		after:-translate-x-full after:not-touch:group-hover/explorebutton:translate-x-0
		after:rounded-full after:transition after:transform after:z-[-1] after:bg-c-primary"
	>
		<IconImageSearch
			class="w-7 h-7 transition text-c-on-bg relative
			not-touch:group-hover/explorebutton:text-c-on-primary"
		/>
	</div>
</a>
