import { html as toReactNode } from 'satori-html';
import satori from 'satori';
import { initWasm, Resvg } from '@resvg/resvg-wasm';
import type { SatoriOptions } from 'satori';
import type { SvelteComponent } from 'svelte';
import { canonicalUrl } from '$ts/constants/main';
import sharp from 'sharp';

await initWasm(fetch(`${canonicalUrl}/wasm/resvg.wasm`));

export async function getPngBuffer(htmlTemplate: string, optionsByUser: ImageResponseOptions) {
	const options = Object.assign({ width: 1200, height: 630, debug: !1 }, optionsByUser);
	const svg = await satori(toReactNode(htmlTemplate), {
		width: options.width,
		height: options.height,
		debug: options.debug,
		fonts: options.fonts
	});
	const pngData = new Resvg(svg, { fitTo: { mode: 'width', value: options.width } });
	const pngBuffer = pngData.render().asPng();
	return pngBuffer;
}

export async function getPngBufferFromComponent(
	component: typeof SvelteComponent,
	props = {},
	optionsByUser: ImageResponseOptions
) {
	const htmlTemplate = componentToMarkup(component, props);
	const pngBuffer = await getPngBuffer(htmlTemplate, optionsByUser);
	return pngBuffer;
}

export async function getJpegBuffer(htmlTemplate: string, optionsByUser: ImageResponseOptions) {
	const pngBuffer = await getPngBuffer(htmlTemplate, optionsByUser);
	const jpegBuffer = await sharp(pngBuffer).jpeg().toBuffer();
	return jpegBuffer;
}

export async function getJpegBufferFromComponent(
	component: typeof SvelteComponent,
	props = {},
	optionsByUser: ImageResponseOptions
) {
	const htmlTemplate = componentToMarkup(component, props);
	const jpegBuffer = await getJpegBuffer(htmlTemplate, optionsByUser);
	return jpegBuffer;
}

const componentToMarkup = (component: typeof SvelteComponent, props = {}) => {
	const SvelteRenderedMarkup = (component as any).render(props);
	let htmlTemplate = `${SvelteRenderedMarkup.html}`;
	if (SvelteRenderedMarkup && SvelteRenderedMarkup.css && SvelteRenderedMarkup.css.code) {
		htmlTemplate = `${SvelteRenderedMarkup.html}<style>${SvelteRenderedMarkup.css.code}</style>`;
	}
	return htmlTemplate;
};

type ImageResponseOptions = ConstructorParameters<typeof Response>[1] & ImageOptions;

type ImageOptions = {
	width?: number;
	height?: number;
	debug?: boolean;
	fonts: SatoriOptions['fonts'];
	graphemeImages?: Record<string, string>;
	loadAdditionalAsset?: (
		languageCode: string,
		segment: string
	) => Promise<SatoriOptions['fonts'] | string | undefined>;
};
