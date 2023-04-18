import { getGuideEntryFromPathname } from '$ts/queries/guide/guide';
import type { PageLoad } from '../$types';

export const load: PageLoad = async ({ url }) => {
	const { content, metadata, sidebarItem } = await getGuideEntryFromPathname(url.pathname);
	return {
		content,
		metadata,
		sidebarItem
	};
};
