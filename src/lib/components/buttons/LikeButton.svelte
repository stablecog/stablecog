<script lang="ts">
	import { page } from '$app/stores';
	import IconButton from '$components/buttons/IconButton.svelte';
	import SubtleButton from '$components/buttons/SubtleButton.svelte';
	import type { TGenerationFullScreenModalType } from '$components/generationFullScreen/types';
	import IconHeartSet from '$components/icons/IconHeartSet.svelte';
	import { locale } from '$i18n/i18n-svelte';
	import { replaceOutputInUserQueryData } from '$ts/helpers/replaceOutputInUserQueryData';
	import { likeOutputs } from '$ts/queries/likeOutputs';
	import { activeGeneration, type TGenerationWithSelectedOutput } from '$ts/stores/user/generation';
	import { galleryGenerationFullOutputsQueryKey } from '$ts/stores/user/keys';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { get } from 'svelte/store';

	export let generation: TGenerationWithSelectedOutput;
	export let modalType: TGenerationFullScreenModalType;
	export let type: 'on-image' | 'subtle' = 'subtle';
	export let onLikesChanged:
		| (({
				newLikeCount,
				newIsLikedByUser
		  }: {
				newLikeCount: number;
				newIsLikedByUser: boolean;
		  }) => void)
		| undefined = undefined;

	export { classes as class };
	let classes = '';

	let buttonElement: HTMLButtonElement | undefined = undefined;
	const queryClient = useQueryClient();

	let abortController: AbortController | undefined = undefined;

	async function likeOutput(action: 'like' | 'unlike') {
		if (!$page.data.session?.access_token) return;
		try {
			const newLikeCount =
				action === 'like'
					? generation.selected_output.like_count + 1
					: generation.selected_output.like_count - 1;
			const newIsLikedByUser = action === 'like' ? true : false;
			if (modalType === 'gallery') {
				const _galleryGenerationFullOutputsQueryKey = get(galleryGenerationFullOutputsQueryKey);
				await replaceOutputInUserQueryData(queryClient, _galleryGenerationFullOutputsQueryKey, {
					id: generation.selected_output.id,
					liked_by_user: newIsLikedByUser,
					like_count: newLikeCount
				});
			}
			if ($activeGeneration) {
				activeGeneration.set({
					...$activeGeneration,
					selected_output: {
						...generation.selected_output,
						like_count: newLikeCount,
						liked_by_user: newIsLikedByUser
					}
				});
			}
			if (onLikesChanged) {
				onLikesChanged({
					newLikeCount,
					newIsLikedByUser
				});
			}
			if (abortController) abortController.abort();
			abortController = new AbortController();
			const res = await likeOutputs({
				output_ids: [generation.selected_output.id],
				action,
				access_token: $page.data.session?.access_token,
				abortController
			});
		} catch (error) {
			console.log(error);
		}
		if (buttonElement) {
			buttonElement.blur();
		}
	}

	$: numberFormatter = new Intl.NumberFormat($locale, {
		style: 'decimal',
		notation: 'compact',
		maximumFractionDigits: 1
	});
</script>

{#key generation.selected_output.id}
	{#if type === 'on-image'}
		<button
			bind:this={buttonElement}
			on:click={() => likeOutput(generation.selected_output.liked_by_user ? 'unlike' : 'like')}
			class="touch-manipulation transition group/likebutton p-2.5 rounded-full bg-c-bg relative overflow-hidden z-0
			flex flex-col items-center justify-center
			before:w-full before:h-full before:absolute before:left-0 before:top-0
			before:-translate-x-full before:not-touch:hover:translate-x-0
			before:rounded-full before:transition before:transform before:bg-c-danger/25 {classes}"
			aria-label={generation.selected_output.liked_by_user ? 'Unlike' : 'Like'}
		>
			<IconHeartSet
				liked={generation.selected_output.liked_by_user}
				class="w-7 h-7 transform flex-shrink-0 relative"
			/>
		</button>
	{:else}
		<SubtleButton
			onClick={() => likeOutput(generation.selected_output.liked_by_user ? 'unlike' : 'like')}
		>
			<div class="max-w-full flex items-center justify-center gap-1 -my-1">
				<IconHeartSet class="w-5 h-5" liked={generation.selected_output.liked_by_user} />
				<p
					class="{generation.selected_output.liked_by_user
						? 'text-c-danger'
						: ''} text-base font-medium"
				>
					{numberFormatter.format(generation.selected_output.like_count)}
				</p>
			</div>
		</SubtleButton>
	{/if}
{/key}
