import { PUBLIC_IMGPROXY_URL } from '$env/static/public';
import { Base64 } from 'js-base64';

type TImgProxyPreset =
	| '32w'
	| '64w'
	| '128w'
	| '256w'
	| '512w'
	| '768w'
	| '1024w'
	| '1536w'
	| '1920w'
	| '2560w'
	| '3840w'
	| 'full';

export type TImgProxyQuality = 'q50' | 'q60' | 'q70';

export const imageQualityLowDefault: TImgProxyQuality = 'q70';

type TExtension = 'jpeg' | 'webp' | 'png';

const srcsetEntriesSmall: TImgProxyPreset[] = ['32w', '64w', '128w', '256w'];
const srcsetEntries: TImgProxyPreset[] = [
	'128w',
	'256w',
	'512w',
	'768w',
	'1024w',
	'1536w',
	'1920w',
	'2560w',
	'3840w'
];
const srcDefault: TImgProxyPreset = '1920w';
const extensionDefault: TExtension = 'webp';

export function getImgProxySrc({
	src,
	preset,
	extension = extensionDefault,
	quality
}: {
	src: string;
	preset: TImgProxyPreset;
	extension?: TExtension;
	quality?: TImgProxyQuality;
}) {
	let presets: string[] = [preset];
	if (quality !== undefined) {
		presets.push(quality);
	}
	return `${PUBLIC_IMGPROXY_URL}/insecure/${presets.join(':')}/${Base64.encodeURL(src)}.${extension}`;
}

export function getImgProxySrcFull({
	src,
	extension = extensionDefault,
	quality
}: {
	src: string;
	extension?: TExtension;
	quality?: TImgProxyQuality;
}) {
	return getImgProxySrc({ src, preset: 'full', extension, quality });
}

export function getImgProxySrcSet({
	src,
	extension = extensionDefault,
	quality
}: {
	src: string;
	extension?: TExtension;
	quality?: TImgProxyQuality;
}) {
	let srcset = '';
	for (let i = 0; i < srcsetEntries.length; i++) {
		srcset += `${getImgProxySrc({ src, preset: srcsetEntries[i], extension, quality })} ${
			srcsetEntries[i]
		},`;
	}
	return srcset.slice(0, -1);
}

export function getImgProxySrcSetSmall({
	src,
	extension = extensionDefault,
	quality
}: {
	src: string;
	extension?: TExtension;
	quality?: TImgProxyQuality;
}) {
	let srcset = '';
	for (let i = 0; i < srcsetEntriesSmall.length; i++) {
		srcset += `${getImgProxySrc({ src, preset: srcsetEntries[i], extension, quality })} ${
			srcsetEntries[i]
		},`;
	}
	return srcset.slice(0, -1);
}

export function getImgProxySrcDefault(src: string) {
	return getImgProxySrc({ src, preset: srcDefault, extension: extensionDefault });
}
