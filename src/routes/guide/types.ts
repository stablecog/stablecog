export interface TSidebarItem {
	title: string;
	pathname: string;
	preview_image_url?: string;
	children?: TSidebarItem[];
}

export interface TGuideNode {
	key: string;
	importKey?: string;
	dirKey: string;
	type: 'file' | 'folder';
	children?: { [key: string]: TGuideNode };
	metadata: TGuideEntryMetadata | undefined;
}

export interface TGuideEntryMetadata {
	slug: string;
	title: string;
	description: string;
	author: string;
	author_url: string;
	date: string;
	preview_image_url: string;
}
