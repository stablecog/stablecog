import type { PageLoad } from '../gallery/$types';
import { TUserGalleryViewSchema } from '$ts/stores/user/gallery';
import { getGalleryLikeParamsFromSearchParams } from '$ts/helpers/galleryLike';

export const load: PageLoad = async ({ parent, url }) => {
	const viewParam = url.searchParams.get('view');
	const view = TUserGalleryViewSchema.safeParse(viewParam).success
		? TUserGalleryViewSchema.parse(viewParam)
		: 'all';
	const galleryLikeParams = getGalleryLikeParamsFromSearchParams(url.searchParams);
	return {
		view,
		...galleryLikeParams
	};
};
