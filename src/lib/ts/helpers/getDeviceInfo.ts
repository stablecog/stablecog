import UAParser from 'ua-parser-js';

const parser = new UAParser();

export function getDeviceInfo(ua: string | null) {
	if (!ua) {
		return {
			type: null,
			browser: null,
			os: null
		};
	}
	parser.setUA(ua);
	const res = parser.getResult();
	return {
		type: res.device.type ?? 'desktop',
		browser: res.browser.name,
		os: res.os.name
	};
}
