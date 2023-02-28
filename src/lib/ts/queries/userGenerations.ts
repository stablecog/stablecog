import { apiUrl } from '$ts/constants/main';
import type { TGenerationFullOutput } from '$userStores/generation';

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
	const url = `${apiUrl.origin}/v1/user/outputs?${query.toString()}`;
	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + access_token
		}
	});
	const data: TUserGenerationFullOutputsPage = await res.json();
	return data;
}

export async function getAllUserGenerationFullOutputs({
	cursor,
	access_token,
	gallery_status,
	order_by
}: {
	cursor?: string;
	gallery_status?: string;
	access_token: string;
	order_by?: string;
}) {
	console.log('getAllUserOutputs');
	const query = new URLSearchParams();
	query.append('per_page', perPage.toString());
	if (cursor) {
		query.append('cursor', cursor);
	}
	if (gallery_status) {
		query.append('gallery_status', gallery_status);
	}
	if (order_by) {
		query.append('order_by', order_by);
	}
	const url = `${apiUrl.origin}/v1/admin/outputs?${query.toString()}`;
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
