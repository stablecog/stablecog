import { activeGeneration } from '$ts/stores/user/generation';
import { writableLocal } from '$ts/stores/writableLocal';
import { get } from 'svelte/store';
import { z } from 'zod';

const maxItems = 50;
export const recentlyUpdatedOutputIds = writableLocal<string[]>({
	key: 'recentlyUpdatedOutputIds',
	defaultValue: [],
	schema: z.array(z.string())
});

export const addToRecentlyUpdatedOutputIds = (output_id: string) => {
	recentlyUpdatedOutputIds.update(($recentlyUpdatedOutputIds) => {
		const hasId = $recentlyUpdatedOutputIds.includes(output_id);
		if (hasId) {
			return $recentlyUpdatedOutputIds;
		}
		const isActive = get(activeGeneration)?.selected_output.id === output_id ? true : false;
		if (isActive) {
			return $recentlyUpdatedOutputIds;
		}
		$recentlyUpdatedOutputIds.unshift(output_id);
		const sliced = $recentlyUpdatedOutputIds.slice(0, maxItems);
		return sliced;
	});
};

export const removeFromRecentlyUpdatedOutputIds = (output_id: string) => {
	recentlyUpdatedOutputIds.update(($recentlyUpdatedOutputIds) => {
		const hasId = $recentlyUpdatedOutputIds.includes(output_id);
		if (!hasId) {
			return $recentlyUpdatedOutputIds;
		}
		const filtered = $recentlyUpdatedOutputIds.filter((id) => id !== output_id);
		return filtered;
	});
};
