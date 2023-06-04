import {
	entries,
	flatDocsSidebarShallow,
	docsSidebar,
	previewBaseUrl
} from '$docroutes/docs/v1/constants';
import { getEntryFromPathname, getSidebarItemFromPathname } from '$components/docs/helpers';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ url }) => {
	const { sidebarItem, parentItem } = getSidebarItemFromPathname({
		sidebarItem: docsSidebar,
		pathname: url.pathname
	});
	const entry = await getEntryFromPathname({
		flatSidebarShallow: flatDocsSidebarShallow,
		rawEntries: entries,
		previewBaseUrl: previewBaseUrl,
		pathname: url.pathname,
		previewImageUrl: sidebarItem?.preview_image_url
	});
	return {
		metadata: entry.metadata,
		content: entry.default,
		sidebarItem,
		parentItem
	};
};
