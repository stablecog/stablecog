import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import { getGalleryPage } from '$ts/queries/db/gallery';
import type { TGalleryResponse } from '$ts/types/main';
import { error, type ServerLoad } from '@sveltejs/kit';

export const prerender = false;
export const load: ServerLoad = async () => {
	if (!supabaseAdmin) throw error(500, 'No Supabase instance found');
	const res = await getGalleryPage(1);
	const resAsGalleryResponse = res as TGalleryResponse;
	const resAsError = res as { status: number; error: string };
	if (resAsError.error) {
		throw error(resAsError.status, resAsError.error);
	}
	const randomSortedGenerations = resAsGalleryResponse.generations.sort(() => Math.random() - 0.5);
	const response: TGalleryResponse = {
		generations: randomSortedGenerations,
		page: resAsGalleryResponse.page,
		next: resAsGalleryResponse.next
	};
	return response;
};
