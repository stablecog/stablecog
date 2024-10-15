import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	//@ts-ignore
	plugins: [
		sentrySvelteKit({
			sourceMapsUploadOptions: {
				org: 'stablecog-1',
				project: 'sveltekit'
			}
		}),
		sveltekit()
	]
};

export default config;
