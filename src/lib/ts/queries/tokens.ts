import { apiUrl } from '$ts/constants/main';

export async function getUserTokens({ access_token }: { access_token: string }) {
	const res = await fetch(`${apiUrl.origin}/v1/user/tokens`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`
		}
	});
	if (!res.ok) throw new Error('Response not ok');
	const data: TGetTokensRes = await res.json();
	return data.tokens;
}

export async function createUserToken({
	access_token,
	name
}: {
	access_token: string;
	name?: string;
}) {
	const res = await fetch(`${apiUrl.origin}/v1/user/tokens`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`
		},
		body: JSON.stringify({ name })
	});
	if (!res.ok) throw new Error('Response not ok');
	const data: TCreateTokenRes = await res.json();
	return data;
}

export async function deleteUserToken({ access_token, id }: { access_token: string; id: string }) {
	const res = await fetch(`${apiUrl.origin}/v1/user/tokens`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`
		},
		body: JSON.stringify({ id })
	});
	if (!res.ok) throw new Error('Response not ok');
	const data = await res.json();
	return data;
}

interface TGetTokensRes {
	tokens: TTokenRes[];
}

interface TTokenRes {
	id: string;
	name: string;
	short_string: string;
	created_at: string;
	uses: number;
	is_active: boolean;
	last_used_at?: string;
}

interface TCreateTokenRes {
	id: string;
	token: string;
}
