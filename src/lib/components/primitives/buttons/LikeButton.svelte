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
	import { adminFullOutputsQueryKey } from '$ts/stores/admin/gallery';
	import { appVersion } from '$ts/stores/appVersion';
	import { isSignInModalOpen } from '$ts/stores/isSignInModalOpen';
	import {
		activeGeneration,
		setGenerationOutputPartial,
		type TGenerationWithSelectedOutput
	} from '$ts/stores/user/generation';
	import {
		galleryFullOutputsQueryKey,
		userProfileFullOutputsQueryKey,
		historyFullOutputsQueryKey
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
				const _galleryFullOutputsQueryKey = get(galleryFullOutputsQueryKey);
				await replaceOutputInUserQueryData(queryClient, _galleryFullOutputsQueryKey, {
					id: generation.selected_output.id,
					is_liked: newIsLikedByUser,
					like_count: newLikeCount
				});
			} else if (modalType === 'history') {
				const _historyFullOutputsQueryKey = get(historyFullOutputsQueryKey);
				await replaceOutputInUserQueryData(queryClient, _historyFullOutputsQueryKey, {
					id: generation.selected_output.id,
					is_liked: newIsLikedByUser,
					like_count: newLikeCount
				});
			} else if (modalType === 'generate' || modalType === 'stage') {
				const _historyFullOutputsQueryKey = get(historyFullOutputsQueryKey);
				setGenerationOutputPartial(generation.selected_output.id, {
					is_liked: newIsLikedByUser,
					like_count: newLikeCount
				});
				await replaceOutputInUserQueryData(queryClient, _historyFullOutputsQueryKey, {
					id: generation.selected_output.id,
					is_liked: newIsLikedByUser,
					like_count: newLikeCount
				});
			} else if (modalType === 'user-profile') {
				const _historyFullOutputsQueryKey = get(userProfileFullOutputsQueryKey);
				await replaceOutputInUserQueryData(queryClient, _historyFullOutputsQueryKey, {
					id: generation.selected_output.id,
					is_liked: newIsLikedByUser,
					like_count: newLikeCount
				});
			} else if (modalType === 'admin-gallery') {
				const _adminFullOutputsQueryKey = get(adminFullOutputsQueryKey);
				await replaceOutputInUserQueryData(queryClient, _adminFullOutputsQueryKey, {
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
			class="group/likebutton relative z-0 flex touch-manipulation flex-col items-center justify-center overflow-hidden
			rounded-full bg-c-bg p-2.5 transition
			before:absolute before:left-0 before:top-0 before:h-full before:w-full
			before:-translate-x-full before:transform
			before:rounded-full before:bg-c-danger/25 before:transition before:not-touch:hover:translate-x-0 {classes}"
			aria-label={generation.selected_output.is_liked ? 'Unlike' : 'Like'}
		>
			<IconHeartSet
				liked={generation.selected_output.is_liked}
				class="relative h-7 w-7 flex-shrink-0 transform transition not-touch:group-hover/likebutton:text-c-danger"
			/>
		</button>
	{:else if type === 'on-grid-card'}
		<button
			bind:this={buttonElement}
			on:click={onClick}
			class="group relative flex items-center justify-end gap-1 rounded-md px-2
			py-1.5 text-sm before:absolute
			before:-bottom-2.5 before:-right-2.5 before:h-full before:min-h-[48px] before:w-full before:min-w-[48px] {classes}"
		>
			<ButtonHoverEffect noPadding color="danger" size="sm" />
			<IconHeartSet
				liked={generation.selected_output.is_liked}
				class="relative h-5 w-5 flex-shrink-0 transform transition not-touch:group-hover:text-c-danger"
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
			<div class="-my-1 flex max-w-full items-center justify-center gap-1">
				<IconHeartSet
					class="h-5 w-5 transition not-touch:group-hover:text-c-danger"
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
