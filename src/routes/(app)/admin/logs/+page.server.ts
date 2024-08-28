import { env as envPrivate } from '$env/dynamic/private';
import { env as envPublic } from '$env/dynamic/public';
import { logger } from '$ts/constants/logger';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const start = Date.now() * 1_000_000 - 24 * 60 * 60 * 1_000 * 1_000_000;
	const appNamesEndpoint = `https://${envPublic.PUBLIC_LOKI_HOST}/loki/api/v1/label/application/values?start=${start}&token=${envPrivate.LOKI_TOKEN}`;
	const workerNamesEndpoint = `https://${envPublic.PUBLIC_LOKI_HOST}/loki/api/v1/label/worker_name/values?start=${start}&token=${envPrivate.LOKI_TOKEN}`;
	const [appNamesRes, workerNamesRes] = await Promise.all([
		fetch(appNamesEndpoint),
		fetch(workerNamesEndpoint)
	]);
	if (!appNamesRes.ok) {
		logger.error(`Failed to fetch app names: ${appNamesRes.status}`);
		throw new Error(`Failed to fetch app names: ${appNamesRes.status}`);
	}
	if (!workerNamesRes.ok) {
		logger.error(`Failed to fetch worker names: ${workerNamesRes.status}`);
		throw new Error(`Failed to fetch worker names: ${workerNamesRes.status}`);
	}
	const workerNamesJSON: { data?: string[] } = await workerNamesRes.json();
	const appNamesJSON: { data?: string[] } = await appNamesRes.json();
	const workerNames = (workerNamesJSON.data || []).sort();
	const appNames = (appNamesJSON.data || []).sort();
	return {
		lokiToken: envPrivate.LOKI_TOKEN,
		workerNames,
		appNames
	};
};
