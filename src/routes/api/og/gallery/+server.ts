import { componentToImageResponse } from '@ethercorps/sveltekit-og';
import OGGallery from '$components/og/OGGallery.svelte';
import type { RequestHandler } from '@sveltejs/kit';
import { getGenerationG } from '$ts/queries/db/gallery';

export const GET: RequestHandler = async ({ url }) => {
	const originUrl = url.origin;
	const [fontRegularRes, fontBoldRes, fontExtraboldRes] = await Promise.all([
		fetch(`${originUrl}/fonts/jetbrains-mono/jetbrains-mono-400.ttf`),
		fetch(`${originUrl}/fonts/jetbrains-mono/jetbrains-mono-700.ttf`),
		fetch(`${originUrl}/fonts/jetbrains-mono/jetbrains-mono-800.ttf`)
	]);
	const [fontRegular, fontBold, fontExtrabold] = await Promise.all([
		fontRegularRes.arrayBuffer(),
		fontBoldRes.arrayBuffer(),
		fontExtraboldRes.arrayBuffer()
	]);

	const generationIdWithExt = url.searchParams.get('generation');
	if (!generationIdWithExt) return new Response('No generation id provided', { status: 400 });
	const generationId = generationIdWithExt.split('.')[0];
	const { data, error } = await getGenerationG(generationId);
	if (error) return new Response(error, { status: 500 });
	if (!data) return new Response('No generation found', { status: 404 });
	const generation = data;
	const width = 1200;
	const height = 630;
	const og = new componentToImageResponse(
		OGGallery,
		{ generation, width, height, originUrl },
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
	return res;
};
