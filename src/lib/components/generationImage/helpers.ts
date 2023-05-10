import type { TGenerationImageCardType } from '$components/generationImage/types';
import { toggleGalleryActionableItemsState } from '$ts/stores/user/galleryActionableItems';

export function onSelectButtonClicked({
	e,
	output_id,
	generation_id,
	cardType,
	isInGallerySelectedIds
}: TProps) {
	toggleGalleryActionableItemsState({
		output_id,
		generation_id: generation_id || '',
		cardType,
		type: isInGallerySelectedIds ? 'remove' : 'add'
	});
	e.currentTarget.blur();
}

interface TProps {
	e: MouseEvent & {
		currentTarget: EventTarget & HTMLButtonElement;
	};
	output_id: string;
	generation_id?: string;
	isInGallerySelectedIds: boolean;
	cardType: TGenerationImageCardType;
}
