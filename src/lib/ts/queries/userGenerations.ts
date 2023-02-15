import { apiUrl } from '$ts/constants/main';
import type { TGenerationFullOutput } from '$ts/stores/generation';

const perPage = 50;
export async function getUserGenerationFullOutputs({
	cursor,
	access_token
}: {
	cursor?: string;
	access_token: string;
}) {
	console.log('getUserOutputs');
	const query = new URLSearchParams();
	query.append('per_page', perPage.toString());
	if (cursor) {
		query.append('cursor', cursor);
	}
	const url = `${apiUrl.href}v1/user/outputs?${query.toString()}`;
	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + access_token
		}
	});
	const data: TUserGenerationFullOutputsPage = await res.json();
	console.log(data);
	return data;
}

export interface TUserGenerationFullOutputsPage {
	outputs: TGenerationFullOutput[];
	total_count?: number;
	next?: string;
}
