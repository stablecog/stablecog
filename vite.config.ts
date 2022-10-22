import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import mdPlugin from 'vite-plugin-markdown';

const config: UserConfig = {
	//@ts-ignore
	plugins: [sveltekit(), mdPlugin.default({ mode: 'html' })]
};

export default config;
