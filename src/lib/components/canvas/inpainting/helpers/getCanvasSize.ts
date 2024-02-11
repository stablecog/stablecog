import type { TGenerationFullOutput } from '$ts/stores/user/generation';

export function getCanvasSize({
	output,
	canvasContainerWidth,
	canvasContainerHeight
}: {
	output: TGenerationFullOutput;
	canvasContainerWidth: number;
	canvasContainerHeight: number;
}) {
	let canvasWidth = 0;
	let canvasHeight = 0;
	const aspectRatio = output.generation.width / output.generation.height;
	const widthRatio = canvasContainerWidth / output.generation.width;
	const heightRatio = canvasContainerHeight / output.generation.height;
	const boundByHeight = heightRatio < widthRatio;
	if (boundByHeight) {
		canvasHeight = canvasContainerHeight;
		canvasWidth = canvasHeight * aspectRatio;
	} else {
		canvasWidth = canvasContainerWidth;
		canvasHeight = canvasWidth / aspectRatio;
	}
	return { width: canvasWidth, height: canvasHeight };
}
