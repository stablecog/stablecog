import {
	flatGuideSidebarShallow,
	entries,
	guideSidebar,
	previewBaseUrl
} from '$routes/guide/constants';
import { getEntryFromPathname, getSidebarItemFromPathname } from '$components/docs/helpers';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ url }) => {
	const entry = await getEntryFromPathname({
		flatSidebarShallow: flatGuideSidebarShallow,
		rawEntries: entries,
		previewBaseUrl: previewBaseUrl,
		pathname: url.pathname
	});
	return {
		metadata: entry.metadata,
		content: entry.default,
		sidebarItem: getSidebarItemFromPathname({ sidebarItem: guideSidebar, pathname: url.pathname })
	};
};
