import { getApiUrl } from '$ts/constants/main';

export async function uploadImage({
	access_token,
	formData
}: {
	access_token: string;
	formData: FormData;
}): Promise<string> {
	const res = await fetch(`${getApiUrl().origin}/upload`, {
		method: 'POST',
		body: formData,
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});
	if (!res.ok) throw new Error('Upload failed');
	const resJson = await res.json();
	if (!resJson.object) throw new Error('Upload failed, no object');
	return resJson.object;
}
