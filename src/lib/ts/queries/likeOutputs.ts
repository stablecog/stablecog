import { apiUrl } from '$ts/constants/main';

export async function likeOutputs({
	action,
	access_token,
	output_ids,
	abortController
}: {
	action: 'like' | 'unlike';
	access_token: string;
	output_ids: string[];
	abortController: AbortController;
}) {
	const res = await fetch(`${apiUrl.origin}/v1/user/like`, {
		method: 'POST',
		signal: abortController.signal,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`
		},
		body: JSON.stringify({
			generation_output_ids: output_ids,
			action
		})
	});
	if (!res.ok) throw new Error('Response not ok');
	const data = await res.json();
	return data;
}
