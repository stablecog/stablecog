import { env as envPublic } from '$env/dynamic/public';
import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import { getDefaultServers } from '$ts/helpers/db/getDefaultServers';
import { updateServerHealthInDb } from '$ts/helpers/db/updateServerHealthInDb';
import { shuffleArray } from '$ts/helpers/shuffleArray';
import type { TDBServer } from '$ts/types/db';
import type { TServerHealthRes, TServerHealthStatus } from '$ts/types/main';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { server_url }: { server_url: string } = await request.json();
	let isDefaultServer = envPublic.PUBLIC_DEFAULT_SERVER_URL === server_url;
	let defaultServers: TDBServer[] = [];
	if (supabaseAdmin && isDefaultServer) {
		try {
			const res = await getDefaultServers();
			defaultServers = shuffleArray(res);
			console.log('----', 'Is default server:', isDefaultServer, '----');
		} catch (error) {
			console.log(error);
		}
	}
	if (supabaseAdmin && isDefaultServer && defaultServers.length > 0) {
		let serverHealth: TServerHealthRes = { status: 'unhealthy' };
		for (let i = 0; i < defaultServers.length; i++) {
			const currentServer = defaultServers[i];
			const lastHealthCheckTimestamp = new Date(currentServer.last_health_check_at).getTime();
			const now = Date.now();
			const actualHealthCheckDiff = now - lastHealthCheckTimestamp;
			const minHealthWriteDiff = 1000 * 15;
			const minHealthCheckDiffUnhealthy = 1000 * 15;
			if (!currentServer.healthy && actualHealthCheckDiff < minHealthCheckDiffUnhealthy) {
				continue;
			}
			try {
				serverHealth = await checkHealth(currentServer.url);
			} catch (error) {
				console.log(error);
			} finally {
				if (serverHealth.status === 'healthy') {
					if (actualHealthCheckDiff > minHealthWriteDiff) {
						try {
							await updateServerHealthInDb(currentServer.url, true);
						} catch (error) {
							console.log(error);
						}
					}
					return new Response(JSON.stringify(serverHealth));
				} else {
					try {
						await updateServerHealthInDb(currentServer.url, false);
					} catch (error) {
						console.log(error);
					}
				}
			}
		}
		return new Response(JSON.stringify(serverHealth));
	} else {
		let serverHealth: TServerHealthRes = { status: 'unhealthy' };
		try {
			serverHealth = await checkHealth(server_url);
		} catch (error) {
			console.log(error);
		} finally {
			return new Response(JSON.stringify(serverHealth));
		}
	}
};

async function checkHealth(serverUrl: string) {
	const startTimestamp = Date.now();
	const startDate = new Date(startTimestamp).toUTCString();
	console.log('----', 'Started server health check:', startDate, '--', serverUrl, '----');
	let serverHealth: TServerHealthRes = { status: 'unhealthy' };
	try {
		const res = await fetch(`${serverUrl}/openapi.json`);
		const data: TServerHealthData = await res.json();
		const properties = data.components?.schemas?.Input?.properties;
		const endTimestamp = Date.now();
		const endDate = new Date(endTimestamp).toUTCString();
		if (
			properties !== undefined &&
			properties.guidance_scale !== undefined &&
			properties.num_inference_steps !== undefined &&
			properties.prompt !== undefined &&
			properties.seed !== undefined &&
			properties.width !== undefined &&
			properties.height !== undefined
		) {
			serverHealth = { status: 'healthy' };
			if (properties.negative_prompt !== undefined) {
				serverHealth.features = ['negative_prompt'];
			}
		} else {
			serverHealth = { status: 'unhealthy' };
		}
		endLog({
			startTimestamp,
			endTimestamp,
			endDate,
			status: serverHealth.status,
			serverUrl
		});
		return serverHealth;
	} catch (error) {
		const endTimestamp = Date.now();
		const endDate = new Date(endTimestamp).toUTCString();
		console.log(
			'----',
			`Failed server health check in ${(endTimestamp - startTimestamp) / 1000}s:`,
			'--',
			endDate,
			'----'
		);
		return serverHealth;
	}
}

function endLog({
	startTimestamp,
	endTimestamp,
	endDate,
	status,
	serverUrl
}: {
	startTimestamp: number;
	endTimestamp: number;
	endDate: string;
	status: string | TServerHealthStatus;
	serverUrl: string | undefined;
}) {
	console.log(
		'----',
		`Ended server health check in ${(endTimestamp - startTimestamp) / 1000}s:`,
		endDate,
		'--',
		status,
		'--',
		serverUrl,
		'----'
	);
}

interface TServerHealthData {
	paths?: {
		predictions?: {
			post?: {
				summary?: string;
			};
		};
	};
	components?: {
		schemas?: {
			Input?: {
				properties?: {
					prompt?: {
						title?: string;
					};
					negative_prompt?: {
						title?: string;
					};
					width?: {
						[key: string]: string;
					};
					height?: {
						[key: string]: string;
					};
					num_inference_steps?: {
						title: string;
					};
					guidance_scale?: {
						title: string;
					};
					seed?: {
						title: string;
					};
				};
			};
		};
	};
}
