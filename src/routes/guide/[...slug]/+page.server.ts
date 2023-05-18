import { getGuideEntryFromPathname } from '$ts/helpers/markdown';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ url }) => {
	const { content, metadata, sidebarItem } = await getGuideEntryFromPathname(url.pathname);
	return {
		content,
		metadata,
		sidebarItem
	};
};
