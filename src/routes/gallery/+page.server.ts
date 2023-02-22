import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import { getGalleryPage, getGenerationG } from '$ts/queries/db/gallery';
import type { TGalleryResponse } from '$ts/types/main';
import { error, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ url }) => {
	if (!supabaseAdmin) throw error(500, 'No Supabase instance found');
	const generationId = url.searchParams.get('generation');

	return {};
};
