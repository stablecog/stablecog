import adapterNode from '@sveltejs/adapter-node';
import adapterVercel from '@sveltejs/adapter-vercel';
import { mdsvex } from 'mdsvex';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import preprocess from 'svelte-preprocess';
import { mdsvexOptions } from './mdsvex.config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', ...mdsvexOptions.extensions],
	preprocess: [
		vitePreprocess(),
		mdsvex(mdsvexOptions),
		preprocess({
			postcss: true
		})
	],
	kit: {
		adapter: process.env.VERCEL ? adapterVercel() : adapterNode(),
		alias: {
			'$components/*': './src/lib/components',
			'$ts/*': './src/lib/ts',
			'$css/*': './src/lib/css',
			'$md/*': './src/lib/md',
			'$routes/*': './src/routes',
			'$docroutes/*': './src/routes/(doc)',
			'$approutes/*': './src/routes/(app)',
			'$i18n/*': './src/i18n',
			'$userStores/*': './src/lib/ts/stores/user'
		},
		inlineStyleThreshold: 60 * 1024
	}
};

export default config;
