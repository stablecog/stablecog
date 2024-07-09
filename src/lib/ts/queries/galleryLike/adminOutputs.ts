import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
import type { TAvailableAspectRatio } from '$ts/constants/generationSize';
import { apiUrl } from '$ts/constants/main';
import { SEARCH_SCORE_THRESHOLD_DEFAULT } from '$ts/queries/galleryLike/constants';
import type {
	TGalleryFullOutputsPage,
	TGalleryFullOutputsPageShallow
} from '$ts/queries/galleryLike/types';
import { PER_PAGE_DEFAULT } from '$ts/queries/userVoiceovers';
import type { TGalleryStatus } from '$ts/stores/user/generation';

export async function getAdminFullOutputs({
	cursor,
	access_token,
	gallery_status,
	order_by,
	search,
	model_ids,
	aspect_ratios,
	username_filters
}: {
	cursor?: string;
	gallery_status?: TGalleryStatus;
	access_token: string;
	order_by?: string;
	search?: string;
	model_ids?: TAvailableGenerationModelId[];
	aspect_ratios?: TAvailableAspectRatio[];
	username_filters?: string[];
}): Promise<TGalleryFullOutputsPage> {
	console.log('getAllUserOutputs');
	const query = new URLSearchParams();
	query.append('per_page', PER_PAGE_DEFAULT.toString());

	if (cursor) {
		query.append('cursor', cursor);
	}
	if (gallery_status === 'manually_submitted') {
		query.append('gallery_status', 'submitted');
		query.append('was_auto_submitted', 'false');
	} else if (gallery_status === 'submitted_best') {
		query.append('gallery_status', 'submitted');
		query.append('aesthetic_rating_score_gte', '0.5');
		query.append('aesthetic_artifact_score_lte', '0.5');
	} else if (gallery_status) {
		query.append('gallery_status', gallery_status);
	}
	if (gallery_status === 'waiting_for_approval') {
		query.append('order', 'asc');
	}
	if (search && search !== '') {
		query.append('search', search);
		query.append('score_threshold', SEARCH_SCORE_THRESHOLD_DEFAULT.toString());
	}
	if (model_ids && model_ids.length > 0) {
		query.append('model_ids', model_ids.join(','));
	}
	if (aspect_ratios && aspect_ratios.length > 0) {
		query.append(
			'aspect_ratio',
			aspect_ratios.map((i) => i.replaceAll('.', '_').replaceAll(':', '-')).join(',')
		);
	}
	if (username_filters && username_filters.length > 0) {
		query.append('username', username_filters.join(','));
	}
	if (order_by) {
		query.append('order_by', order_by);
	}
	const url = `${apiUrl.origin}/v1/admin/outputs?${query.toString()}`;
	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`
		}
	});
	const data: TGalleryFullOutputsPageShallow = await res.json();
	if (data.error) throw new Error(data.error);
	const editedData: TGalleryFullOutputsPage = {
		...data,
		outputs: data.outputs.map((output) => ({
			...output,
			generation: { ...output.generation, outputs: [] }
		}))
	};
	return editedData;
}
