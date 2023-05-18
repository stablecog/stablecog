import { unified } from 'unified';
import rehypeExternalLinks from 'rehype-external-links';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkToRehype from 'remark-rehype';
import extractFrontmatter from 'remark-extract-frontmatter';
import rehypeStringify from 'rehype-stringify';
import rehypeToC from '@jsdevtools/rehype-toc';
import rehypeSlug from 'rehype-slug';
import rehypeAttrs from 'rehype-attr';
import remarkImages from 'remark-images';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeAttributes from 'rehype-attributes';
import yaml from 'yaml';
import type { TGuideEntryMetadata, TGuideNode, TSidebarItem } from '$routes/guide/types';
import { guideSidebar } from '$routes/guide/constants';

const r = unified()
	.use(remarkParse)
	.use(remarkImages)
	.use(remarkFrontmatter)
	.use(extractFrontmatter, { yaml: yaml.parse })
	.use(remarkToRehype, { allowDangerousHtml: true })
	.use(rehypeRaw)
	.use(rehypeAttrs, { properties: 'attr' })
	.use(rehypeHighlight)
	.use(rehypeAttributes, {
		img: function (node) {
			// @ts-ignore
			node.properties.loading = 'lazy';
		},
		a: function (node) {
			// @ts-ignore
			if (node.children.map((n) => n.tagName).includes('img')) node.properties.hasimage = true;
		}
	})
	.use(rehypeExternalLinks, {
		rel: ['nofollow'],
		target(element) {
			return /* String(element.properties?.href).startsWith(canonicalUrl) ? undefined : */ '_blank';
		}
	})
	.use(rehypeSlug)
	.use(rehypeToC)
	.use(rehypeStringify);

const guideEntriesImport = import.meta.glob(`/src/lib/md/guide/**/*`);
const tryEntriesImport = import.meta.glob(`/src/lib/md/try/**/*`);

function getSlugFromKey(key: string) {
	const lastSlash = key.lastIndexOf('/');
	const fileNameWithExtension = key.slice(lastSlash + 1);
	const lastDot = fileNameWithExtension.lastIndexOf('.');
	const fileName = fileNameWithExtension.slice(0, lastDot);
	return fileName;
}

export async function getGuideEntryFromPathname(pathname: string) {
	let key = `/src/lib/md${pathname}.md`;
	let importFunction = guideEntriesImport[key];
	if (!importFunction) {
		key = `/src/lib/md${pathname}/index.md`;
		importFunction = guideEntriesImport[key];
	}
	const metadata = await getMetadataFromKey(key, importFunction);
	const res: any = await importFunction();
	const sidebarItem = getSidebarItemFromPathname(pathname, guideSidebar);
	const unprocessedHTML = res.html;
	const file = await r.process(unprocessedHTML);
	const htmlString = file.toString();
	const content = htmlString.split('</nav>')[1];
	return {
		content,
		metadata,
		sidebarItem
	};
}

export async function getTryEntryFromPathname(pathname: string) {
	let key = `/src/lib/md${pathname}.md`;
	let importFunction = tryEntriesImport[key];
	if (!importFunction) {
		key = `/src/lib/md${pathname}/index.md`;
		importFunction = tryEntriesImport[key];
	}
	const metadata = await getMetadataFromKey(key, importFunction);
	const res: any = await importFunction();
	const sidebarItem = getSidebarItemFromPathname(pathname, guideSidebar);
	const unprocessedHTML = res.html;
	const file = await r.process(unprocessedHTML);
	const htmlString = file.toString();
	const content = htmlString.split('</nav>')[1];
	return {
		content,
		metadata,
		sidebarItem
	};
}

function getSidebarItemFromPathname(pathname: string, item: TSidebarItem): TSidebarItem | null {
	if (!item.children || item.children.length < 1) return null;
	for (let i = 0; i < item.children.length; i++) {
		const child = item.children[i];
		if (child.pathname === pathname) return child;
		getSidebarItemFromPathname(pathname, child);
	}
	return null;
}

async function pathArrayToFileStructure(
	paths: string[],
	importFunctions: Record<string, () => Promise<unknown>>,
	importPrefix: string
): Promise<TGuideNode> {
	const root: TGuideNode = {
		key: '/',
		dirKey: '/',
		type: 'folder',
		children: {},
		metadata: undefined
	};

	paths.forEach(async (path) => {
		const pathSegments = path.split('/').filter((segment) => segment.length > 0);
		let currentNode: TGuideNode = root;

		pathSegments.forEach(async (segment, index) => {
			const key = '/' + pathSegments.slice(0, index + 1).join('/');
			if (key.endsWith('index.md')) return;
			const metadata = await getMetadataFromKey(key, importFunctions[importPrefix + key]);
			if (index === pathSegments.length - 1) {
				// If it is the last segment, it should be a file
				currentNode.children![segment] = {
					key,
					importKey: importPrefix + key,
					dirKey: key.split('.')[0],
					type: 'file',
					metadata
				};
			} else {
				// If it is not the last segment, it should be a directory
				if (!(segment in (currentNode.children || {}))) {
					currentNode.children = currentNode.children || {};
					currentNode.children[segment] = {
						key,
						dirKey: key.split('.')[0],
						type: 'folder',
						children: {},
						metadata: metadata
					};
				}
				if (currentNode.children) {
					currentNode = currentNode.children[segment];
				}
			}
		});
	});

	return root;
}

async function getMetadataFromKey(key: string, importFunction: () => Promise<unknown>) {
	const res: any = await importFunction();
	const toc = res.attributes;
	const metadata: TGuideEntryMetadata = {
		...toc,
		slug: getSlugFromKey(key)
	};
	return metadata;
}
