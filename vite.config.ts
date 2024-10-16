import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [
		sentrySvelteKit({
			autoInstrument: true,
			autoUploadSourceMaps: true,
			sourceMapsUploadOptions: {
				org: 'stablecog-1',
				project: 'sveltekit',
				authToken: process.env.SENTRY_AUTH_TOKEN
			}
		}),
		sveltekit()
	]
};

export default config;
