import { getJpegBufferFromComponent } from '$routes/api/og/ogBuffers';
import OGGallery from '$components/og/OGGallery.svelte';
import type { RequestHandler } from '@sveltejs/kit';
import { getGenerationG } from '$ts/queries/db/gallery';
import { canonicalUrl } from '$ts/constants/main';
import { env as envPublic } from '$env/dynamic/public';
import sharp from 'sharp';

const fontWeights = [400, 700, 800];
const fontPromises = fontWeights.map((w, i) =>
	fetch(`${canonicalUrl}/fonts/jetbrains-mono/jetbrains-mono-${w}.ttf`)
		.then((r) => r.arrayBuffer())
		.then((d) => ({
			name: 'JetBrains Mono',
			data: d,
			weight: fontWeights[i]
		}))
);
const fonts = await Promise.all(fontPromises);

const width = 1200;
const height = 630;

export const GET: RequestHandler = async ({ params }) => {
	const start = Date.now();
	const generationIdWithExt = params.idWithExt;
	if (!generationIdWithExt) return new Response('No generation id provided', { status: 400 });
	const generationId = generationIdWithExt.split('.')[0];
	const generationRes = await getGenerationG(generationId);
	const { data, error } = generationRes;
	if (error) return new Response(error, { status: 500 });
	if (!data) return new Response('No generation found', { status: 404 });
	const generation = data;
	const startImageGetAndJpeg = Date.now();
	const webpArrayBuffer = await fetch(
		`${envPublic.PUBLIC_R2_URL}/${generation.image_id}.webp`
	).then((r) => r.arrayBuffer());
	const webpBuffer = Buffer.from(webpArrayBuffer);
	const jpegBuffer = await sharp(webpBuffer).jpeg().toBuffer();
	const imageUri = `data:image/jpeg;base64,${jpegBuffer.toString('base64')}`;
	const endImageGetAndJpeg = Date.now();
	console.log(`---- OG -- WebP GET and to JPEG in: ${endImageGetAndJpeg - startImageGetAndJpeg}ms`);
	const startOgJpegBuffer = Date.now();
	const ogJpegBuffer = await getJpegBufferFromComponent(
		OGGallery,
		{ generation, width, height, imageUri },
		{
			width,
			height,
			// @ts-ignore
			fonts
		}
	);
	const endOgJpegBuffer = Date.now();
	console.log(
		`---- OG -- Converted component to JPEG buffer in: ${endOgJpegBuffer - startOgJpegBuffer}ms`
	);
	const end = Date.now();
	console.log(
		`---- OG -- Generated image for generation "${generationId}" in: ${end - start}ms ----`
	);
	return new Response(ogJpegBuffer, {
		headers: {
			'Content-Type': 'image/jpeg',
			'Cache-Control': 'public, max-age=31536000'
		}
	});
};
