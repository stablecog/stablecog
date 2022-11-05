import { getGalleryPage } from '$ts/queries/db/gallery';
import type { TGalleryResponse } from '$ts/types/main';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page') ?? '1');
	const res = await getGalleryPage(page);
	const resAsGalleryResponse = res as TGalleryResponse;
	const resAsError = res as { status: number; error: string };
	if (resAsError.error) {
		return new Response(resAsError.error, { status: resAsError.status });
	}
	const randomSortedGenerations = resAsGalleryResponse.generations.sort(() => Math.random() - 0.5);
	const response: TGalleryResponse = {
		generations: randomSortedGenerations,
		page: resAsGalleryResponse.page,
		next: resAsGalleryResponse.next
	};
	return new Response(JSON.stringify(response), {
		headers: { 'Content-Type': 'application/json' }
	});
};
