import { PUBLIC_OG_IMAGE_API_URL } from '$env/static/public';

export const getPreviewImageUrlFromOutputId = (outputId: string) => {
	return `${PUBLIC_OG_IMAGE_API_URL}/api/gallery/output/${outputId}.png`;
};

export const getUserProfilePreviewImageUrlFromOutputId = (outputId: string, username: string) => {
	return `${PUBLIC_OG_IMAGE_API_URL}/api/user/${username}/output/${outputId}.png`;
};

export const getPreviewImageUrlForUserProfile = (username: string) => {
	return `${PUBLIC_OG_IMAGE_API_URL}/api/user/${username}/profile-preview.png`;
};

export const getModelPreviewImageUrl = (modelId: string) => {
	return `${PUBLIC_OG_IMAGE_API_URL}/api/generation-model-v2/${modelId}.png`;
};
