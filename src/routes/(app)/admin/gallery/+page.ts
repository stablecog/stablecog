import { getGalleryLikeParamsFromSearchParams } from '$ts/helpers/galleryLike';
import { adminGalleryCurrentFilterDefault } from '$ts/stores/admin/gallery';
import { TGalleryStatusSchema } from '$ts/stores/user/generation';

export const load = async ({ url }) => {
	const viewParam = url.searchParams.get('view');
	const view = TGalleryStatusSchema.safeParse(viewParam).success
		? TGalleryStatusSchema.parse(viewParam)
		: adminGalleryCurrentFilterDefault;
	const usernameFiltersQuery = url.searchParams.get('un');
	const usernameFilters = usernameFiltersQuery?.split(',') || [];
	const galleryLikeParams = getGalleryLikeParamsFromSearchParams(url.searchParams);
	return {
		...galleryLikeParams,
		usernameFilters,
		view
	};
};
