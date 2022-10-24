export function containImage(
	imageWidth: number,
	imageHeight: number,
	containerWidth: number,
	containerHeight: number,
	paddingX = 0,
	paddingY?: number
) {
	if (paddingY === undefined) paddingY = paddingX;

	const imageRatio = imageWidth / imageHeight;
	const containerRatio = containerWidth / containerHeight;

	if (imageRatio > containerRatio) {
		return {
			width: containerWidth - paddingX * 2,
			height: containerWidth / imageRatio - paddingY * 2
		};
	} else {
		return {
			width: containerHeight * imageRatio - paddingX * 2,
			height: containerHeight - paddingY * 2
		};
	}
}
