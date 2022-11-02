import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import type { TGalleryResponse } from '$ts/types/main';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ request }) => {
	if (!supabaseAdmin) return { status: 500, error: new Error('No Supabase instance found') };
	const res = await fetch('http://localhost:5173/api/gallery');
	const resJson: TGalleryResponse = await res.json();
	return resJson;
};
