import rehypeHighlight from 'rehype-highlight';
import { defineMDSveXConfig as defineConfig } from 'mdsvex';
import remarkExternalLinks from 'remark-external-links';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { h } from 'hastscript';
import { toString } from 'hast-util-to-string';

function getHeading(node) {}

export const mdsvexOptions = defineConfig({
	extensions: ['.svx', '.md'],
	remarkPlugins: [
		readingTime,
		slug,
		previewImageUrl,
		toc,
		[remarkExternalLinks, { target: '_blank', rel: 'noopener noreferrer' }]
	],
	rehypePlugins: [
		rehypeHighlight,
		rehypeSlug,
		[
			rehypeAutolinkHeadings,
			{
				behavior: 'append',
				properties: { ariaHidden: true, tabIndex: -1, class: 'heading-anchor' },
				test: (node) => node.tagName !== 'h1',
				content(node) {
					return [h('span.heading-anchor-span', '#')];
				}
			}
		]
	]
});

const AVERAGE_WORD_LENGTH = 5;
const WPM = 200;
const PUBLIC_BUCKET_AUX_URL = 'https://ba.stablecog.com';

function readingTime() {
	return (_, file) => {
		file.data.fm = {
			...file.data.fm,
			reading_time: Math.ceil(file.contents.length / AVERAGE_WORD_LENGTH / WPM)
		};
	};
}

function slug() {
	return (_, file) => {
		file.data.fm = {
			...file.data.fm,
			slug: file.filename.split('/').pop().split('.')[0]
		};
	};
}

function toc() {
	return (tree, file) => {
		const toc = getToc(tree);
		file.data.fm = {
			...file.data.fm,
			toc: toc
		};
	};
}

function previewImageUrl() {
	return (_, file) => {
		const folder = file.filename.split('/md/')[1].split('/')[0];
		file.data.fm = {
			...file.data.fm,
			preview_image_url: `${PUBLIC_BUCKET_AUX_URL}/${folder}/previews/${file.data.fm.slug}.jpg`
		};
	};
}

function getToc(tree) {
	const flatToc = traverseNode(tree);
	const toc = nodeArrayToHierarchy(flatToc);
	return toc;
}

function traverseNode(node, arr = []) {
	if (node.children && node.children.length > 2) {
		node.children.forEach((child) => {
			traverseNode(child, arr);
		});
	}
	if (node.type === 'heading') {
		arr.push({
			title: findValue(node),
			level: node.depth
		});
	}
	return arr;
}

function findValue(node) {
	let value = '';
	if (node.type === 'text' && !node.children) {
		value += node.value;
		return value;
	}
	if (node.children && node.children.length > 0) {
		node.children.forEach((child) => {
			value += findValue(child);
		});
	}
	return value;
}

function nodeArrayToHierarchy(array) {
	let result = [];
	let stack = [];

	array.forEach((node) => {
		const newNode = { title: node.title, level: node.level };
		while (stack[stack.length - 1] && stack[stack.length - 1].level >= node.level) {
			stack.pop();
		}
		if (stack.length === 0) {
			stack.push(newNode);
			result.push(newNode);
			return;
		}
		if (node.level > stack[stack.length - 1].level) {
			if (stack[stack.length - 1].children) {
				stack[stack.length - 1].children.push(newNode);
			} else {
				stack[stack.length - 1].children = [newNode];
			}
			stack.push(newNode);
			return;
		}
	});

	return result;
}
