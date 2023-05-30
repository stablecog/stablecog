import { apiUrl } from '$ts/constants/main';

export async function setWantsEmail({
	wants_email,
	access_token
}: {
	wants_email: boolean;
	access_token: string;
}) {
	const res = await fetch(`${apiUrl.origin}/v1/user/email`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`
		},
		body: JSON.stringify({
			wants_email
		})
	});
	if (!res.ok) throw new Error('Response not ok');
	const data = await res.json();
	return data;
}
