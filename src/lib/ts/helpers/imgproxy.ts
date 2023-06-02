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
	| 'full';

type TExtention = 'jpeg' | 'webp' | 'png';

const srcsetEntries: TImgProxyPreset[] = [
	'128w',
	'256w',
	'512w',
	'768w',
	'1024w',
	'1536w',
	'1920w',
	'2560w'
];
const srcDefault: TImgProxyPreset = '1920w';
const extentionDefault: TExtention = 'webp';

export function getImgProxySrc({
	src,
	preset,
	extention = extentionDefault
}: {
	src: string;
	preset: TImgProxyPreset;
	extention?: TExtention;
}) {
	return `${PUBLIC_IMGPROXY_URL}/insecure/${preset}/${Base64.encodeURL(src)}.${extention}`;
}

export function getImgProxySrcFull({
	src,
	extention = extentionDefault
}: {
	src: string;
	extention?: TExtention;
}) {
	return getImgProxySrc({ src, preset: 'full', extention });
}

export function getImgProxySrcSet({
	src,
	extention = extentionDefault
}: {
	src: string;
	extention?: TExtention;
}) {
	let srcset = '';
	for (let i = 0; i < srcsetEntries.length; i++) {
		srcset += `${getImgProxySrc({ src, preset: srcsetEntries[i], extention })} ${
			srcsetEntries[i]
		},`;
	}
	return srcset.slice(0, -1);
}

export function getImgProxySrcDefault(src: string) {
	return getImgProxySrc({ src, preset: srcDefault, extention: extentionDefault });
}
