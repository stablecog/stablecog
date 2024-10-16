import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [
		sentrySvelteKit({
			sourceMapsUploadOptions: {
				org: 'stablecog-1',
				project: 'sveltekit'
			},
			adapter: process.env.VERCEL ? 'vercel' : 'node'
		}),
		sveltekit()
	]
};

export default config;
