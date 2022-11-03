import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import { deleteFromGallery } from '$ts/queries/db/deleteFromGallery';
import { getGalleryPage } from '$ts/queries/gallery';
import type { TGalleryResponse } from '$ts/types/main';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page') ?? '1');
	const res = await getGalleryPage(page, 'hidden-only');
	const resAsGalleryResponse = res as TGalleryResponse;
	const resAsError = res as { status: number; error: string };
	if (resAsError.error) {
		return new Response(resAsError.error, { status: resAsError.status });
	}
	return new Response(JSON.stringify(resAsGalleryResponse), {
		headers: { 'Content-Type': 'application/json' }
	});
};

export const DELETE: RequestHandler = async ({ url }) => {
	if (!supabaseAdmin) return new Response('No Supabase instance found', { status: 500 });
	const id = url.searchParams.get('id');
	const image_id = url.searchParams.get('image_id');
	console.log(`---- Gallery delete request -- ${id} ----`);
	if (id && image_id) {
		const res = await deleteFromGallery(id, image_id);
		if (res.error) {
			return new Response(res.error, { status: res.status });
		} else {
			console.log(`---- Gallery delete request succeeded -- ${id} ----`);
			return new Response(JSON.stringify(res.data));
		}
	}
	return new Response('No id or image_id provided', { status: 400 });
};

export const PATCH: RequestHandler = async ({ url }) => {
	if (!supabaseAdmin) return new Response('No Supabase instance found', { status: 500 });
	const id = url.searchParams.get('id');
	const hidden = url.searchParams.get('hidden');
	console.log(`---- Gallery update request -- ${id} -- ${hidden} ----`);
	if (!id || !hidden) return new Response('No id or hidden provided', { status: 400 });
	const { error } = await supabaseAdmin
		.from('generation_g')
		.update({ hidden: hidden })
		.eq('id', id);
	if (error) return new Response(error.message, { status: 500 });
	console.log(`---- Gallery update request successful -- ${id} -- ${hidden} ----`);
	return new Response(JSON.stringify({ id: id, hidden: hidden }), { status: 200 });
};
