import { LOKI_TOKEN } from '$env/static/private';
import { PUBLIC_LOKI_HOST } from '$env/static/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const start = Date.now() * 1_000_000 - 24 * 60 * 60 * 1_000 * 1_000_000;
	const workerNamesEndpoint = `https://${PUBLIC_LOKI_HOST}/loki/api/v1/label/worker_name/values?start=${start}&token=${LOKI_TOKEN}`;
	const workerNamesRes = await fetch(workerNamesEndpoint);
	const workerNamesJSON: { data: string[] } = await workerNamesRes.json();

	return {
		lokiToken: LOKI_TOKEN,
		workerNames: workerNamesJSON.data
	};
};
