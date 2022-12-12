import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import { getGalleryPage, getGenerationG } from '$ts/queries/db/gallery';
import type { TGalleryResponse } from '$ts/types/main';
import { error, type ServerLoad } from '@sveltejs/kit';

export const prerender = false;
export const load: ServerLoad = async ({ url }) => {
	if (!supabaseAdmin) throw error(500, 'No Supabase instance found');
	const generationId = url.searchParams.get('generation');
	const [generationRes, galleryRes] = await Promise.all([
		generationId ? getGenerationG(generationId) : null,
		getGalleryPage({ page: 1 })
	]);
	const resAsGalleryResponse = galleryRes as TGalleryResponse;
	const resAsError = galleryRes as { status: number; error: string };
	if (resAsError.error) {
		throw error(resAsError.status, resAsError.error);
	}
	return { galleryData: resAsGalleryResponse, generationData: generationRes?.data };
};
