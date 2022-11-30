import type { TUpscaleLogObject } from '$routes/api/upscale/types';

export function upscaleLog({ text, logObject }: { text: string; logObject: TUpscaleLogObject }) {
	console.log(
		'----',
		text,
		'--',
		`"${logObject.type}"`,
		'--',
		logObject.scale,
		'--',
		logObject.server_url,
		'----'
	);
}
