import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import mdPlugin from 'vite-plugin-markdown';
import path from 'path';
import wasm from 'vite-plugin-wasm';

const config: UserConfig = {
	//@ts-ignore
	plugins: [sveltekit(), mdPlugin.default({ mode: 'html' }), wasm()],
	resolve: {
		alias: {
			src: path.resolve('src/'),
		},
	}
};

export default config;
