import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import type { RequestHandler } from '@sveltejs/kit';

const batch = 50;
const headers = {
	'Content-Type': 'application/json'
};

export const GET: RequestHandler = async ({ request, params }) => {
	if (!supabaseAdmin) return new Response('No Supabase instance', { status: 500 });
	const page = parseInt(params.page || '1');
	const { data, error } = await supabaseAdmin
		.from('generation_p')
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
		.order('updated_at', { ascending: false })
		.range((page - 1) * batch, page * batch);
	if (error) {
		console.log(error);
		return new Response(error.message, { status: 500, headers });
	}
	const formattedData: TGalleryResponse[] = data.map((d) => {
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
	return new Response(JSON.stringify(formattedData), { headers });
};

export interface TGalleryResponse {
	id: string;
	width: number;
	height: number;
	seed: string;
	inference_steps: number | null;
	guidance_scale: number;
	image_id: string;
	created_at: string;
	updated_at: string;
	prompt: string;
	negative_prompt: string | null;
	model: string;
}
