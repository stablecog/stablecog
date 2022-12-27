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
import rehypeRaw from 'rehype-raw';
import rehypeAttributes from 'rehype-attributes';
import yaml from 'yaml';
import { error, type ServerLoad } from '@sveltejs/kit';
import { convert as convertHtmlToText } from 'html-to-text';
import type { TToC } from '$ts/types/main';

const averageWordsPerMinute = 265;
const averageWordLength = 5;

const r = unified()
	.use(remarkParse)
	.use(remarkImages)
	.use(remarkFrontmatter)
	.use(extractFrontmatter, { yaml: yaml.parse })
	.use(remarkToRehype, { allowDangerousHtml: true })
	.use(rehypeRaw)
	.use(rehypeAttrs, { properties: 'attr' })
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

const getPath = (slug: string | undefined) => `/src/lib/md/${slug}.md`;

export const load: ServerLoad = async ({ params }) => {
	const { slug } = params;
	const blogPostsImport = import.meta.glob('$md/*.md');
	if (!blogPostsImport[getPath(slug)]) {
		throw error(404, 'Blog post not found');
	}
	const post: any = await blogPostsImport[getPath(slug)]();
	const unprocessedHTML: string = post.html;
	const plainText = convertHtmlToText(unprocessedHTML);
	const characters = plainText.length;
	const wordsAveraged = characters / averageWordLength;
	const reading_time = Math.round(wordsAveraged / averageWordsPerMinute);
	const attributes: TToC = post.attributes;
	const file = await r.process(unprocessedHTML);
	const htmlString = file.toString();
	const toc = htmlString.split('</nav>')[0].split('<nav class="toc">')[1];
	const content = htmlString.split('</nav>')[1];
	return {
		content,
		toc,
		frontmatter: { ...attributes, reading_time, slug }
	};
};
