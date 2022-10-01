import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({ postcss: true }),
	kit: {
		adapter: adapter(),
		alias: {
			'$components/*': './src/lib/components',
			'$ts/*': './src/lib/ts',
			'$css/*': './src/lib/css'
		},
		inlineStyleThreshold: 60 * 1024
	}
};

export default config;
