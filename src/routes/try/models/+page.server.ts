import { trySidebar } from '$routes/try/constants';
import { getTryEntryFromPathname } from '$ts/helpers/markdown';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const { content, metadata } = await getTryEntryFromPathname(url.pathname);
	return {
		content,
		metadata,
		sidebarItem: trySidebar
	};
};
