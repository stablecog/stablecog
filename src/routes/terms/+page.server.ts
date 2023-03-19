import { unified } from 'unified';
import rehypeExternalLinks from 'rehype-external-links';
import remarkParse from 'remark-parse';
import remarkToRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import rehypeAttrs from 'rehype-attr';
import remarkImages from 'remark-images';
import rehypeRaw from 'rehype-raw';
import rehypeAttributes from 'rehype-attributes';
import type { ServerLoad } from '@sveltejs/kit';

const r = unified()
	.use(remarkParse)
	.use(remarkImages)
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
	.use(rehypeStringify);

export const load: ServerLoad = async () => {
	const termsOfServiceImport = import.meta.glob('$md/terms.md');
	const termsOfService: any = await termsOfServiceImport['/src/lib/md/terms.md']();
	const unprocessedHTML: string = termsOfService.html;
	const file = await r.process(unprocessedHTML);
	const htmlString = file.toString();
	const content = htmlString;
	return {
		content
	};
};
