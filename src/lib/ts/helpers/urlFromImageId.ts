import { env as envPublic } from '$env/dynamic/public';

export const urlFromImageId = (imageId: string) => {
	return `${envPublic.PUBLIC_R2_URL}/${imageId}.webp`;
};
