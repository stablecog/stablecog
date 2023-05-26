import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	//@ts-ignore
	plugins: [sveltekit()]
};

export default config;
