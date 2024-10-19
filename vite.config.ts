import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [
		sentrySvelteKit({
			autoUploadSourceMaps: true,
			sourceMapsUploadOptions: {
				org: 'stablecog',
				project: 'sveltekit',
				authToken: process.env.SENTRY_AUTH_TOKEN
			}
		}),
		sveltekit()
	]
};

export default config;
