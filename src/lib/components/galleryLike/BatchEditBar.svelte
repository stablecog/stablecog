<script lang="ts">
	import { page } from '$app/stores';
	import ModalWrapper from '$components/modals/ModalWrapper.svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import SubtleButton from '$components/primitives/buttons/SubtleButton.svelte';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import IconPause from '$components/icons/IconPause.svelte';
	import IconStarCrossedOutlined from '$components/icons/IconStarCrossedOutlined.svelte';
	import IconStarOutlined from '$components/icons/IconStarOutlined.svelte';
	import IconTickOnly from '$components/icons/IconTickOnly.svelte';
	import IconTrashcan from '$components/icons/IconTrashcan.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { apiUrl } from '$ts/constants/main';
	import {
		logGenerationOutputDeleted,
		logGenerationOutputFavoritedChange
	} from '$ts/helpers/loggers';
	import type { TUserGenerationFullOutputsPage } from '$ts/queries/userGenerations';
	import {
		adminGalleryActionableItems,
		adminGalleryCurrentFilter,
		adminGallerySelectedOutputIds,
		adminGallerySelectedOutputObjects,
		allUserGenerationFullOutputsQueryKey,
		isAdminGalleryEditActive,
		type TAdminGalleryAction
	} from '$ts/stores/admin/gallery';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { appVersion } from '$ts/stores/appVersion';
	import {
		isUserGalleryEditActive,
		userGalleryActionableItems,
		userGalleryCurrentView,
		userGallerySelectedOutputIds,
		userGallerySelectedOutputObjects
	} from '$ts/stores/user/gallery';
	import { userGenerationFullOutputsQueryKey } from '$ts/stores/user/queryKeys';
	import { userSummary } from '$ts/stores/user/summary';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { quadOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { sessionStore } from '$ts/constants/supabase';

	export let type: 'history' | 'admin-gallery';

	const queryClient = useQueryClient();

	$: selectedOutputIds =
		type === 'admin-gallery' ? $adminGallerySelectedOutputIds : $userGallerySelectedOutputIds;

	$: selectedOutputObjects =
		type === 'admin-gallery'
			? $adminGallerySelectedOutputObjects
			: $userGallerySelectedOutputObjects;

	let isDeleteModalOpen = false;
	let isFavoriteModalOpen = false;
	let isUnfavoriteModalOpen = false;
	let isDeselectModalOpen = false;
	let modalScrollContainer: HTMLDivElement;

	let actionStatus: TActionStatus = 'idle';
	let actionType:
		| 'delete'
		| 'favorite'
		| 'unfavorite'
		| 'deselect'
		| 'approve'
		| 'reject'
		| 'waiting_for_approval'
		| undefined = undefined;
	type TActionStatus = 'idle' | 'loading' | 'error';

	function deselectOutputs() {
		if (type === 'admin-gallery') {
			adminGalleryActionableItems.set(
				$adminGalleryActionableItems.filter(
					(item) =>
						!$adminGallerySelectedOutputIds.includes(item.output_id) ||
						item.filter !== $adminGalleryCurrentFilter
				)
			);
		} else if (type === 'history') {
			userGalleryActionableItems.set(
				$userGalleryActionableItems.filter(
					(item) =>
						!$userGallerySelectedOutputIds.includes(item.output_id) ||
						item.view !== $userGalleryCurrentView
				)
			);
		}
	}

	function pauseEdit() {
		if (type === 'admin-gallery') {
			isAdminGalleryEditActive.set(false);
		} else if (type === 'history') {
			isUserGalleryEditActive.set(false);
		}
	}

	function onDeleteButtonClicked() {
		isDeleteModalOpen = true;
	}

	function onFavoriteButtonClicked() {
		isFavoriteModalOpen = true;
	}

	function onDeselectButtonClicked() {
		isDeselectModalOpen = true;
	}
	function onUnfavoriteButtonClicked() {
		isUnfavoriteModalOpen = true;
	}

	function closeModal() {
		isDeleteModalOpen = false;
		isFavoriteModalOpen = false;
		isUnfavoriteModalOpen = false;
		isDeselectModalOpen = false;
	}

	async function onConfirmButtonClicked() {
		try {
			if (isDeleteModalOpen) {
				await deleteOutputs({
					idObjects: [...selectedOutputObjects]
				});
			} else if (isFavoriteModalOpen) {
				await favoriteOutputs({
					idObjects: [...selectedOutputObjects],
					action: 'add'
				});
			} else if (isUnfavoriteModalOpen) {
				await favoriteOutputs({
					idObjects: [...selectedOutputObjects],
					action: 'remove'
				});
			} else if (isDeselectModalOpen) {
				deselectOutputs();
				closeModal();
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function favoriteOutputs({
		idObjects,
		action
	}: {
		idObjects: { output_id: string; generation_id: string }[];
		action: 'add' | 'remove';
	}) {
		try {
			actionStatus = 'loading';
			const res = await fetch(`${apiUrl.origin}/v1/user/outputs/favorite`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$sessionStore?.access_token}`
				},
				body: JSON.stringify({
					generation_output_ids: idObjects.map((idObject) => idObject.output_id),
					action
				})
			});
			if (!res.ok) throw new Error('Response not ok');
			for (let i = 0; i < idObjects.length; i++) {
				let idObject = idObjects[i];
				const logProps = {
					'SC - Generation Id': idObject.generation_id,
					'SC - Output Id': idObject.output_id,
					'SC - Advanced Mode': $advancedModeApp,
					'SC - Locale': $locale,
					'SC - Page': `${$page.url.pathname}${$page.url.search}`,
					'SC - User Id': $sessionStore?.user.id,
					'SC - Stripe Product Id': $userSummary?.product_id,
					'SC - App Version': $appVersion
				};
				logGenerationOutputFavoritedChange(action === 'add' ? 'favorite' : 'unfavorite', logProps);
			}
			if (type === 'history') {
				queryClient.setQueryData($userGenerationFullOutputsQueryKey, (data: any) => ({
					...data,
					pages: data.pages.map((page: TUserGenerationFullOutputsPage) => {
						return {
							...page,
							outputs: page.outputs.map((output) =>
								idObjects.map((i) => i.output_id).includes(output.id)
									? { ...output, is_favorited: action === 'add' }
									: output
							)
						};
					})
				}));
			}
			closeModal();
			deselectOutputs();
		} catch (error) {
			console.log(error);
		} finally {
			actionStatus = 'idle';
		}
	}

	async function deleteOutputs({
		idObjects
	}: {
		idObjects: { output_id: string; generation_id: string }[];
	}) {
		try {
			actionStatus = 'loading';
			const res = await fetch(`${apiUrl.origin}/v1/user/generation`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$sessionStore?.access_token}`
				},
				body: JSON.stringify({ generation_output_ids: idObjects.map((i) => i.output_id) })
			});
			if (!res.ok) throw new Error('Response not ok');
			console.log('Delete generation output response', res);
			if (type === 'history') {
				queryClient.setQueryData($userGenerationFullOutputsQueryKey, (data: any) => ({
					...data,
					pages: data.pages.map((page: TUserGenerationFullOutputsPage) => {
						return {
							...page,
							outputs: page.outputs.map((output) =>
								idObjects.map((i) => i.output_id).includes(output.id)
									? { ...output, is_deleted: true }
									: output
							)
						};
					})
				}));
				for (let i = 0; i < idObjects.length; i++) {
					let idObject = idObjects[i];
					const logProps = {
						'SC - Generation Id': idObject.generation_id,
						'SC - Output Id': idObject.output_id,
						'SC - Advanced Mode': $advancedModeApp,
						'SC - Locale': $locale,
						'SC - Page': `${$page.url.pathname}${$page.url.search}`,
						'SC - User Id': $sessionStore?.user.id,
						'SC - Stripe Product Id': $userSummary?.product_id,
						'SC - App Version': $appVersion
					};
					logGenerationOutputDeleted(logProps);
				}
			}
			closeModal();
			deselectOutputs();
		} catch (error) {
			console.log(error);
		} finally {
			actionStatus = 'idle';
		}
	}

	async function setGalleryStatus(action: TAdminGalleryAction) {
		try {
			actionStatus = 'loading';
			actionType = action;
			const ids = [...$adminGallerySelectedOutputIds];
			const res = await fetch(`${apiUrl.origin}/v1/admin/gallery`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$sessionStore?.access_token}`
				},
				body: JSON.stringify({
					action,
					generation_output_ids: ids
				})
			});
			if (!res.ok) throw new Error('Error setting generation output status');
			const resJson = await res.json();
			adminGalleryActionableItems.set(
				$adminGalleryActionableItems.filter(
					(i) => !ids.includes(i.output_id) || i.filter !== $adminGalleryCurrentFilter
				)
			);
			queryClient.setQueryData($allUserGenerationFullOutputsQueryKey, (data: any) => ({
				...data,
				pages: data.pages.map((page: TUserGenerationFullOutputsPage) => {
					return {
						...page,
						outputs: page.outputs.map((output) =>
							ids.includes(output.id)
								? {
										...output,
										gallery_status:
											action === 'approve'
												? 'approved'
												: action === 'reject'
													? 'rejected'
													: undefined
									}
								: output
						)
					};
				})
			}));
			actionType = undefined;
			closeModal();
			deselectOutputs();
		} catch (error) {
			console.log(error);
		} finally {
			actionStatus = 'idle';
		}
	}
</script>

<div
	in:fly={{ duration: 150, easing: quadOut, y: -12, opacity: 0 }}
	class="flex w-full flex-row flex-wrap items-center justify-between rounded-xl bg-c-bg
	shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] ring-2 ring-c-bg-secondary"
>
	<div class="flex flex-wrap items-center gap-2.5 p-2">
		<SubtleButton size="md" icon={IconPause} onClick={pauseEdit}
			>{$LL.Shared.BatchEditBar.PauseEditingButton()}</SubtleButton
		>
		<SubtleButton
			disabled={selectedOutputIds.length === 0}
			size="md"
			icon={IconCancel}
			onClick={onDeselectButtonClicked}
		>
			{$LL.Shared.BatchEditBar.DeselectButton({
				selectedCount: selectedOutputIds.length
			})}
		</SubtleButton>
		{#if type === 'history'}
			{#if $userGalleryCurrentView !== 'favorites'}
				<SubtleButton
					disabled={selectedOutputIds.length === 0}
					size="md"
					icon={IconStarOutlined}
					textColor="secondary"
					onClick={onFavoriteButtonClicked}
				>
					{$LL.Shared.BatchEditBar.FavoriteButton({
						selectedCount: selectedOutputIds.length
					})}
				</SubtleButton>
			{:else}
				<SubtleButton
					disabled={selectedOutputIds.length === 0}
					size="md"
					icon={IconStarCrossedOutlined}
					textColor="secondary"
					onClick={onUnfavoriteButtonClicked}
				>
					{$LL.Shared.BatchEditBar.UnfavoriteButton({
						selectedCount: selectedOutputIds.length
					})}
				</SubtleButton>
			{/if}
			<SubtleButton
				disabled={selectedOutputIds.length === 0}
				size="md"
				icon={IconTrashcan}
				textColor="danger"
				onClick={onDeleteButtonClicked}
			>
				{$LL.Shared.BatchEditBar.DeleteButton({
					selectedCount: selectedOutputIds.length
				})}
			</SubtleButton>
		{/if}
		{#if type === 'admin-gallery'}
			{#if $adminGalleryCurrentFilter !== 'approved'}
				<SubtleButton
					disabled={selectedOutputIds.length === 0 || actionStatus === 'loading'}
					loading={actionStatus === 'loading' && actionType === 'approve'}
					withSpinner
					size="md"
					icon={IconTickOnly}
					textColor="success"
					onClick={() => setGalleryStatus('approve')}
				>
					{$LL.Shared.BatchEditBar.ApproveButton({
						selectedCount: selectedOutputIds.length
					})}
				</SubtleButton>
			{/if}
			{#if $adminGalleryCurrentFilter !== 'rejected'}
				<SubtleButton
					disabled={selectedOutputIds.length === 0 || actionStatus === 'loading'}
					loading={actionStatus === 'loading' && actionType === 'reject'}
					withSpinner
					size="md"
					icon={IconCancel}
					textColor="danger"
					onClick={() => setGalleryStatus('reject')}
				>
					{$LL.Shared.BatchEditBar.RejectButton({
						selectedCount: selectedOutputIds.length
					})}
				</SubtleButton>
			{/if}
		{/if}
	</div>
</div>

{#if isDeleteModalOpen || isFavoriteModalOpen || isDeselectModalOpen || isUnfavoriteModalOpen}
	<ModalWrapper bind:scrollContainer={modalScrollContainer}>
		<div
			use:clickoutside={{
				callback: () => {
					if (actionStatus === 'loading') {
						return;
					}
					isDeleteModalOpen = false;
					isFavoriteModalOpen = false;
					isDeselectModalOpen = false;
				}
			}}
			class="my-auto max-w-full"
		>
			<div
				class="w-full max-w-md rounded-xl bg-c-bg p-5 shadow-2xl shadow-c-shadow/[var(--o-shadow-stronger)] ring-2 ring-c-bg-secondary md:p-6"
			>
				<h1 class="-mt-1 text-xl font-bold">
					{#if isDeleteModalOpen}
						{$LL.Shared.BatchEditBar.ConfirmationModal.Delete.Title({
							selectedCount: selectedOutputIds.length
						})}
					{:else if isFavoriteModalOpen}
						{$LL.Shared.BatchEditBar.ConfirmationModal.Favorite.Title({
							selectedCount: selectedOutputIds.length
						})}
					{:else if isUnfavoriteModalOpen}
						{$LL.Shared.BatchEditBar.ConfirmationModal.Unfavorite.Title({
							selectedCount: selectedOutputIds.length
						})}
					{:else if isDeselectModalOpen}
						{$LL.Shared.BatchEditBar.ConfirmationModal.Deselect.Title({
							selectedCount: selectedOutputIds.length
						})}
					{/if}
				</h1>
				<p class="mt-3 leading-relaxed text-c-on-bg/75">
					{#if isDeleteModalOpen}
						{$LL.Shared.BatchEditBar.ConfirmationModal.Delete.Paragraph({
							selectedCount: selectedOutputIds.length
						})}
					{:else if isFavoriteModalOpen}
						{$LL.Shared.BatchEditBar.ConfirmationModal.Favorite.Paragraph({
							selectedCount: selectedOutputIds.length
						})}
					{:else if isUnfavoriteModalOpen}
						{$LL.Shared.BatchEditBar.ConfirmationModal.Unfavorite.Paragraph({
							selectedCount: selectedOutputIds.length
						})}
					{:else if isDeselectModalOpen}
						{$LL.Shared.BatchEditBar.ConfirmationModal.Deselect.Paragraph({
							selectedCount: selectedOutputIds.length
						})}
					{/if}
				</p>
				<div class="mt-6 flex w-full flex-wrap items-stretch justify-end gap-2">
					<Button
						disabled={actionStatus === 'loading'}
						onClick={closeModal}
						size="sm"
						type="no-bg-on-bg"
					>
						{$LL.Shared.BatchEditBar.ConfirmationModal.CancelButton()}</Button
					>
					<Button
						withSpinner
						loading={actionStatus === 'loading'}
						size="sm"
						onClick={onConfirmButtonClicked}
					>
						{#if isDeleteModalOpen}
							{$LL.Shared.BatchEditBar.ConfirmationModal.Delete.ConfirmButton()}
						{:else if isFavoriteModalOpen}
							{$LL.Shared.BatchEditBar.ConfirmationModal.Favorite.ConfirmButton()}
						{:else if isUnfavoriteModalOpen}
							{$LL.Shared.BatchEditBar.ConfirmationModal.Unfavorite.ConfirmButton()}
						{:else if isDeselectModalOpen}
							{$LL.Shared.BatchEditBar.ConfirmationModal.Deselect.ConfirmButton()}
						{/if}
					</Button>
				</div>
			</div>
		</div>
	</ModalWrapper>
{/if}
