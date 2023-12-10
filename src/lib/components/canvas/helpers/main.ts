import { brushColorDark, brushColorLight } from '$components/canvas/constants/main';
import type { TBrushConfig } from '$components/canvas/toolbar/types';
import type { TAvailableThemes } from '$ts/stores/theme';

export function getCanvasMinSize(
	canvasWidth: number | undefined,
	canvasHeight: number | undefined
) {
	return canvasWidth && canvasHeight ? Math.min(canvasWidth, canvasHeight) : 1000;
}

export function getBrushConfig(canvasMinSize: number): TBrushConfig {
	return {
		min: canvasMinSize / 100,
		max: canvasMinSize / 4,
		step: canvasMinSize / 1000
	};
}

export function getBrushSize(brushConfig: TBrushConfig) {
	return (brushConfig.max - brushConfig.min) / 2 + brushConfig.min;
}

export function getBrushColor(theme: TAvailableThemes | null) {
	return theme === 'light' ? brushColorLight : brushColorDark;
}

export function getBrushCircleFill(currentPrimary: string) {
	return `rgba(${currentPrimary}, 0.2)`;
}

export function getBrushCircleStroke(currentPrimary: string) {
	return `rgba(${currentPrimary}, 1)`;
}

export function getBrushCircleRadius(brushSize: number) {
	return brushSize / 2;
}

export function getDrawingLineStroke(currentPrimary: string) {
	return `rgba(${currentPrimary}, 1)`;
}
