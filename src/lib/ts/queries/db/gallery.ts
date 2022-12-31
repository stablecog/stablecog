import type { TAvailableModelId, TAvailableSchedulerId } from '$ts/constants/main';
import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import { shuffleArray } from '$ts/helpers/shuffleArray';
import type { TDBGenerationG } from '$ts/types/db';
import type { TGalleryResponse } from '$ts/types/main';
import type { PostgrestError } from '@supabase/supabase-js';

const batch = 50;

type TGetType = 'visible-only' | 'hidden-only' | 'all';

export async function getGalleryPage({
	page = 1,
	getType = 'visible-only',
	getCount = false
}: {
	page: number;
	getType?: TGetType;
	getCount?: boolean;
}) {
	if (!supabaseAdmin) {
		console.log('No Supabase instance found');
		return { status: 500, error: 'No Supabase instance found' };
	}
	console.log(`---- Request for gallery page: ${page} ----`);
	const pagePromise = supabaseAdmin
		.from('generation_g')
		.select(
			`
			width,
			height,
			prompt:prompt_id(id,text),
			negative_prompt:negative_prompt_id(id,text),
			model:model_id(id,name),
			scheduler:scheduler_id(id,name),
			seed,
			num_inference_steps,
			guidance_scale,
			image_id,
			created_at,
			updated_at,
			id
		`,
			{ count: getCount ? 'exact' : undefined }
		)
		.filter(
			'hidden',
			'in',
			getType === 'all' ? '(true,false)' : getType === 'hidden-only' ? '(true)' : '(false)'
		)
		.order('created_at', { ascending: false })
		.range((page - 1) * batch, page * batch - 1 + 1);
	// @ts-ignore
	const [pageRes]: [TGenerationGPage] = await Promise.all([pagePromise]);
	const { data: pageData, error: pageError, count }: TGenerationGPage = pageRes;
	if (pageError || !pageData) {
		console.log('Error getting generations:', pageError);
		return { status: 500, error: 'Error getting generations' };
	}
	let next: number | null = null;
	if (pageData?.length > batch) next = page + 1;
	console.log(`---- Responding to gallery page request -- Page: ${page} -- Next: ${next} ----`);
	const data: TDBGenerationG[] = pageData.map((d) => {
		const { prompt, negative_prompt, model, scheduler, ...rest } = d;
		return {
			...rest,
			prompt: prompt as { id: string; text: string },
			negative_prompt: (negative_prompt as { id: string; text: string } | null)
				? (negative_prompt as { id: string; text: string })
				: null,
			model: model as { id: TAvailableModelId; name: string },
			scheduler: scheduler as { id: TAvailableSchedulerId; name: string }
		};
	});
	const generations = data.slice(0, batch);
	const shuffledGenerations = shuffleArray(generations);
	const response: TGalleryResponse = {
		generations: shuffledGenerations,
		page,
		next,
		totalCount: count !== null && count !== undefined ? count : undefined
	};
	return response;
}

export async function getGenerationG(id: string) {
	if (!supabaseAdmin) {
		console.log('No Supabase instance found');
		return { data: null, error: 'No Supabase instance found' };
	}
	const { data, error } = await supabaseAdmin
		.from('generation_g')
		.select(
			`
			width,
			height,
			prompt:prompt_id(id,text),
			negative_prompt:negative_prompt_id(id,text),
			model:model_id(id,name),
			scheduler:scheduler_id(id,name),
			seed,
			num_inference_steps,
			guidance_scale,
			image_id,
			created_at,
			updated_at,
			id
		`
		)
		.filter('id', 'eq', id)
		.maybeSingle();
	if (error) console.log(error);
	if (data) {
		const generation: TDBGenerationG = {
			id: data.id as string,
			width: data.width,
			height: data.height,
			seed: data.seed,
			num_inference_steps: data.num_inference_steps,
			guidance_scale: data.guidance_scale,
			image_id: data.image_id,
			created_at: data.created_at,
			updated_at: data.updated_at,
			prompt: data.prompt as { id: string; text: string },
			negative_prompt: (data.negative_prompt as { id: string; text: string } | null)
				? (data.negative_prompt as { id: string; text: string })
				: null,
			model: data.model as { id: TAvailableModelId; name: string },
			scheduler: data.scheduler as { id: TAvailableSchedulerId; name: string }
		};
		return { data: generation, error: null };
	}
	return { data: null, error: 'Something went wrong' };
}

interface TGenerationGPage {
	data: TDBGenerationG[] | null;
	error: PostgrestError | null;
	count?: number | null;
}
