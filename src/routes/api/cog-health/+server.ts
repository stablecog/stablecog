import { getDeviceInfo } from '$ts/helpers/getDeviceInfo';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { server_url }: { server_url: string } = await request.json();
	const { headers } = request;
	const userAgent = headers.get('user-agent');
	const deviceInfo = getDeviceInfo(userAgent);
	const countryCode = headers.get('cf-ipcountry');
	console.log('Request made to old endpoint (/cog-health):', deviceInfo, countryCode);
	const res = await fetch('/api/health', {
		method: 'POST',
		body: JSON.stringify({ server_url }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	return res;
};
