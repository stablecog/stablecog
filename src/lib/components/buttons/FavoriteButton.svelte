<script lang="ts">
	import { page } from '$app/stores';
	import IconButton from '$components/buttons/IconButton.svelte';
	import type { TGenerationFullScreenModalType } from '$components/generationFullScreen/types';
	import IconFavorite from '$components/icons/IconFavorite.svelte';
	import { locale } from '$i18n/i18n-svelte';
	import {
		logGenerationOutputFavorited,
		logGenerationOutputUnfavorited
	} from '$ts/helpers/loggers';
	import { replaceOutputInUserQueryData } from '$ts/helpers/replaceOutputInUserQueryData';
	import { favoriteOutputs } from '$ts/queries/favoriteOutput';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { appVersion } from '$ts/stores/appVersion';
	import {
		activeGeneration,
		setGenerationOutputFavoritedStatus,
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
	export let type: 'on-image' | 'normal' = 'normal';
	export { classes as class };
	let classes = '';

	let buttonElement: HTMLButtonElement | undefined = undefined;

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
			setGenerationOutputFavoritedStatus(generation.selected_output.id, action === 'add');
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
		if (buttonElement) {
			buttonElement.blur();
		}
	}
</script>

{#if type === 'on-image'}
	<button
		bind:this={buttonElement}
		on:click={() => favoriteOutput(generation.selected_output.is_favorited ? 'remove' : 'add')}
		class="touch-manipulation transition group/favoritebutton p-2.5 rounded-full bg-c-bg relative overflow-hidden z-0
		before:w-full before:h-full before:absolute before:left-0 before:top-0
		before:-translate-x-full before:not-touch:hover:translate-x-0
		before:rounded-full before:transition before:transform before:bg-c-secondary/25 {classes}"
		aria-label="Favorite Output"
	>
		<IconFavorite favorited={generation.selected_output.is_favorited} />
	</button>
{:else}
	<div class="flex bg-c-bg/75 rounded-full {classes}">
		<IconButton
			type="secondary"
			name="Favorite"
			class="pointer-events-auto"
			onClick={() => favoriteOutput(generation.selected_output.is_favorited ? 'remove' : 'add')}
		>
			<IconFavorite favorited={generation.selected_output.is_favorited} />
		</IconButton>
	</div>
{/if}
