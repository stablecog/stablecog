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
			'SC - App Version': $appVersion
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
	class="touch-manipulation transition rounded-lg group/downloadbutton {classes}"
	aria-label="Explore Similar"
>
	<div class="p-2.5 rounded-full bg-c-bg relative overflow-hidden z-0">
		<div
			class="w-full h-full rounded-full transition transform -translate-x-[calc(100%+8px)]
			bg-c-primary absolute left-0 top-0 group-focus/downloadbutton:translate-x-0
			not-touch:group-hover/downloadbutton:translate-x-0"
		/>
		<IconImageSearch
			class="w-7 h-7 transition text-c-on-bg relative group-focus/downloadbutton:text-c-on-primary
			not-touch:group-hover/downloadbutton:text-c-on-primary"
		/>
	</div>
</a>
