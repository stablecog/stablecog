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
	const data: { status: 'healthy' | 'not-healthy' } = await response.json();
	return data.status;
}
