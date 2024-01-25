<script lang="ts">
	import { page } from '$app/stores';
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import SubtleButton from '$components/primitives/buttons/SubtleButton.svelte';
	import type { TGenerationFullScreenModalType } from '$components/generationFullScreen/types';
	import IconHeartSet from '$components/icons/IconHeartSet.svelte';
	import { locale } from '$i18n/i18n-svelte';
	import { logGenerationOutputLikedChange } from '$ts/helpers/loggers';
	import { replaceOutputInUserQueryData } from '$ts/helpers/replaceOutputInUserQueryData';
	import { likeOutputs } from '$ts/queries/likeOutputs';
	import { allUserGenerationFullOutputsQueryKey } from '$ts/stores/admin/gallery';
	import { appVersion } from '$ts/stores/appVersion';
	import { isSignInModalOpen } from '$ts/stores/isSignInModalOpen';
	import {
		activeGeneration,
		setGenerationOutputPartial,
		type TGenerationWithSelectedOutput
	} from '$ts/stores/user/generation';
	import {
		galleryGenerationFullOutputsQueryKey,
		someUserProfileFullOutputsQueryKey,
		userGenerationFullOutputsQueryKey
	} from '$ts/stores/user/queryKeys';
	import { userSummary } from '$ts/stores/user/summary';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { get } from 'svelte/store';
	import { sessionStore } from '$ts/constants/supabase';

	export let generation: TGenerationWithSelectedOutput;
	export let modalType: TGenerationFullScreenModalType;
	export let type: 'on-image' | 'subtle' | 'on-grid-card' = 'subtle';
	export let onLikesChanged:
		| (({
				newLikeCount,
				newIsLikedByUser,
				action
		  }: {
				newLikeCount: number;
				newIsLikedByUser: boolean;
				action: 'like' | 'unlike';
		  }) => void)
		| undefined = undefined;

	export { classes as class };
	let classes = '';

	let buttonElement: HTMLButtonElement | undefined = undefined;
	const queryClient = useQueryClient();

	let abortController: AbortController | undefined = undefined;

	async function likeOutput(action: 'like' | 'unlike') {
		if (!$sessionStore?.access_token) return;
		const newLikeCount =
			action === 'like'
				? generation.selected_output.like_count + 1
				: generation.selected_output.like_count - 1;
		const newIsLikedByUser = action === 'like' ? true : false;
		logGenerationOutputLikedChange(newIsLikedByUser, newLikeCount, {
			'SC - App Version': $appVersion,
			'SC - Locale': $locale,
			'SC - Output Id': generation.selected_output.id,
			'SC - Page': `${$page.url.pathname}${$page.url.search}`,
			'SC - Stripe Product Id': $userSummary?.product_id,
			'SC - User Id': $sessionStore?.user.id,
			'SC - Generation Id': generation.id
		});
		try {
			if (modalType === 'gallery') {
				const _galleryGenerationFullOutputsQueryKey = get(galleryGenerationFullOutputsQueryKey);
				await replaceOutputInUserQueryData(queryClient, _galleryGenerationFullOutputsQueryKey, {
					id: generation.selected_output.id,
					is_liked: newIsLikedByUser,
					like_count: newLikeCount
				});
			} else if (modalType === 'history') {
				const _userGenerationFullOutputsQueryKey = get(userGenerationFullOutputsQueryKey);
				await replaceOutputInUserQueryData(queryClient, _userGenerationFullOutputsQueryKey, {
					id: generation.selected_output.id,
					is_liked: newIsLikedByUser,
					like_count: newLikeCount
				});
			} else if (modalType === 'generate' || modalType === 'stage') {
				const _userGenerationFullOutputsQueryKey = get(userGenerationFullOutputsQueryKey);
				setGenerationOutputPartial(generation.selected_output.id, {
					is_liked: newIsLikedByUser,
					like_count: newLikeCount
				});
				await replaceOutputInUserQueryData(queryClient, _userGenerationFullOutputsQueryKey, {
					id: generation.selected_output.id,
					is_liked: newIsLikedByUser,
					like_count: newLikeCount
				});
			} else if (modalType === 'user-profile') {
				const _userGenerationFullOutputsQueryKey = get(someUserProfileFullOutputsQueryKey);
				await replaceOutputInUserQueryData(queryClient, _userGenerationFullOutputsQueryKey, {
					id: generation.selected_output.id,
					is_liked: newIsLikedByUser,
					like_count: newLikeCount
				});
			} else if (modalType === 'admin-gallery') {
				const _allUserGenerationFullOutputsQueryKey = get(allUserGenerationFullOutputsQueryKey);
				await replaceOutputInUserQueryData(queryClient, _allUserGenerationFullOutputsQueryKey, {
					id: generation.selected_output.id,
					is_liked: newIsLikedByUser,
					like_count: newLikeCount
				});
			}
			if ($activeGeneration) {
				activeGeneration.set({
					...$activeGeneration,
					selected_output: {
						...generation.selected_output,
						like_count: newLikeCount,
						is_liked: newIsLikedByUser
					}
				});
			}
			if (onLikesChanged) {
				onLikesChanged({
					newLikeCount,
					newIsLikedByUser,
					action
				});
			}
			if (abortController) abortController.abort();
			abortController = new AbortController();
			const res = await likeOutputs({
				output_ids: [generation.selected_output.id],
				action,
				access_token: $sessionStore?.access_token,
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

	function onClick() {
		if ($sessionStore?.user.id && $userSummary) {
			likeOutput(generation.selected_output.is_liked ? 'unlike' : 'like');
		} else {
			isSignInModalOpen.set(true);
		}
	}
</script>

{#key generation.selected_output.id}
	{#if type === 'on-image'}
		<button
			bind:this={buttonElement}
			on:click={onClick}
			class="touch-manipulation transition group/likebutton p-2.5 rounded-full bg-c-bg relative overflow-hidden z-0
			flex flex-col items-center justify-center
			before:w-full before:h-full before:absolute before:left-0 before:top-0
			before:-translate-x-full before:not-touch:hover:translate-x-0
			before:rounded-full before:transition before:transform before:bg-c-danger/25 {classes}"
			aria-label={generation.selected_output.is_liked ? 'Unlike' : 'Like'}
		>
			<IconHeartSet
				liked={generation.selected_output.is_liked}
				class="w-7 h-7 transform flex-shrink-0 relative transition not-touch:group-hover/likebutton:text-c-danger"
			/>
		</button>
	{:else if type === 'on-grid-card'}
		<button
			bind:this={buttonElement}
			on:click={onClick}
			class="flex text-sm relative items-center justify-end gap-1 before:w-full before:h-full
			before:min-w-[48px] before:min-h-[48px] rounded-md
			before:absolute before:-bottom-2.5 before:-right-2.5 group px-2 py-1.5 {classes}"
		>
			<ButtonHoverEffect noPadding color="danger" size="sm" />
			<IconHeartSet
				liked={generation.selected_output.is_liked}
				class="w-5 h-5 transform flex-shrink-0 relative transition not-touch:group-hover:text-c-danger"
			/>
			<p
				class="font-medium transition not-touch:group-hover:text-c-danger {generation
					.selected_output.is_liked
					? 'text-c-danger'
					: ''}"
			>
				{generation.selected_output.like_count}
			</p>
		</button>
	{:else}
		<SubtleButton {onClick}>
			<div class="max-w-full flex items-center justify-center gap-1 -my-1">
				<IconHeartSet
					class="w-5 h-5 transition not-touch:group-hover:text-c-danger"
					liked={generation.selected_output.is_liked}
				/>
				<p
					class="transition not-touch:group-hover:text-c-danger {generation.selected_output.is_liked
						? 'text-c-danger'
						: ''} text-base font-medium"
				>
					{numberFormatter.format(generation.selected_output.like_count)}
				</p>
			</div>
		</SubtleButton>
	{/if}
{/key}
