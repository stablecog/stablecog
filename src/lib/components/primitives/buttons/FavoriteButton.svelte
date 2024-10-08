<script lang="ts">
	import { page } from '$app/stores';
	import type { TGenerationFullScreenModalType } from '$components/generationFullScreen/types';
	import IconFavorite from '$components/icons/IconFavorite.svelte';
	import IconButton from '$components/primitives/buttons/IconButton.svelte';
	import { locale } from '$i18n/i18n-svelte';
	import { sessionStore } from '$ts/constants/supabase';
	import { logGenerationOutputFavoritedChange } from '$ts/helpers/loggers';
	import { replaceOutputInUserQueryData } from '$ts/helpers/replaceOutputInUserQueryData';
	import { favoriteOutputs } from '$ts/queries/favoriteOutput';
	import { appVersion } from '$ts/stores/appVersion';
	import {
		activeGeneration,
		setGenerationOutputPartial,
		type TGenerationWithSelectedOutput
	} from '$ts/stores/user/generation';
	import {
		generatePageHistoryFullOutputsQueryKey,
		historyFullOutputsQueryKey
	} from '$ts/stores/user/queryKeys';
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
		'SC - Locale': $locale,
		'SC - Page': `${$page.url.pathname}${$page.url.search}`,
		'SC - User Id': $sessionStore?.user.id,
		'SC - Stripe Product Id': $userSummary?.product_id,
		'SC - App Version': $appVersion
	};

	async function favoriteOutput(action: 'add' | 'remove') {
		let newIsFavorited = action === 'add';
		logGenerationOutputFavoritedChange(newIsFavorited ? 'favorite' : 'unfavorite', logProps);
		if (modalType === 'history') {
			replaceOutputInUserQueryData(queryClient, $historyFullOutputsQueryKey, {
				id: generation.selected_output.id,
				is_favorited: newIsFavorited
			});
		} else if (modalType === 'generate' || modalType === 'stage') {
			setGenerationOutputPartial(generation.selected_output.id, {
				is_favorited: newIsFavorited
			});
			replaceOutputInUserQueryData(queryClient, $generatePageHistoryFullOutputsQueryKey, {
				id: generation.selected_output.id,
				is_favorited: newIsFavorited
			});
		}
		if ($activeGeneration) {
			activeGeneration.set({
				...$activeGeneration,
				selected_output: {
					...generation.selected_output,
					is_favorited: newIsFavorited
				}
			});
		}
		try {
			const res = favoriteOutputs({
				output_ids: [generation.selected_output.id],
				action,
				access_token: $sessionStore?.access_token || ''
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
		class="group/favoritebutton relative z-0 touch-manipulation overflow-hidden rounded-full bg-c-bg p-2.5 transition
		before:absolute before:left-0 before:top-0 before:h-full before:w-full
		before:-translate-x-full before:transform
		before:rounded-full before:bg-c-secondary/25 before:transition before:not-touch:hover:translate-x-0 {classes}"
		aria-label="Favorite Output"
	>
		<IconFavorite
			class="size-6 transition not-touch:group-hover/favoritebutton:text-c-secondary"
			favorited={generation.selected_output.is_favorited}
		/>
	</button>
{:else}
	<div class="flex rounded-full bg-c-bg/75 {classes}">
		<IconButton
			type="secondary"
			name="Favorite"
			class="pointer-events-auto"
			onClick={() => favoriteOutput(generation.selected_output.is_favorited ? 'remove' : 'add')}
		>
			<IconFavorite
				class="h-7 w-7 transition not-touch:group-hover/iconbutton:text-c-secondary"
				favorited={generation.selected_output.is_favorited}
			/>
		</IconButton>
	</div>
{/if}
