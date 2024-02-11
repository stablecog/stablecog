export function getCanvasMinSize(
	canvasWidth: number | undefined,
	canvasHeight: number | undefined
) {
	return canvasWidth && canvasHeight ? Math.min(canvasWidth, canvasHeight) : 1000;
}
