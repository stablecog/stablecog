import { env as envPublic } from '$env/dynamic/public';

export const urlFromImageId = (imageId: string) => {
	const base = `${envPublic.PUBLIC_R2_URL}/${imageId}`;
	if (hasExtention(imageId)) return base;
	return `${base}.webp`;
};

export const keyFromImageId = (imageId: string) => {
	if (hasExtention(imageId)) return imageId;
	return `${imageId}.webp`;
};

const extentions = ['.webp', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.avif'];
const hasExtention = (imageId: string) => {
	for (const ext of extentions) {
		if (imageId.endsWith(ext)) return true;
	}
};
