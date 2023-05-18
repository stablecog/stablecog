import { guideSidebar } from '$routes/guide/constants';
import { getGuideEntryFromPathname } from '$ts/helpers/markdown';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const { content, metadata } = await getGuideEntryFromPathname(url.pathname);
	return {
		content,
		metadata,
		sidebarItem: guideSidebar
	};
};
