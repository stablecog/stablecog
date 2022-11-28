import {
	availableModelIds,
	availableSchedulerIds,
	guidanceScaleMax,
	guidanceScaleMin,
	heightTabs,
	inferenceStepsDefault,
	inferenceStepsTabs,
	maxPromptLength,
	maxSeed,
	widthTabs,
	type TAvailableHeight,
	type TAvailableInferenceSteps,
	type TAvailableModelId,
	type TAvailableSchedulerId,
	type TAvailableWidth
} from '$ts/constants/main';
import type { ServerLoad } from '@sveltejs/kit';

export const prerender = false;
export const load: ServerLoad = ({ url }) => {
	const _prompt = url.searchParams.get('p');
	const _negative_prompt = url.searchParams.get('np');
	const _seed = url.searchParams.get('s');
	const _width = url.searchParams.get('w');
	const _height = url.searchParams.get('h');
	const _guidance_scale = url.searchParams.get('gs');
	const _num_inference_steps = url.searchParams.get('is');
	const _model_id = url.searchParams.get('mi');
	const _scheduler_id = url.searchParams.get('si');

	const prompt = _prompt !== null ? decodeURIComponent(_prompt.slice(0, maxPromptLength)) : null;
	const negative_prompt =
		_negative_prompt !== null
			? decodeURIComponent(_negative_prompt.slice(0, maxPromptLength))
			: null;
	const _seed_number = _seed !== null ? parseInt(_seed) : null;
	const seed =
		_seed_number !== null && _seed_number >= 0 && _seed_number <= maxSeed ? _seed_number : null;
	const _guidance_scale_number = _guidance_scale !== null ? parseInt(_guidance_scale) : null;
	const guidance_scale =
		_guidance_scale_number !== null &&
		_guidance_scale_number >= guidanceScaleMin &&
		_guidance_scale_number <= guidanceScaleMax
			? _guidance_scale_number
			: null;
	const num_inference_steps =
		_num_inference_steps !== null
			? inferenceStepsTabs
					.map((i) => i.value)
					.includes(_num_inference_steps as TAvailableInferenceSteps)
				? (_num_inference_steps as TAvailableInferenceSteps)
				: _num_inference_steps >
				  inferenceStepsTabs.map((i) => i.value)[inferenceStepsTabs.length - 1]
				? inferenceStepsTabs.map((i) => i.value)[inferenceStepsTabs.length - 1]
				: inferenceStepsDefault
			: null;
	const width =
		_width !== null && widthTabs.map((i) => i.value).includes(_width as TAvailableWidth)
			? (_width as TAvailableWidth)
			: null;
	const height =
		_height !== null && heightTabs.map((i) => i.value).includes(_height as TAvailableHeight)
			? (_height as TAvailableHeight)
			: null;
	const model_id =
		_model_id !== null && availableModelIds.includes(_model_id as TAvailableModelId)
			? (_model_id as TAvailableModelId)
			: null;
	const scheduler_id =
		_scheduler_id !== null && availableSchedulerIds.includes(_scheduler_id as TAvailableSchedulerId)
			? (_scheduler_id as TAvailableSchedulerId)
			: null;
	const data: THomePageData = {
		prompt,
		negative_prompt,
		model_id,
		scheduler_id,
		seed,
		guidance_scale,
		num_inference_steps,
		width,
		height
	};
	return data;
};

export interface THomePageData {
	prompt: string | null;
	negative_prompt: string | null;
	model_id: TAvailableModelId | null;
	scheduler_id: TAvailableSchedulerId | null;
	seed: number | null;
	guidance_scale: number | null;
	num_inference_steps: TAvailableInferenceSteps | null;
	width: TAvailableWidth | null;
	height: TAvailableHeight | null;
}
