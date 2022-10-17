import type { TServerHealthRes } from '$ts/types/main';

export async function checkServerHealth(server_url: string) {
	const response = await fetch(`/api/server-health`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			server_url
		})
	});
	const data: TServerHealthRes = await response.json();
	return data;
}
