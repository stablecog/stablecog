import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import { deleteFromGallery } from '$ts/queries/db/deleteFromGallery';
import { getGalleryPage } from '$ts/queries/db/gallery';
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
	if (!supabaseAdmin)
		return new Response(JSON.stringify({ error: 'No Supabase instance found' }), { status: 500 });
	const id = url.searchParams.get('id');
	const image_id = url.searchParams.get('image_id');
	console.log(`---- Gallery delete request -- ${id} ----`);
	if (!id || !image_id)
		return new Response(JSON.stringify({ error: 'No id or image_id provided' }), { status: 400 });
	const { data, error, status } = await deleteFromGallery(id, image_id);
	if (error) return new Response(JSON.stringify({ error: error }), { status: status });
	console.log(`---- Gallery delete request succeeded -- ${id} ----`);
	return new Response(JSON.stringify({ data: data }));
};

export const PATCH: RequestHandler = async ({ url }) => {
	if (!supabaseAdmin)
		return new Response(JSON.stringify({ error: 'No Supabase instance found' }), { status: 500 });
	const id = url.searchParams.get('id');
	const hidden = url.searchParams.get('hidden');
	console.log(`---- Gallery update request -- ${id} -- ${hidden} ----`);
	if (!id || !hidden)
		return new Response(JSON.stringify({ error: 'No id or hidden provided' }), { status: 400 });
	const { error } = await supabaseAdmin
		.from('generation_g')
		.update({ hidden: hidden })
		.eq('id', id);
	if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	console.log(`---- Gallery update request successful -- ${id} -- ${hidden} ----`);
	return new Response(JSON.stringify({ data: { id: id, hidden: hidden } }), { status: 200 });
};
