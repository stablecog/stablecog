import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import type { TDBGenerationG } from '$ts/types/db';
import type { TGalleryResponse } from '$ts/types/main';

const batch = 50;

type TGetType = 'visible-only' | 'hidden-only' | 'all';

export async function getGalleryPage(page: number, getType: TGetType = 'visible-only') {
	if (!supabaseAdmin) {
		console.log('No Supabase instance found');
		return { status: 500, error: 'No Supabase instance found' };
	}
	console.log(`---- Request for gallery page: ${page} ----`);
	const [pageRes, nextRes] = await Promise.all([
		supabaseAdmin
			.from('generation_g')
			.select(
				`
					width,
					height,
					prompt:prompt_id(id,text),
					negative_prompt:negative_prompt_id(id,text),
					model:model_id(id,name),
					seed,
					inference_steps,
					guidance_scale,
					image_id,
					created_at,
					updated_at,
					id
				`
			)
			.filter(
				'hidden',
				'in',
				getType === 'all' ? '(true,false)' : getType === 'hidden-only' ? '(true)' : '(false)'
			)
			.order('created_at', { ascending: false })
			.range((page - 1) * batch, page * batch - 1),
		supabaseAdmin
			.from('generation_g')
			.select(
				`
					width,
					height,
					prompt:prompt_id(id,text),
					negative_prompt:negative_prompt_id(id,text),
					model:model_id(id,name),
					seed,
					inference_steps,
					guidance_scale,
					image_id,
					created_at,
					updated_at,
					id
				`
			)
			.filter(
				'hidden',
				'in',
				getType === 'all' ? '(true,false)' : getType === 'hidden-only' ? '(true)' : '(false)'
			)
			.order('created_at', { ascending: false })
			.range(page * batch, page * batch)
	]);
	const { data: pageData, error: pageError } = pageRes;
	const { data: nextData, error: nextError } = nextRes;
	if (pageError || nextError) {
		console.log('Error getting generations:', pageError || nextError);
		return { status: 500, error: 'Error getting generations' };
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
			prompt: d.prompt as { id: string; text: string },
			negative_prompt: (d.negative_prompt as { id: string; text: string } | null)
				? (d.negative_prompt as { id: string; text: string })
				: null,
			model: d.model as { id: string; name: string }
		};
	});
	const response: TGalleryResponse = {
		generations: data,
		page,
		next
	};
	return response;
}
