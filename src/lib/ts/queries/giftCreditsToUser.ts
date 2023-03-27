import { apiUrl } from '$ts/constants/main';

export async function giftCreditsToUser({
	access_token,
	user_id,
	credit_type_id
}: {
	access_token?: string;
	user_id: string;
	credit_type_id: string;
}) {
	console.log('giftCreditsToUser');
	const url = `${apiUrl.origin}/v1/admin/credit/add`;
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`
		},
		body: JSON.stringify({
			user_id,
			credit_type_id
		})
	});
	if (!res.ok) throw new Error('getCreditOptions returned a non-200 response');
	const resJson: { added: boolean } = await res.json();
	return resJson;
}
