import sharp from 'sharp';

import { v4 as uuid } from 'uuid';
import { formatPrompt } from '$ts/helpers/formatPrompt';
import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import { s3 } from '$ts/constants/s3';

const model_id = '048b4aa3-5586-47ed-900f-f4341c96bdb2';

export async function uploadToGallery({
	imageDataB64,
	prompt,
	negative_prompt,
	seed,
	inference_steps,
	guidance_scale,
	hidden = true
}: TUploadToGalleryRequest) {
	const uri = imageDataB64.split(';base64,').pop();
	if (!uri) {
		console.log('Invalid image');
		return;
	}
	if (!prompt) {
		console.log('No prompt');
		return;
	}
	if (!supabaseAdmin) {
		console.log('No Supabase instance found');
		return;
	}
	prompt = formatPrompt(prompt);
	if (negative_prompt) negative_prompt = formatPrompt(negative_prompt);
	let prompt_id: string;
	const startTimestampPromptChecks = Date.now();
	const { data: prompt_get_data, error: prompt_get_error } = await supabaseAdmin
		.from('prompt')
		.select('id')
		.eq('text', prompt);
	if (prompt_get_error) {
		console.log('Prompt get error:', prompt_get_error);
		return;
	} else if (prompt_get_data?.[0]?.id) {
		prompt_id = prompt_get_data[0].id;
	} else {
		const { data: prompt_insert_data, error: prompt_insert_error } = await supabaseAdmin
			.from('prompt')
			.insert([{ text: prompt }])
			.select('id')
			.single();
		if (prompt_insert_error) {
			console.log('Prompt insert error:', prompt_insert_error);
			return;
		}
		prompt_id = prompt_insert_data.id;
	}
	let negative_prompt_id: string | null;
	if (!negative_prompt) {
		negative_prompt_id = null;
	} else {
		const { data: negative_prompt_get_data, error: negative_prompt_get_error } = await supabaseAdmin
			.from('negative_prompt')
			.select('id')
			.eq('text', negative_prompt);
		if (negative_prompt_get_error) {
			console.log('Negative prompt get error:', negative_prompt_get_error);
			return;
		} else if (negative_prompt_get_data?.[0]?.id) {
			negative_prompt_id = negative_prompt_get_data[0].id;
		} else {
			const { data: negative_prompt_insert_data, error: negative_prompt_insert_error } =
				await supabaseAdmin
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
	const endTimestampPromptChecks = Date.now();
	console.log(
		`---- Prompt checks and inserts in: ${
			(endTimestampPromptChecks - startTimestampPromptChecks) / 1000
		}s -- ${guidance_scale} -- ${inference_steps} -- ${seed} ----`
	);
	const startTimestampSharp = Date.now();
	const imgBuffer = Buffer.from(uri, 'base64');
	const webp = await sharp(imgBuffer).webp({ quality: 85, effort: 6 }).toBuffer();
	const metadata = await sharp(imgBuffer).metadata();
	const image_id = uuid();
	const endTimestampSharp = Date.now();
	console.log(
		`---- Sharp process in: ${(endTimestampSharp - startTimestampSharp) / 1000}s -- ${
			metadata.width
		} -- ${metadata.height} -- ${guidance_scale} -- ${inference_steps} -- ${seed} ----`
	);
	const startTimestampS3 = Date.now();
	const uploaded_image = await s3
		.upload({ Bucket: 'stablecog', Key: `${image_id}.webp`, Body: webp, ContentType: 'image/webp' })
		.promise();
	const endTimestampS3 = Date.now();
	console.log(
		`---- Uploaded image to S3 in: ${(endTimestampS3 - startTimestampS3) / 1000}s -- ${
			metadata.width
		} -- ${metadata.height} -- ${guidance_scale} -- ${inference_steps} -- ${seed} ----`
	);
	const startTimestampSupa = Date.now();
	const { data: generation_g_data, error: generation_g_error } = await supabaseAdmin
		.from('generation_g')
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
				model_id,
				hidden
			}
		])
		.select('*')
		.single();
	const endTimestampSupa = Date.now();
	console.log(
		`---- Inserted into to the generation_g table in: ${
			(endTimestampSupa - startTimestampSupa) / 1000
		}s -- ${metadata.width} -- ${
			metadata.height
		} -- ${guidance_scale} -- ${inference_steps} -- ${seed} ----`
	);
	if (generation_g_error) {
		console.log('Insert generation_g error', generation_g_error);
		return;
	}
}

interface TUploadToGalleryRequest {
	imageDataB64: string;
	prompt: string;
	negative_prompt?: string;
	seed: number;
	inference_steps: number;
	guidance_scale: number;
	hidden?: boolean;
}
