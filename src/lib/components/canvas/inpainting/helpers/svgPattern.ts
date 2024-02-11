import { svgPattern } from '$components/canvas/inpainting/constants/main';
import {
	getBrushIndicatorCircleFillColor,
	getBrushIndicatorCircleStrokeColor
} from '$components/canvas/inpainting/helpers/getBrushIndicatorCircle';
import type { TAvailableTheme } from '$ts/stores/theme';

export function getSvgPatternFg(theme: TAvailableTheme | null) {
	const current = getBrushIndicatorCircleFillColor(theme);
	return `rgba(${current}, 1)`;
}

export function getSvgPatternBg(theme: TAvailableTheme | null) {
	const current = getBrushIndicatorCircleStrokeColor(theme);
	return `rgba(${current}, 1)`;
}
export function getColoredSvgPattern(fg: string, bg: string) {
	return `data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">${svgPattern}`
		.replaceAll('black', fg)
		.replaceAll('white', bg);
}
