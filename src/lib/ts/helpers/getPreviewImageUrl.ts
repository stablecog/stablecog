import { PUBLIC_OG_IMAGE_API_URL } from '$env/static/public';

export const getPreviewImageUrlFromOutputId = (outputId: string) => {
	return `${PUBLIC_OG_IMAGE_API_URL}/api/gallery/output/${outputId}.png`;
};
