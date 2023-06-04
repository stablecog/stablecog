import type {
	TGuideEntry,
	TGuideEntryExtended,
	TSidebarItem,
	TSidebarItemBase
} from '$docroutes/guide/types';

export function getEntryImportKey(pathname: string | undefined) {
	return `/src/lib/md${pathname}.md`;
}

export function getEntries(entries: Record<string, () => Promise<unknown>>) {
	const editedEntries: Record<string, () => Promise<unknown>> = {};
	for (const key of Object.keys(entries)) {
		const newKey = key.endsWith('/index.md') ? key.replace('/index.md', '.md') : key;
		editedEntries[newKey] = entries[key];
	}
	return editedEntries;
}

export function getPreviewUrlFromEntryPathname({
	previewBaseUrl,
	pathname
}: {
	previewBaseUrl: string;
	pathname: string;
}) {
	const parts = pathname.split('/');
	let lastPart = parts[parts.length - 1];
	return `${previewBaseUrl}/${lastPart}.jpg`;
}

export function addImageUrlToSidebarItem({
	sidebarItem,
	previewBaseUrl
}: {
	sidebarItem: TSidebarItemBase;
	previewBaseUrl: string;
}): TSidebarItem {
	let obj: TSidebarItem = {
		pathname: sidebarItem.pathname,
		title: sidebarItem.title,
		preview_image_url: !sidebarItem.noPreview
			? sidebarItem.preview_image_url !== undefined
				? sidebarItem.preview_image_url
				: getPreviewUrlFromEntryPathname({
						previewBaseUrl,
						pathname: sidebarItem.pathname
				  })
			: undefined
	};
	if (sidebarItem.children) {
		obj = {
			...obj,
			children: sidebarItem.children.map((child) =>
				addImageUrlToSidebarItem({ sidebarItem: child, previewBaseUrl })
			)
		};
	}
	return obj;
}

export async function getEntryFromPathname({
	pathname,
	rawEntries,
	flatSidebarShallow,
	previewBaseUrl,
	previewImageUrl
}: {
	pathname: string;
	rawEntries: Record<string, () => Promise<unknown>>;
	flatSidebarShallow: TSidebarItem[];
	previewBaseUrl: string;
	previewImageUrl?: string;
}) {
	const entries = getEntries(rawEntries);
	const key = getEntryImportKey(pathname);
	const entry = (await entries[key]()) as TGuideEntry;
	const index = flatSidebarShallow.findIndex((sidebarItem) => sidebarItem.pathname === pathname);
	const prev = index - 1 >= 0 ? flatSidebarShallow[index - 1] : null;
	const next = index + 1 < flatSidebarShallow.length ? flatSidebarShallow[index + 1] : null;
	const entryExtended: TGuideEntryExtended = {
		...entry,
		metadata: {
			...entry.metadata,
			preview_image_url:
				previewImageUrl !== undefined
					? previewImageUrl
					: getPreviewUrlFromEntryPathname({ previewBaseUrl, pathname }),
			prev,
			next
		}
	};
	return entryExtended;
}

export function getSidebarItemFromPathname({
	sidebarItem,
	pathname,
	parentItem
}: {
	sidebarItem: TSidebarItem;
	pathname: string;
	parentItem?: TSidebarItem;
}): { sidebarItem: TSidebarItem | undefined; parentItem: TSidebarItem | undefined } {
	if (sidebarItem.pathname === pathname) {
		return {
			sidebarItem,
			parentItem
		};
	}
	if (sidebarItem.children) {
		for (const child of sidebarItem.children) {
			const result = getSidebarItemFromPathname({
				sidebarItem: child,
				pathname,
				parentItem: sidebarItem
			});
			if (result.sidebarItem) {
				return result;
			}
		}
	}
	return { sidebarItem: undefined, parentItem: undefined };
}
