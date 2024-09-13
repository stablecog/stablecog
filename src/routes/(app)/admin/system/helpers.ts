import { getApiUrl } from '$ts/constants/main';

export const systemStatusQueryKey = ['system-status'];

export async function getSystemBackends(accessToken: string) {
	const res = await fetch(`${getApiUrl().origin}/v1/admin/system/status`, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
	if (!res.ok) {
		throw new Error('Failed to fetch system status');
	}
	const resJson: { backend: string; backends: string[] } = await res.json();
	if (!resJson.backends) {
		throw new Error('No backends key found in system status response');
	}
	return resJson;
}
