<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import SubtleButton from '$components/buttons/SubtleButton.svelte';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import IconPause from '$components/icons/IconPause.svelte';
	import IconStarCrossedOutlined from '$components/icons/IconStarCrossedOutlined.svelte';
	import IconStarOutlined from '$components/icons/IconStarOutlined.svelte';
	import IconTickOnly from '$components/icons/IconTickOnly.svelte';
	import IconTrashcan from '$components/icons/IconTrashcan.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import {
		modalBgTransitionProps,
		modalInTransitionProps,
		modalOutTransitionProps
	} from '$ts/animation/constants';
	import { expandCollapse } from '$ts/animation/transitions';
	import { apiUrl } from '$ts/constants/main';
	import {
		logGenerationOutputDeleted,
		logGenerationOutputFavorited,
		logGenerationOutputUnfavorited
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
	import { userGenerationFullOutputsQueryKey } from '$ts/stores/user/keys';
	import { userSummary } from '$ts/stores/user/summary';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { portal } from 'svelte-portal';
	import { quadOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

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

	let actionStatus: TActionStatus = 'idle';
	let actionType:
		| 'delete'
		| 'favorite'
		| 'unfavorite'
		| 'deselect'
		| 'approve'
		| 'reject'
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
		if (isDeleteModalOpen) {
			try {
				await deleteOutputs({
					idObjects: [...selectedOutputObjects]
				});
			} catch (error) {
				console.log(error);
			}
		} else if (isFavoriteModalOpen) {
			try {
				await favoriteOutputs({
					idObjects: [...selectedOutputObjects],
					action: 'add'
				});
			} catch (error) {
				console.log(error);
			}
		} else if (isUnfavoriteModalOpen) {
			try {
				await favoriteOutputs({
					idObjects: [...selectedOutputObjects],
					action: 'remove'
				});
			} catch (error) {
				console.log(error);
			}
		} else if (isDeselectModalOpen) {
			deselectOutputs();
			closeModal();
		} else if (isDeselectModalOpen) {
			deselectOutputs();
			closeModal();
		}
	}

	async function favoriteOutputs({
		idObjects,
		action
	}: {
		idObjects: { output_id: string; generation_id: string }[];
		action: 'add' | 'remove';
	}) {
		actionStatus = 'loading';
		const res = await fetch(`${apiUrl.origin}/v1/user/outputs/favorite`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${$page.data.session?.access_token}`
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
				'SC - User Id': $page.data.session?.user.id,
				'SC - Stripe Product Id': $userSummary?.product_id,
				'SC - App Version': $appVersion
			};
			if (action === 'add') {
				logGenerationOutputFavorited(logProps);
			} else {
				logGenerationOutputUnfavorited(logProps);
			}
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
		actionStatus = 'idle';
	}

	async function deleteOutputs({
		idObjects
	}: {
		idObjects: { output_id: string; generation_id: string }[];
	}) {
		actionStatus = 'loading';
		try {
			const res = await fetch(`${apiUrl.origin}/v1/user/generation`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$page.data.session?.access_token}`
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
						'SC - User Id': $page.data.session?.user.id,
						'SC - Stripe Product Id': $userSummary?.product_id,
						'SC - App Version': $appVersion
					};
					logGenerationOutputDeleted(logProps);
				}
			}
		} catch (error) {
			console.log('Error deleting generation output', error);
		}
		closeModal();
		deselectOutputs();
		actionStatus = 'idle';
	}

	async function approveOrReject(action: TAdminGalleryAction) {
		actionStatus = 'loading';
		actionType = action;
		try {
			const ids = [...$adminGallerySelectedOutputIds];
			const res = await fetch(`${apiUrl.origin}/v1/admin/gallery`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$page.data.session?.access_token}`
				},
				body: JSON.stringify({
					action,
					generation_output_ids: ids
				})
			});
			if (!res.ok) throw new Error('Error approving/rejecting generation outputs');
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
		} catch (error) {
			console.log(error);
		}
		actionStatus = 'idle';
		actionType = undefined;
		closeModal();
		deselectOutputs();
	}
</script>

<div
	transition:expandCollapse|local={{ duration: 200, easing: quadOut }}
	class="w-full flex flex-row flex-wrap justify-between items-center bg-c-bg rounded-xl 
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
					onClick={() => approveOrReject('approve')}
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
					onClick={() => approveOrReject('reject')}
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
	<div
		use:portal={'body'}
		transition:fade|local={modalBgTransitionProps}
		class="w-full h-full bg-c-barrier/80 fixed left-0 top-0 px-3 z-[10000]"
	/>
	<div
		use:portal={'body'}
		in:fly|local={modalInTransitionProps}
		out:fly|local={modalOutTransitionProps}
		class="w-full h-full flex flex-col items-center fixed left-0 top-0 px-3 py-20 z-[10001] overflow-auto"
	>
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
			class="max-w-full my-auto"
		>
			<div
				class="w-full max-w-md bg-c-bg ring-2 ring-c-bg-secondary rounded-xl p-5 md:p-6 shadow-2xl shadow-c-shadow/[var(--o-shadow-stronger)]"
			>
				<h1 class="font-bold text-xl -mt-1">
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
				<p class="mt-3 text-c-on-bg/75 leading-relaxed">
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
				<div class="w-full flex flex-wrap justify-end items-stretch mt-6 gap-2">
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
	</div>
{/if}
