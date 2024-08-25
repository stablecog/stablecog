import { getApiUrl } from '$ts/constants/main';

export async function favoriteOutputs({
	action,
	access_token,
	output_ids
}: {
	action: 'add' | 'remove';
	access_token: string;
	output_ids: string[];
}) {
	const res = await fetch(`${getApiUrl().origin}/v1/user/outputs/favorite`, {
		method: 'POST',
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
