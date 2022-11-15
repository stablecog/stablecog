import { componentToImageResponse } from '@ethercorps/sveltekit-og';
import OGGallery from '$components/og/OGGallery.svelte';
import type { RequestHandler } from '@sveltejs/kit';
import { getGenerationG } from '$ts/queries/db/gallery';
import { canonicalUrl } from '$ts/constants/main';
import { urlFromImageId } from '$ts/helpers/urlFromImageId';
import sharp from 'sharp';

const [fontRegularRes, fontBoldRes, fontExtraboldRes] = await Promise.all([
	fetch(`${canonicalUrl}/fonts/jetbrains-mono/jetbrains-mono-400.ttf`),
	fetch(`${canonicalUrl}/fonts/jetbrains-mono/jetbrains-mono-700.ttf`),
	fetch(`${canonicalUrl}/fonts/jetbrains-mono/jetbrains-mono-800.ttf`)
]);
const [fontRegular, fontBold, fontExtrabold] = await Promise.all([
	fontRegularRes.arrayBuffer(),
	fontBoldRes.arrayBuffer(),
	fontExtraboldRes.arrayBuffer()
]);

export const GET: RequestHandler = async ({ url }) => {
	const start = Date.now();
	const generationIdWithExt = url.searchParams.get('generation');
	if (!generationIdWithExt) return new Response('No generation id provided', { status: 400 });
	const generationId = generationIdWithExt.split('.')[0];
	const { data, error } = await getGenerationG(generationId);
	if (error) return new Response(error, { status: 500 });
	if (!data) return new Response('No generation found', { status: 404 });
	const generation = data;
	const width = 1200;
	const height = 630;
	const webpUrl = urlFromImageId(generation.image_id);
	const webpRes = await fetch(webpUrl);
	const webpArrayBuffer = await webpRes.arrayBuffer();
	const webpBuffer = Buffer.from(webpArrayBuffer);
	const jpgBuffer = await sharp(webpBuffer).jpeg().toBuffer();
	const imgBase64 = jpgBuffer.toString('base64');
	const imgUrl = `data:image/jpeg;base64,${imgBase64}`;
	const og = new componentToImageResponse(
		OGGallery,
		{ generation, width, height, imgUrl },
		{
			width: width,
			height: height,
			fonts: [
				{
					name: 'JetBrains Mono',
					data: fontRegular,
					weight: 400
				},
				{
					name: 'JetBrains Mono',
					data: fontBold,
					weight: 700
				},
				{
					name: 'JetBrains Mono',
					data: fontExtrabold,
					weight: 800
				}
			]
		}
	);
	const res = og as Response;
	const end = Date.now();
	console.log(`Generated OG image for generation "${generationId}" in: ${end - start}ms`);
	return res;
};
