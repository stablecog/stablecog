export interface TPostCleaned {
	metadata: TPostCleanedMetadata;
	default: any;
}

export interface TPost {
	metadata: TPostMetadata;
	default: any;
}

export interface TPostMetadata {
	title: string;
	date: string;
	description: string;
	author?: string;
	author_url?: string;
	reading_time: number;
	slug: string;
	preview_image_url: string;
	toc: TPostToCItem[];
	tags: string;
}

export interface TPostCleanedMetadata {
	title: string;
	date: string;
	description: string;
	author?: string;
	author_url?: string;
	reading_time: number;
	slug: string;
	preview_image_url: string;
	toc: TPostToCItem[];
	tags: string[];
}

export interface TPostToCItem {
	title: string;
	level: number;
	children?: TPostToCItem[];
}
