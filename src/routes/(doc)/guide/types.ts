export interface TSidebarItemBase {
	title: string;
	pathname: string;
	no_preview?: boolean;
	children?: TSidebarItemBase[];
	preview_image_url?: string;
	http_method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

export interface TSidebarItem extends TSidebarItemBase {
	preview_image_url?: string;
	children?: TSidebarItem[];
}

export interface TGuideEntryMetadata {
	slug: string;
	title: string;
	description: string;
	author: string;
	author_url: string;
	date: string;
}

export interface TGuideEntryMetadataExtended extends TGuideEntryMetadata {
	prev: TSidebarItem | null;
	next: TSidebarItem | null;
	preview_image_url: string;
}

export interface TGuideEntry {
	metadata: TGuideEntryMetadata;
	default: ConstructorOfATypedSvelteComponent;
}

export interface TGuideEntryExtended extends TGuideEntry {
	metadata: TGuideEntryMetadataExtended;
	default: ConstructorOfATypedSvelteComponent;
}
