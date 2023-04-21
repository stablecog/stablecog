import { trySidebar } from '$routes/try/constants';
import { getTryEntryFromPathname } from '$ts/helpers/markdown';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	const { content, metadata } = await getTryEntryFromPathname(url.pathname);
	return {
		content,
		metadata,
		sidebarItem: trySidebar
	};
};
