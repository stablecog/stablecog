import { env } from '$env/dynamic/public';
import type { RequestHandler } from '@sveltejs/kit';
import sharp from 'sharp';

export const GET: RequestHandler = async ({ params }) => {
	const start = Date.now();
	const [id, ext] = params.image_id_with_ext?.split('.') ?? [undefined, undefined];
	if (!id || !ext) return new Response('Not found', { status: 404 });
	try {
		const res = await fetch(`${env.PUBLIC_R2_URL}/${id}.webp`);
		const arrayBuffer = await res.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const resBuffer =
			ext === 'png' ? await sharp(buffer).png().toBuffer() : await sharp(buffer).jpeg().toBuffer();
		const end = Date.now();
		console.log(
			`---- Generation image for "${id}" converted to ${ext === 'png' ? 'PNG' : 'JPEG'} in: ${
				end - start
			}ms ----`
		);
		return new Response(resBuffer, {
			headers: {
				'Content-Type': `image/${ext === 'png' ? 'png' : 'jpeg'}`,
				'Cache-Control': 'public, immutable, no-transform, max-age=31536000'
			}
		});
	} catch (error) {
		return new Response(error as string, { status: 404 });
	}
};
