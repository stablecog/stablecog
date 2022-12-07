import { getGalleryPage } from '$ts/queries/db/gallery';
import type { TGalleryResponse } from '$ts/types/main';
import { error, type ServerLoad } from '@sveltejs/kit';

export const prerender = false;
export const load: ServerLoad = async () => {
	const res = await getGalleryPage({ page: 1, getType: 'hidden-only', getCount: true });
	const resAsGalleryResponse = res as TGalleryResponse;
	const resAsError = res as { status: number; error: string };
	if (resAsError.error) {
		throw error(resAsError.status, resAsError.error);
	}
	return resAsGalleryResponse;
};
