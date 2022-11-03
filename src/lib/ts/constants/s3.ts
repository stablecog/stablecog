import { env } from '$env/dynamic/private';
import AWS from 'aws-sdk';

export const s3 = new AWS.S3({
	endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	accessKeyId: env.R2_ACCESS_KEY_ID,
	secretAccessKey: env.R2_SECRET_ACCESS_KEY,
	region: 'auto'
});
