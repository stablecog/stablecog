import {
	brushColorDark,
	brushColorLight,
	brushFillDark,
	brushFillLight,
	svgPattern
} from '$components/canvas/constants/main';
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

export function getBrushIndicatorCircleFillColor(theme: TAvailableThemes | null) {
	return theme === 'light' ? brushFillLight : brushFillDark;
}

export function getBrushIndicatorCircleStrokeColor(theme: TAvailableThemes | null) {
	return theme === 'light' ? brushColorLight : brushColorDark;
}

export function getBrushStroke(theme: TAvailableThemes | null) {
	const current = getBrushColor(theme);
	return `rgba(${current}, 1)`;
}

export function getBrushIndicatorCircleFill(theme: TAvailableThemes | null) {
	const current = getBrushIndicatorCircleFillColor(theme);
	return `rgba(${current}, 0.35)`;
}

export function getSvgPatternFg(theme: TAvailableThemes | null) {
	const current = getBrushIndicatorCircleFillColor(theme);
	return `rgba(${current}, 1)`;
}

export function getSvgPatternBg(theme: TAvailableThemes | null) {
	const current = getBrushIndicatorCircleStrokeColor(theme);
	return `rgba(${current}, 1)`;
}

export function getBrushIndicatorCircleStroke(theme: TAvailableThemes | null) {
	const current = getBrushIndicatorCircleStrokeColor(theme);
	return `rgba(${current}, 1)`;
}

export function getBrushIndicatorCircleRadius(brushSize: number) {
	return brushSize / 2;
}

export function getDrawingLineStroke(current: string) {
	return `rgba(${current}, 1)`;
}

export function getColoredSvgPattern(fg: string, bg: string) {
	return `data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">${svgPattern}`
		.replaceAll('black', fg)
		.replaceAll('white', bg);
}
