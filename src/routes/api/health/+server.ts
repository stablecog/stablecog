import { env } from '$env/dynamic/public';
import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import { getDefaultServers } from '$ts/queries/db/getDefaultServers';
import { updateServerHealthInDb } from '$ts/queries/db/updateServerHealthInDb';
import { shuffleArray } from '$ts/helpers/shuffleArray';
import type { TDBServer } from '$ts/types/db';
import type { TServerHealthRes } from '$ts/types/main';
import type { RequestHandler } from '@sveltejs/kit';
import { getDeviceInfo } from '$ts/helpers/getDeviceInfo';

export const POST: RequestHandler = async ({ request }) => {
	const { server_url }: { server_url: string } = await request.json();
	const { headers } = request;
	const userAgent = headers.get('user-agent');
	const deviceInfo = getDeviceInfo(userAgent);
	const countryCode = headers.get('cf-ipcountry');
	console.log(
		`---- Health request made to "/health" -- ${countryCode} -- ${deviceInfo.os} -- ${deviceInfo.browser} -- ${deviceInfo.type} ----`
	);
	let isDefaultServer = env.PUBLIC_DEFAULT_SERVER_URL === server_url;
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
	let serverHealth: TServerHealthRes = { status: 'unhealthy' };
	try {
		const res = await fetch(`${serverUrl}/openapi.json`);
		const data: TServerHealthData = await res.json();
		const properties = data.components?.schemas?.Input?.properties;
		const endTimestamp = Date.now();
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
				serverHealth.features = [...(serverHealth.features ?? []), 'negative_prompt'];
			}
			if (properties.image_u !== undefined) {
				serverHealth.features = [...(serverHealth.features ?? []), 'upscale'];
			}
		} else {
			serverHealth = { status: 'unhealthy' };
		}
		console.log(
			'----',
			`Ended server health check in: ${(endTimestamp - startTimestamp) / 1000}s`,
			'--',
			serverHealth.status,
			'--',
			serverUrl,
			'----'
		);
		return serverHealth;
	} catch (error) {
		const endTimestamp = Date.now();
		const endDate = new Date(endTimestamp).toUTCString();
		console.log(
			'----',
			`Failed server health check in: ${(endTimestamp - startTimestamp) / 1000}s:`,
			'--',
			endDate,
			'----'
		);
	} finally {
		return serverHealth;
	}
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
					image_u?: {
						title: string;
					};
				};
			};
		};
	};
}
