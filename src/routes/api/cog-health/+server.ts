import { getDeviceInfo } from '$ts/helpers/getDeviceInfo';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { headers } = request;
	const userAgent = headers.get('user-agent');
	const deviceInfo = getDeviceInfo(userAgent);
	const countryCode = headers.get('cf-ipcountry');
	console.log('deviceInfo', deviceInfo, countryCode);
	return new Response(
		JSON.stringify({
			error:
				'Please hard refresh the page to get rid of this error and to update to the new version of the app.'
		})
	);
};
