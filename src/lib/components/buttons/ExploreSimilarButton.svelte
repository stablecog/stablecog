<script lang="ts">
	import { page } from '$app/stores';
	import IconImageSearch from '$components/icons/IconImageSearch.svelte';
	import { logGalleryExploreSimilarClicked } from '$ts/helpers/loggers';
	import { appVersion } from '$ts/stores/appVersion';
	import type { TGenerationWithSelectedOutput } from '$ts/stores/user/generation';

	import { userSummary } from '$ts/stores/user/summary';

	export let generation: TGenerationWithSelectedOutput;
	export let setSearchQuery: (query: string) => void;
	export { classes as class };
	let classes = '';

	$: exploreSimilarUrl = `/gallery?q=${generation.selected_output.id}`;

	function onClick() {
		setSearchQuery(generation.selected_output.id);
		logGalleryExploreSimilarClicked({
			'SC - Output Id': generation.selected_output.id,
			'SC - User Id': $page.data.session?.user.id,
			'SC - Stripe Product Id': $userSummary?.product_id,
			'SC - App Version': $appVersion
		});
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
			class="w-full h-full rounded-full transition transform -translate-x-full
			bg-c-primary absolute left-0 top-0 group-focus/downloadbutton:translate-x-0
			not-touch:group-hover/downloadbutton:translate-x-0"
		/>
		<IconImageSearch
			class="w-7 h-7 transition text-c-on-bg relative group-focus/downloadbutton:text-c-on-primary
			not-touch:group-hover/downloadbutton:text-c-on-primary"
		/>
	</div>
</a>
