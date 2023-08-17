import { apiUrl } from '$ts/constants/main';

export async function getOtherUserMetadata({
	username,
	custom_fetch
}: {
	username: string;
	custom_fetch?: typeof fetch;
}): Promise<TOtherUserMetadata> {
	const url = `${apiUrl.origin}/v1/profile/${username}/metadata`;
	const f = custom_fetch || fetch;
	const res = await f(url, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) throw new Error(`Failed to fetch other user metadata`);
	const resJson: TOtherUserMetadata = await res.json();
	return resJson;
}

export interface TOtherUserMetadata {
	created_at: string;
	active_product_id?: string;
	username: string;
}
