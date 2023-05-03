<script lang="ts">
	import { page } from '$app/stores';
	import IconButton from '$components/buttons/IconButton.svelte';
	import type { TGenerationFullScreenModalType } from '$components/generationFullScreen/types';
	import IconFavorite from '$components/icons/IconFavorite.svelte';
	import { locale } from '$i18n/i18n-svelte';
	import { apiUrl } from '$ts/constants/main';
	import {
		logGenerationOutputFavorited,
		logGenerationOutputUnfavorited
	} from '$ts/helpers/loggers';
	import { replaceOutputInUserQueryData } from '$ts/helpers/replaceOutputInUserQueryData';
	import { favoriteOutputs } from '$ts/queries/favoriteOutput';
	import type { TUserGenerationFullOutputsPage } from '$ts/queries/userGenerations';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { appVersion } from '$ts/stores/appVersion';
	import {
		activeGeneration,
		setGenerationOutputToFavorited,
		type TGenerationWithSelectedOutput
	} from '$ts/stores/user/generation';
	import {
		generatePageUserGenerationFullOutputsQueryKey,
		userGenerationFullOutputsQueryKey
	} from '$ts/stores/user/keys';
	import { userSummary } from '$ts/stores/user/summary';
	import { useQueryClient } from '@tanstack/svelte-query';

	export let generation: TGenerationWithSelectedOutput;
	export let modalType: TGenerationFullScreenModalType;

	const queryClient = useQueryClient();

	$: logProps = {
		'SC - Generation Id': generation.id,
		'SC - Output Id': generation.selected_output.id,
		'SC - Advanced Mode': $advancedModeApp,
		'SC - Locale': $locale,
		'SC - Page': `${$page.url.pathname}${$page.url.search}`,
		'SC - User Id': $page.data.session?.user.id,
		'SC - Stripe Product Id': $userSummary?.product_id,
		'SC - App Version': $appVersion
	};

	async function favoriteOutput(action: 'add' | 'remove') {
		if (action === 'add') {
			logGenerationOutputFavorited(logProps);
		} else {
			logGenerationOutputUnfavorited(logProps);
		}
		if (modalType === 'history') {
			replaceOutputInUserQueryData(queryClient, $userGenerationFullOutputsQueryKey, {
				id: generation.selected_output.id,
				is_favorited: action === 'add'
			});
		} else if (modalType === 'generate' || modalType === 'stage') {
			setGenerationOutputToFavorited(generation.selected_output.id);
			replaceOutputInUserQueryData(queryClient, $generatePageUserGenerationFullOutputsQueryKey, {
				id: generation.selected_output.id,
				is_favorited: action === 'add'
			});
		}
		if ($activeGeneration) {
			activeGeneration.set({
				...$activeGeneration,
				selected_output: {
					...generation.selected_output,
					is_favorited: action === 'add'
				}
			});
		}
		try {
			const res = favoriteOutputs({
				output_ids: [generation.selected_output.id],
				action,
				access_token: $page.data.session?.access_token || ''
			});
		} catch (error) {
			console.log('Error favoriting generation output', error);
		}
	}
</script>

<div class="flex bg-c-bg/75 rounded-full">
	<IconButton
		type="secondary"
		name="Favorite"
		class="pointer-events-auto"
		onClick={() => favoriteOutput(generation.selected_output.is_favorited ? 'remove' : 'add')}
	>
		<IconFavorite favorited={generation.selected_output.is_favorited} />
	</IconButton>
</div>
