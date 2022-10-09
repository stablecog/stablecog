import type { TServerHealth, TServerHealthStatus } from '$ts/types/main';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const startTimestamp = Date.now();
	const startDate = new Date(startTimestamp).toUTCString();
	try {
		const { server_url }: { server_url: string | undefined } = await request.json();
		console.log('----', 'Started server health check:', startDate, '--', server_url, '----');
		const res = await fetch(`${server_url}/openapi.json`);
		const data: TServerHealthData = await res.json();
		const properties = data.components?.schemas?.Input?.properties;
		const endTimestamp = Date.now();
		const endDate = new Date(endTimestamp).toUTCString();
		let serverHealth: TServerHealth;
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
			serverUrl: server_url
		});
		return new Response(JSON.stringify({ ...serverHealth }));
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
		return new Response(JSON.stringify({ status: 'unhealthy' }));
	}
};

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
