import { getJpegBufferFromComponent } from '$routes/api/og/ogBuffers';
import OGGallery from '$components/og/OGGallery.svelte';
import type { RequestHandler } from '@sveltejs/kit';
import { getGenerationG } from '$ts/queries/db/gallery';
import { urlFromImageId } from '$ts/helpers/urlFromImageId';
import sharp from 'sharp';

export const GET: RequestHandler = async ({ params, url }) => {
	const start = Date.now();
	const generationIdWithExt = params.idWithExt;
	if (!generationIdWithExt) return new Response('No generation id provided', { status: 400 });
	const generationId = generationIdWithExt.split('.')[0];
	const [generationRes, fontRegularRes, fontBoldRes, fontExtraboldRes] = await Promise.all([
		getGenerationG(generationId),
		fetch(`${url.origin}/fonts/jetbrains-mono/jetbrains-mono-400.ttf`),
		fetch(`${url.origin}/fonts/jetbrains-mono/jetbrains-mono-700.ttf`),
		fetch(`${url.origin}/fonts/jetbrains-mono/jetbrains-mono-800.ttf`)
	]);
	const [fontRegular, fontBold, fontExtrabold] = await Promise.all([
		fontRegularRes.arrayBuffer(),
		fontBoldRes.arrayBuffer(),
		fontExtraboldRes.arrayBuffer()
	]);
	const { data, error } = generationRes;
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
	const startOgJpegBuffer = Date.now();
	const ogJpegBuffer = await getJpegBufferFromComponent(
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
	const endOgJpegBuffer = Date.now();
	console.log(`---- ogJpegBuffer in: ${endOgJpegBuffer - startOgJpegBuffer}ms`);
	const end = Date.now();
	console.log(`---- Generated OG image for generation "${generationId}" in: ${end - start}ms ----`);
	return new Response(ogJpegBuffer, {
		headers: {
			'Content-Type': 'image/jpeg',
			'Cache-Control': 'public, max-age=31536000'
		}
	});
};
