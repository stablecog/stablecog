import {
	availableGenerationModelIds,
	type TAvailableGenerationModelId
} from '$ts/constants/generationModels';
import {
	aspectRatioTabs,
	heightTabs,
	widthTabs,
	type TAvailableAspectRatio,
	type TAvailableHeight,
	type TAvailableWidth
} from '$ts/constants/generationSize';
import {
	guidanceScaleMax,
	guidanceScaleMin,
	initImageStrengthMax,
	initImageStrengthMin,
	maxPromptLength,
	maxSeed,
	numOutputsMax,
	numOutputsMin
} from '$ts/constants/main';
import { availableSchedulerIds, type TAvailableSchedulerId } from '$ts/constants/schedulers';

export const load = ({ url }) => {
	const _prompt = url.searchParams.get('p');
	const _negative_prompt = url.searchParams.get('np');
	const _seed = url.searchParams.get('s');
	const _width = url.searchParams.get('w');
	const _height = url.searchParams.get('h');
	const _aspect_ratio = url.searchParams.get('ar');
	const _guidance_scale = url.searchParams.get('gs');
	const _model_id = url.searchParams.get('mi');
	const _scheduler_id = url.searchParams.get('si');
	const _advanced_mode = url.searchParams.get('adv');
	const _init_image_strength = url.searchParams.get('iis');
	const _num_outputs = url.searchParams.get('no');
	const _is_sign_in_modal_open = url.searchParams.get('smo');

	const prompt = _prompt !== null ? decodeURIComponent(_prompt.slice(0, maxPromptLength)) : null;
	const negative_prompt =
		_negative_prompt !== null
			? decodeURIComponent(_negative_prompt.slice(0, maxPromptLength))
			: null;
	const _seed_number = _seed !== null ? parseInt(_seed) : null;
	const seed =
		_seed_number !== null && _seed_number >= 0 && _seed_number <= maxSeed ? _seed_number : null;
	const _guidance_scale_number = _guidance_scale !== null ? parseInt(_guidance_scale) : null;
	let guidance_scale =
		_guidance_scale_number !== null &&
		_guidance_scale_number >= guidanceScaleMin &&
		_guidance_scale_number <= guidanceScaleMax
			? _guidance_scale_number
			: null;
	const width =
		_width !== null && widthTabs.map((i) => i.value).includes(_width as TAvailableWidth)
			? (_width as TAvailableWidth)
			: null;
	const height =
		_height !== null && heightTabs.map((i) => i.value).includes(_height as TAvailableHeight)
			? (_height as TAvailableHeight)
			: null;
	const aspect_ratio =
		_aspect_ratio !== null &&
		aspectRatioTabs.map((i) => i.value).includes(_aspect_ratio as TAvailableAspectRatio)
			? (_aspect_ratio as TAvailableAspectRatio)
			: null;
	const model_id =
		_model_id !== null &&
		availableGenerationModelIds.includes(_model_id as TAvailableGenerationModelId)
			? (_model_id as TAvailableGenerationModelId)
			: null;
	const scheduler_id =
		_scheduler_id !== null && availableSchedulerIds.includes(_scheduler_id as TAvailableSchedulerId)
			? (_scheduler_id as TAvailableSchedulerId)
			: null;
	const advanced_mode =
		_advanced_mode !== null
			? _advanced_mode === 'true'
				? true
				: _advanced_mode === 'false'
					? false
					: null
			: null;
	const init_image_strength_float =
		_init_image_strength !== null ? parseFloat(_init_image_strength) : null;
	const init_image_strength =
		init_image_strength_float !== null &&
		init_image_strength_float >= initImageStrengthMin &&
		init_image_strength_float <= initImageStrengthMax
			? init_image_strength_float
			: null;
	const num_outputs_int = _num_outputs !== null ? parseInt(_num_outputs) : null;
	const num_outputs =
		num_outputs_int !== null && num_outputs_int >= numOutputsMin && num_outputs_int <= numOutputsMax
			? num_outputs_int
			: null;
	const is_sign_in_modal_open =
		_is_sign_in_modal_open !== null ? _is_sign_in_modal_open === 'true' : null;

	const data: TGeneratePageData = {
		prompt,
		negative_prompt,
		model_id,
		scheduler_id,
		seed,
		guidance_scale,
		width,
		height,
		aspect_ratio,
		advanced_mode,
		init_image_strength,
		num_outputs,
		is_sign_in_modal_open
	};

	return data;
};

export interface TGeneratePageData {
	prompt: string | null;
	negative_prompt: string | null;
	model_id: TAvailableGenerationModelId | null;
	scheduler_id: TAvailableSchedulerId | null;
	seed: number | null;
	guidance_scale: number | null;
	width: TAvailableWidth | null;
	height: TAvailableHeight | null;
	aspect_ratio: TAvailableAspectRatio | null;
	advanced_mode: boolean | null;
	init_image_strength: number | null;
	num_outputs: number | null;
	is_sign_in_modal_open: boolean | null;
}
