import type { TGalleryResponse } from '$routes/api/gallery/server';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ request }) => {
	const res = await fetch('http://localhost:5173/api/gallery');
	const resJson: TGalleryResponse[] = await res.json();
	return { generations: resJson, page: 1 };
};
