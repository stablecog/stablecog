import type { TUpscaleRequest, TUpscaleResponse } from '$ts/types/main';

export async function upscaleImage({ imageDataB64, scale, server_url, version }: TUpscaleRequest) {
	const response = await fetch(`/api/upscale`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			imageDataB64,
			scale,
			version,
			server_url
		})
	});
	const resJSON: TUpscaleResponse = await response.json();
	return resJSON;
}
