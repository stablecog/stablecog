import { s3 } from '$ts/constants/s3';
import { supabaseAdmin } from '$ts/constants/supabaseAdmin';

export async function deleteFromGallery(id: string, image_id: string) {
	if (!supabaseAdmin) {
		console.log('No Supabase instance found');
		return { status: 500, error: 'No Supabase instance found' };
	}
	const deleteRes = await s3
		.deleteObject({ Bucket: 'stablecog', Key: `${image_id}.webp` })
		.promise();
	const { error } = await supabaseAdmin.from('generation_g').delete().eq('id', id);
	if (error) {
		console.log('Error deleting from DB:', error);
		return { status: 500, error: error.message };
	}
	return { status: 200, data: { id } };
}
