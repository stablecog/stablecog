import { env as envPublic } from '$env/dynamic/public';

export const urlFromImageId = (imageId: string) => {
	if (imageId.endsWith('.webp')) return `${envPublic.PUBLIC_R2_URL}/${imageId}`;
	return `${envPublic.PUBLIC_R2_URL}/${imageId}.webp`;
};
