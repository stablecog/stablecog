import { getApiUrl } from '$ts/constants/main';

export async function getCreditOptions({ access_token }: { access_token?: string }) {
	console.log('getCreditOptions');
	const url = `${getApiUrl().origin}/v1/admin/credit/types`;
	const res = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`
		}
	});
	if (!res.ok) throw new Error('getCreditOptions returned a non-200 response');
	const resJson: TCreditOption[] = await res.json();
	return resJson;
}

export interface TCreditOption {
	id: string;
	name: string;
	description: string;
	amount: number;
}
