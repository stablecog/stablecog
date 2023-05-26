import {
	entries,
	flatDocsSidebarShallow,
	docsSidebar,
	previewBaseUrl
} from '$routes/docs/v1/constants';
import { getEntryFromPathname, getSidebarItemFromPathname } from '$components/docs/helpers';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ url }) => {
	const entry = await getEntryFromPathname({
		flatSidebarShallow: flatDocsSidebarShallow,
		rawEntries: entries,
		previewBaseUrl: previewBaseUrl,
		pathname: url.pathname
	});
	return {
		metadata: entry.metadata,
		content: entry.default,
		sidebarItem: getSidebarItemFromPathname({ sidebarItem: docsSidebar, pathname: url.pathname })
	};
};
