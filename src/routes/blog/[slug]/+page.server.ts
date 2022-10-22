import { remark } from 'remark';
import rehypeExternalLinks from 'rehype-external-links';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkToRehype from 'remark-rehype';
import extractFrontmatter from 'remark-extract-frontmatter';
import rehypeStringify from 'rehype-stringify';
import rehypeToC from '@jsdevtools/rehype-toc';
import rehypeSlug from 'rehype-slug';
import rehypeAttrs from 'rehype-attr';
import rehypeRaw from 'rehype-raw';
import yaml from 'yaml';
import { canonicalUrl } from '$ts/constants/main';
import { error, type ServerLoad } from '@sveltejs/kit';
import type { TToC } from '$ts/types/main';

const averageWordsPerMinute = 200;
const averageWordLength = 5;

const r = remark()
	.use(remarkParse)
	.use(remarkFrontmatter)
	.use(extractFrontmatter, { yaml: yaml.parse })
	.use(remarkToRehype, { allowDangerousHtml: true })
	.use(rehypeRaw)
	.use(rehypeAttrs, { properties: 'attr' })
	.use(rehypeExternalLinks, {
		rel: ['nofollow'],
		target(element) {
			return String(element.properties?.href).startsWith(canonicalUrl) ? undefined : '_blank';
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
		console.log('not found');
		throw error(404, 'Blog posts not found');
	}
	const post: any = await blogPostsImport[getPath(slug)]();
	const unprocessedHTML: string = post.html;
	const attributes: TToC = post.attributes;
	const characters = unprocessedHTML.length;
	const wordsAveraged = characters / averageWordLength;
	const reading_time = Math.round(wordsAveraged / averageWordsPerMinute);
	const file = await r.process(unprocessedHTML);
	const html = String(file).replaceAll('<img src=', '<img loading="lazy" src=');
	const toc = html.split('</nav>')[0].split('<nav class="toc">')[1];
	const content = html.split('</nav>')[1];
	return {
		content,
		toc,
		frontmatter: { ...attributes, reading_time, slug }
	};
};
