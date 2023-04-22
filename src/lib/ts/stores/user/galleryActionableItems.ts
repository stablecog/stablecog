import type { TGenerationImageCardType } from '$components/generationImage/types';
import { adminGalleryActionableItems, adminGalleryCurrentFilter } from '$ts/stores/admin/gallery';
import { userGalleryActionableItems, userGalleryCurrentView } from '$ts/stores/user/gallery';
import { get } from 'svelte/store';

export function addToGalleryActionableItems({
	output_id,
	generation_id,
	cardType
}: {
	output_id: string;
	generation_id: string;
	cardType: TGenerationImageCardType;
}) {
	if (cardType === 'history') {
		const $userGalleryActionableItems = get(userGalleryActionableItems);
		const $userGalleryCurrentView = get(userGalleryCurrentView);
		if (
			$userGalleryActionableItems.find(
				(i) => i.output_id === output_id && i.view === $userGalleryCurrentView
			)
		) {
			return;
		}
		userGalleryActionableItems.set([
			...$userGalleryActionableItems,
			{
				output_id,
				generation_id,
				view: $userGalleryCurrentView
			}
		]);
	} else if (cardType === 'admin-gallery') {
		const $adminGalleryActionableItems = get(adminGalleryActionableItems);
		const $adminGalleryCurrentFilter = get(adminGalleryCurrentFilter);
		if (
			$adminGalleryActionableItems.find(
				(i) => i.output_id === output_id && i.filter === $adminGalleryCurrentFilter
			)
		) {
			return;
		}
		adminGalleryActionableItems.set([
			...$adminGalleryActionableItems,
			{
				output_id,
				generation_id,
				filter: $adminGalleryCurrentFilter
			}
		]);
	}
}

function removeFromGalleryActionableItems({
	output_id,
	cardType
}: {
	output_id: string;
	cardType: TGenerationImageCardType;
}) {
	if (cardType === 'history') {
		const $userGalleryActionableItems = get(userGalleryActionableItems);
		userGalleryActionableItems.set(
			$userGalleryActionableItems.filter((i) => i.output_id !== output_id)
		);
	} else if (cardType === 'admin-gallery') {
		const $adminGalleryActionableItems = get(adminGalleryActionableItems);
		adminGalleryActionableItems.set(
			$adminGalleryActionableItems.filter((i) => i.output_id !== output_id)
		);
	}
}

export function toggleGalleryActionableItemsState({
	output_id,
	generation_id,
	type,
	cardType
}: {
	output_id: string;
	generation_id: string;
	type: 'add' | 'remove';
	cardType: TGenerationImageCardType;
}) {
	if (type === 'remove') {
		removeFromGalleryActionableItems({ output_id, cardType });
	} else {
		addToGalleryActionableItems({ output_id, generation_id, cardType });
	}
}
