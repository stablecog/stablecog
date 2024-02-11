import {
	brushColorDark,
	brushColorLight,
	brushFillDark,
	brushFillLight
} from '$components/canvas/inpainting/constants/main';
import type { TAvailableTheme } from '$ts/stores/theme';
import type Konva from 'konva';

export function getBrushIndicatorCircle({
	KonvaInstance,
	stage,
	brushSize,
	theme
}: {
	KonvaInstance: typeof Konva;
	stage: Konva.Stage;
	brushSize: number;
	theme: TAvailableTheme | null;
}) {
	return new KonvaInstance.Circle({
		x: stage.width() / 2,
		y: stage.height() / 2,
		radius: getBrushIndicatorCircleRadius(brushSize),
		stroke: getBrushIndicatorCircleStroke(theme),
		strokeWidth: 2,
		visible: false,
		fillEnabled: true,
		dashEnabled: false,
		fill: getBrushIndicatorCircleFill(theme),
		dash: [1, 4],
		lineCap: 'round',
		lineJoin: 'round'
	});
}

export function getBrushIndicatorCircleStroke(theme: TAvailableTheme | null) {
	const current = getBrushIndicatorCircleStrokeColor(theme);
	return `rgba(${current}, 1)`;
}

export function getBrushIndicatorCircleRadius(brushSize: number) {
	return brushSize / 2;
}

export function getBrushColor(theme: TAvailableTheme | null) {
	return theme === 'light' ? brushColorLight : brushColorDark;
}

export function getBrushIndicatorCircleFillColor(theme: TAvailableTheme | null) {
	return theme === 'light' ? brushFillLight : brushFillDark;
}

export function getBrushIndicatorCircleStrokeColor(theme: TAvailableTheme | null) {
	return theme === 'light' ? brushColorLight : brushColorDark;
}

export function getBrushConfig(canvasMinSize: number): TBrushConfig {
	return {
		min: canvasMinSize / 50,
		max: canvasMinSize / 3,
		step: canvasMinSize / 1000
	};
}

export function getDefaultBrushSize(brushConfig: TBrushConfig) {
	return (brushConfig.max - brushConfig.min) / 2.5 + brushConfig.min;
}

export function getBrushStroke(theme: TAvailableTheme | null) {
	const current = getBrushColor(theme);
	return `rgba(${current}, 1)`;
}

export function getBrushIndicatorCircleFill(theme: TAvailableTheme | null) {
	const current = getBrushIndicatorCircleFillColor(theme);
	return `rgba(${current}, 0.5)`;
}

export function getDrawingLineStroke(current: string) {
	return `rgba(${current}, 1)`;
}

export interface TBrushConfig {
	min: number;
	max: number;
	step: number;
}
