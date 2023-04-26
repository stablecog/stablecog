import adapterNode from '@sveltejs/adapter-node';
import adapterAuto from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import preprocessReact from "svelte-preprocess-react/preprocessReact";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess({ postcss: true }),
		preprocessReact({
			preprocess: preprocess({ sourceMap: true }),
		}),
	],
	kit: {
		adapter: process.env.VERCEL ? adapterAuto() : adapterNode(),
		alias: {
			'$components/*': './src/lib/components',
			'$ts/*': './src/lib/ts',
			'$css/*': './src/lib/css',
			'$md/*': './src/lib/md',
			'$routes/*': './src/routes',
			'$i18n/*': './src/i18n',
			'$userStores/*': './src/lib/ts/stores/user',
		},
		inlineStyleThreshold: 60 * 1024
	}
};

export default config;
