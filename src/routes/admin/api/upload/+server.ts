import type { RequestHandler } from '@sveltejs/kit';
import sharp from 'sharp';
import AWS from 'aws-sdk';
import { env } from '$env/dynamic/private';
import { v4 as uuid } from 'uuid';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

const s3 = new AWS.S3({
	accessKeyId: env.ACCESS_KEY_ID,
	secretAccessKey: env.SECRET_ACCESS_KEY,
	region: 'auto',
	endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`
});

export const POST: RequestHandler = async (event) => {
	let {
		imageDataB64,
		prompt,
		negative_prompt,
		seed,
		inference_steps,
		guidance_scale
	}: TGenerationUploadRequest = await event.request.json();
	const uri = imageDataB64.split(';base64,').pop();
	if (!uri) return new Response('Invalid image', { status: 400 });
	if (!prompt) return new Response('A prompt is required', { status: 400 });
	const model_id = '048b4aa3-5586-47ed-900f-f4341c96bdb2';
	const { supabaseClient } = await getSupabase(event);
	let prompt_id: string;
	const { data: prompt_data, error: prompt_error } = await supabaseClient
		.from('prompt')
		.select('id')
		.eq('text', prompt);
	if (prompt_error) {
		console.log('Prompt error:', prompt_error);
		return new Response('Error getting prompt', { status: 500 });
	} else if (prompt_data?.[0]?.id) {
		prompt_id = prompt_data[0].id;
	} else {
		const { data: prompt_insert_data, error: prompt_insert_error } = await supabaseClient
			.from('prompt')
			.insert([{ text: prompt }])
			.select('id')
			.single();
		if (prompt_insert_error) {
			console.log('Prompt insert error:', prompt_insert_error);
			return new Response(prompt_insert_error.message, { status: 500 });
		}
		prompt_id = prompt_insert_data.id;
	}
	let negative_prompt_id: string | null;
	if (!negative_prompt) {
		negative_prompt_id = null;
	} else {
		const { data: negative_prompt_data, error: negative_prompt_error } = await supabaseClient
			.from('negative_prompt')
			.select('id')
			.eq('text', negative_prompt);
		if (negative_prompt_error) {
			console.log('Negative prompt error:', negative_prompt_error);
			return new Response('Error getting negative prompt', { status: 500 });
		} else if (negative_prompt_data?.[0]?.id) {
			negative_prompt_id = negative_prompt_data[0].id;
		} else {
			const { data: negative_prompt_insert_data, error: negative_prompt_insert_error } =
				await supabaseClient
					.from('negative_prompt')
					.insert([{ text: negative_prompt }])
					.select('id')
					.single();
			if (negative_prompt_insert_error) {
				console.log('Negative prompt insert error:', negative_prompt_insert_error);
				return new Response(negative_prompt_insert_error.message, { status: 500 });
			}
			negative_prompt_id = negative_prompt_insert_data.id;
		}
	}
	const imgBuffer = Buffer.from(uri, 'base64');
	const webp = await sharp(imgBuffer).webp({ quality: 85, effort: 6 }).toBuffer();
	const metadata = await sharp(imgBuffer).metadata();
	const image_id = uuid();
	const uploaded_image = await s3
		.upload({ Bucket: 'stablecog', Key: `${image_id}.webp`, Body: webp, ContentType: 'image/webp' })
		.promise();
	const { data: generation_p_data, error: generation_p_error } = await supabaseClient
		.from('generation_p')
		.insert([
			{
				image_id,
				width: metadata.width,
				height: metadata.height,
				prompt_id,
				negative_prompt_id,
				seed,
				inference_steps,
				guidance_scale,
				model_id
			}
		])
		.select('*')
		.single();
	if (generation_p_error) {
		console.log(generation_p_error);
		return new Response(generation_p_error.message, { status: 500 });
	}
	return new Response(JSON.stringify({ ...generation_p_data }));
};

interface TGenerationUploadRequest {
	imageDataB64: string;
	prompt: string;
	seed: string;
	negative_prompt?: string;
	inference_steps?: number;
	guidance_scale: number;
}
