import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import type { TDBGenerationG } from '$ts/types/db';
import type { TGalleryResponse } from '$ts/types/main';
import type { RequestHandler } from '@sveltejs/kit';

const batch = 50;
const headers = {
	'Content-Type': 'application/json'
};

export const GET: RequestHandler = async ({ url }) => {
	if (!supabaseAdmin) return new Response('No Supabase instance', { status: 500 });
	const page = Number(url.searchParams.get('page')) || 1;
	console.log(`---- Request for gallery page: ${page} ----`);
	const [pageRes, nextRes] = await Promise.all([
		supabaseAdmin
			.from('generation_g')
			.select(
				`width,
      height,
      prompt_id(text),
      negative_prompt_id(text),
      model_id(name),
      seed,
      inference_steps,
      guidance_scale,
      image_id,
      created_at,
      updated_at,
      id`
			)
			.filter('hidden', 'eq', false)
			.order('created_at', { ascending: false })
			.range((page - 1) * batch, page * batch - 1),
		supabaseAdmin
			.from('generation_g')
			.select(
				`width,
      height,
      prompt_id(text),
      negative_prompt_id(text),
      model_id(name),
      seed,
      inference_steps,
      guidance_scale,
      image_id,
      created_at,
      updated_at,
      id`
			)
			.filter('hidden', 'eq', false)
			.order('created_at', { ascending: false })
			.range(page * batch, page * batch)
	]);
	const { data: pageData, error: pageError } = pageRes;
	const { data: nextData, error: nextError } = nextRes;
	if (pageError || nextError) {
		console.log('Error getting generations:', pageError || nextError);
		return new Response('Error getting generations', { status: 500 });
	}
	let next: number | null = null;
	if (nextData?.length > 0) next = page + 1;
	console.log(`---- Responding to gallery page request -- Page: ${page} -- Next: ${next} ----`);
	const data: TDBGenerationG[] = pageData.map((d) => {
		return {
			id: d.id,
			width: d.width,
			height: d.height,
			seed: d.seed,
			inference_steps: d.inference_steps,
			guidance_scale: d.guidance_scale,
			image_id: d.image_id,
			created_at: d.created_at,
			updated_at: d.updated_at,
			prompt: (d.prompt_id as { text: string }).text,
			negative_prompt: (d.negative_prompt_id as { text: string } | null)
				? (d.negative_prompt_id as { text: string }).text
				: null,
			model: (d.model_id as { name: string }).name
		};
	});
	const response: TGalleryResponse = {
		generations: data,
		page,
		next
	};
	return new Response(JSON.stringify(response), { headers });
};
