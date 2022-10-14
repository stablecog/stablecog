import { maxPromptLength } from '$ts/constants/main';
import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import { formatPrompt } from '$ts/helpers/formatPrompt';
import { getDeviceInfo } from '$ts/helpers/getDeviceInfo';
import type { TGenerationRequest, TGenerationResponse } from '$ts/types/main';
import type { PostgrestError } from '@supabase/supabase-js';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const startTimestamp = Date.now();
	const startDate = new Date(startTimestamp).toUTCString();
	const { headers } = request;
	const countryCode = headers.get('cf-ipcountry');
	let generationProcessId: string | undefined;
	if (supabaseAdmin !== undefined) {
		try {
			let { data, error }: TDBGenerationProcessRes = await supabaseAdmin
				.from('generation_process')
				.insert({
					status: 'started',
					country_code: countryCode || null
				})
				.select('id');
			generationProcessId = data?.[0].id;
		} catch (error) {
			console.log(error);
		}
	}
	try {
		const {
			server_url,
			prompt,
			negative_prompt,
			seed,
			width,
			height,
			num_inference_steps,
			guidance_scale
		}: TGenerationRequest = await request.json();
		const _negative_prompt =
			negative_prompt !== '' && negative_prompt !== undefined
				? formatPrompt(negative_prompt)
				: undefined;
		const _prompt = formatPrompt(prompt);
		generationLog({
			text: 'Started generation:',
			dateString: startDate,
			prompt: _prompt,
			negative_prompt: _negative_prompt,
			width,
			height,
			num_inference_steps,
			guidance_scale,
			seed,
			server_url
		});
		const startTimestamp = Date.now();
		const response = await fetch(`${server_url}/predictions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				input: {
					prompt: _prompt,
					negative_prompt: _negative_prompt,
					width: width.toString(),
					height: height.toString(),
					seed: seed.toString(),
					num_inference_steps: Math.round(num_inference_steps).toString(),
					guidance_scale: Math.round(guidance_scale).toString()
				}
			})
		});
		const endTimestamp = Date.now();
		const generationDurationMs = endTimestamp - startTimestamp;
		const data: TGenerateImageData = await response.json();
		const output = data.output[0];
		const endDate = new Date(endTimestamp).toUTCString();
		if (data.error) {
			console.log('----', endDate, '--', 'Generation error', '--', data.error, '----');
		}
		generationLog({
			text: `Ended generation in ${(endTimestamp - startTimestamp) / 1000}s:`,
			dateString: endDate,
			prompt: _prompt,
			negative_prompt: _negative_prompt,
			width,
			height,
			num_inference_steps,
			guidance_scale,
			seed,
			server_url
		});
		// If Supabase is setup, write to it
		if (output && !data.error && supabaseAdmin !== undefined) {
			try {
				const userAgent = headers.get('user-agent');
				const deviceInfo = getDeviceInfo(userAgent);
				const dbEntryStartTimestamp = Date.now();
				let { data: generationData, error: generationError } = await supabaseAdmin
					.from('generation')
					.insert([
						{
							prompt: _prompt,
							negative_prompt: _negative_prompt,
							seed,
							width,
							height,
							num_inference_steps,
							guidance_scale,
							server_url,
							duration_ms: generationDurationMs,
							country_code: countryCode,
							device_type: deviceInfo.type,
							device_browser: deviceInfo.browser,
							device_os: deviceInfo.os,
							user_agent: userAgent
						}
					])
					.select('id');
				if (generationError) {
					console.log('error', generationError.message);
				} else {
					const { data: generationProcessData, error: generationProcessError } = await supabaseAdmin
						.from('generation_process')
						.update({
							generation_id: generationData?.[0]?.id,
							status: 'succeeded'
						})
						.eq('id', generationProcessId);
					const dbEntryEndTimestamp = Date.now();
					const dbEntryEndDate = new Date(dbEntryEndTimestamp).toUTCString();
					generationLog({
						text: `Inserted into the DB in ${dbEntryEndTimestamp - dbEntryStartTimestamp}ms:`,
						dateString: dbEntryEndDate,
						prompt: _prompt,
						negative_prompt: _negative_prompt,
						seed,
						width,
						height,
						num_inference_steps,
						guidance_scale,
						server_url
					});
				}
			} catch (error) {
				console.log(error);
			}
		}
		const generationResponse: TGenerationResponse = {
			data: output ? { imageDataB64: output, duration_ms: generationDurationMs } : undefined,
			error: data.error
		};
		return new Response(JSON.stringify(generationResponse));
	} catch (error) {
		const endTimestamp = Date.now();
		const endDate = new Date(endTimestamp).toUTCString();
		console.log(
			'----',
			`Failed generation in ${(endTimestamp - startTimestamp) / 1000}s:`,
			endDate,
			'--',
			error,
			'----'
		);
		if (supabaseAdmin) {
			try {
				const { data, error } = await supabaseAdmin
					.from('generation_process')
					.update({
						status: 'failed'
					})
					.eq('id', generationProcessId)
					.select('id');
				if (error) {
					console.log('error', error.message);
				}
			} catch (error) {
				console.log(error);
			}
		}
		return new Response(JSON.stringify({ error: 'Something went wrong :(' }));
	}
};

interface TGenerateImageData {
	output: string[];
	status: TStatus;
	error?: string;
}

type TStatus = 'succeeded' | 'failed';

export type TDBGenerationProcessStatus = 'started' | 'succeeded' | 'failed' | 'rejected';

export interface TDBGenerationProcessRes {
	data:
		| {
				id: string;
				status: TDBGenerationProcessStatus;
				generation_id: string | null;
				country_code: string | null;
				created_at: string;
				updated_at: string;
		  }[]
		| null;
	error: PostgrestError | null;
}

const generationLog = ({
	text,
	dateString,
	prompt,
	negative_prompt,
	width,
	height,
	num_inference_steps,
	guidance_scale,
	seed,
	server_url
}: {
	text: string;
	dateString: string;
	prompt: string;
	negative_prompt: string | undefined;
	width: number;
	height: number;
	num_inference_steps: number;
	guidance_scale: number;
	seed: number;
	server_url: string;
}) => {
	console.log(
		'----',
		text,
		dateString,
		'--',
		`"${prompt}"`,
		`--${negative_prompt ? ` "${negative_prompt}" --` : ''}`,
		width,
		'--',
		height,
		'--',
		guidance_scale,
		'--',
		num_inference_steps,
		'--',
		seed,
		'--',
		server_url,
		'----'
	);
};
