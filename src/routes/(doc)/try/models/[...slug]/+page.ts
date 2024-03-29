import {
	entries,
	flatTrySidebarShallow,
	trySidebar,
	previewBaseUrl
} from '$docroutes/try/constants';
import { getEntryFromPathname, getSidebarItemFromPathname } from '$components/docs/helpers';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ url }) => {
	const entry = await getEntryFromPathname({
		flatSidebarShallow: flatTrySidebarShallow,
		rawEntries: entries,
		previewBaseUrl: previewBaseUrl,
		pathname: url.pathname
	});
	const { sidebarItem, parentItem } = getSidebarItemFromPathname({
		sidebarItem: trySidebar,
		pathname: url.pathname
	});
	return {
		metadata: entry.metadata,
		content: entry.default,
		sidebarItem,
		parentItem
	};
};
