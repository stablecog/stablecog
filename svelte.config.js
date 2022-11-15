import adapterNode from '@sveltejs/adapter-node';
import adapterAuto from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({ postcss: true }),
	kit: {
		adapter: process.env.VERCEL ? adapterAuto() : adapterNode(),
		alias: {
			'$components/*': './src/lib/components',
			'$ts/*': './src/lib/ts',
			'$css/*': './src/lib/css',
			'$md/*': './src/lib/md',
			'$routes/*': './src/routes',
			'$i18n/*': './src/i18n',
		},
		inlineStyleThreshold: 60 * 1024
	}
};

export default config;
