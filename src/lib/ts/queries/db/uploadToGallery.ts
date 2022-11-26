import sharp from 'sharp';

import { v4 as uuid } from 'uuid';
import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import { s3 } from '$ts/constants/s3';
import type { TAvailableModelIds } from '$ts/constants/main';

export async function uploadToGallery({
	imageDataB64,
	prompt_id,
	negative_prompt_id,
	model_id,
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
	if (!supabaseAdmin) {
		console.log('No Supabase instance found');
		return;
	}
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
				negative_prompt_id,
				prompt_id,
				model_id,
				height: metadata.height,
				seed,
				inference_steps,
				guidance_scale,
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
	prompt_id: string;
	negative_prompt_id?: string;
	model_id: TAvailableModelIds;
	seed: number;
	inference_steps: number;
	guidance_scale: number;
	hidden?: boolean;
}
