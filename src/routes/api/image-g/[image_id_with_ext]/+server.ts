import { env } from '$env/dynamic/public';
import type { RequestHandler } from '@sveltejs/kit';
import sharp from 'sharp';

export const GET: RequestHandler = async ({ params }) => {
	const id = params.image_id_with_ext?.split('.')[0];
	const ext = params.image_id_with_ext?.split('.')[1];
	const res = await fetch(`${env.PUBLIC_R2_URL}/${id}.webp`);
	const arrayBuffer = await res.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const resBuffer =
		ext === 'png' ? await sharp(buffer).png().toBuffer() : await sharp(buffer).jpeg().toBuffer();
	return new Response(resBuffer, {
		headers: {
			'Content-Type': `image/${ext === 'png' ? 'png' : 'jpeg'}`,
			'Cache-Control': 'public, immutable, no-transform, max-age=31536000'
		}
	});
};
