import { activeGeneration } from '$ts/stores/user/generation';
import { get, writable } from 'svelte/store';

export const recentlyUpdatedOutputIds = writable<string[]>([]);

export const addToRecentlyUpdatedOutputIds = (output_id: string) => {
	recentlyUpdatedOutputIds.update(($recentlyUpdatedOutputIds) => {
		const hasId = $recentlyUpdatedOutputIds.includes(output_id);
		if (hasId) {
			return $recentlyUpdatedOutputIds;
		}
		const isActive = get(activeGeneration)?.selected_output.id ? true : false;
		if (isActive) {
			return $recentlyUpdatedOutputIds;
		}
		$recentlyUpdatedOutputIds.unshift(output_id);
		return $recentlyUpdatedOutputIds;
	});
};
