import type { TGenerationLogObject } from '$routes/api/generate/types';
import { modelIdToModelNameCog, schedulerIdToSchedulerNameCog } from '$ts/constants/main';

export function getIsNSFW(imageDataB64: string) {
	if (!imageDataB64) {
		return false;
	}
	const pngStart = 'data:image/png;base64,';
	const blackStringPng = Array.from({ length: 200 }, () => 'A').join('');
	const jpegStart = 'data:image/jpeg;base64,';
	const blackStringJpeg = Array.from({ length: 30 }, () => 'iiigAooooAKKKKAC').join('');
	return (
		(imageDataB64.startsWith(jpegStart) && imageDataB64.includes(blackStringJpeg)) ||
		(imageDataB64.startsWith(pngStart) && imageDataB64.includes(blackStringPng))
	);
}

export function generationLog({
	text,
	logObject
}: {
	text: string;
	logObject: TGenerationLogObject;
}) {
	console.log(
		'----',
		text,
		'--',
		`"${logObject.prompt}"`,
		`--${logObject.negative_prompt ? ` "${logObject.negative_prompt}" --` : ''}`,
		`${modelIdToModelNameCog[logObject.model_id]}`,
		'--',
		`${schedulerIdToSchedulerNameCog[logObject.scheduler_id]}`,
		'--',
		logObject.width,
		'--',
		logObject.height,
		'--',
		logObject.guidance_scale,
		'--',
		logObject.num_inference_steps,
		'--',
		logObject.seed,
		'--',
		logObject.server_url,
		'----'
	);
}
