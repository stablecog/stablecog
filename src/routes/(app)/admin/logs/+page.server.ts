import { env as envPrivate } from '$env/dynamic/private';
import { env as envPublic } from '$env/dynamic/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const start = Date.now() * 1_000_000 - 24 * 60 * 60 * 1_000 * 1_000_000;
	const appNamesEndpoint = `https://${envPublic.PUBLIC_LOKI_HOST}/loki/api/v1/label/application/values?start=${start}&token=${envPrivate.LOKI_TOKEN}`;
	const workerNamesEndpoint = `https://${envPublic.PUBLIC_LOKI_HOST}/loki/api/v1/label/worker_name/values?start=${start}&token=${envPrivate.LOKI_TOKEN}`;
	const [appNamesRes, workerNamesRes] = await Promise.all([
		fetch(appNamesEndpoint),
		fetch(workerNamesEndpoint)
	]);
	const workerNamesJSON: { data: string[] } = await workerNamesRes.json();
	const appNamesJSON: { data: string[] } = await appNamesRes.json();
	return {
		lokiToken: envPrivate.LOKI_TOKEN,
		workerNames: workerNamesJSON.data.sort(),
		appNames: appNamesJSON.data.sort()
	};
};
