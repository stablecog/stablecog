import { stageScaleMax } from '$components/canvas/constants';
import { makeMultipleOfGrid, stageCenteredPos } from '$components/canvas/utils';
import type Konva from 'konva';

const gridColor = 'rgba(219, 213, 231, 0.05)';
export const gridSize = 64;
export const bgGridStrokeWidth = 4;

export const makeBgGridGroup = (stage: Konva.Stage, konva: typeof Konva) => {
	const bgGridGroupDimensions = {
		w: makeMultipleOfGrid(stage.width() * stageScaleMax * 3, true),
		h: makeMultipleOfGrid(stage.height() * stageScaleMax * 3, true)
	};
	const bgGridGroupPos = stageCenteredPos(bgGridGroupDimensions, stage);
	const bgGridGroup = new konva.Group({
		x: bgGridGroupPos.x,
		y: bgGridGroupPos.y
	});
	let [w, h] = [bgGridGroupDimensions.w, bgGridGroupDimensions.h];
	if (w > h) {
		for (let i = 0; i < h; i += gridSize) {
			const line = new konva.Line({
				points: [0, i, w, i],
				stroke: gridColor,
				strokeWidth: limitedBgGridStrokeWidth(stage.scaleX()),
				dash: [0, gridSize],
				lineJoin: 'round',
				lineCap: 'round'
			});
			bgGridGroup.add(line);
		}
	} else {
		for (let i = 0; i < w; i += gridSize) {
			const line = new konva.Line({
				points: [i, 0, i, h],
				stroke: gridColor,
				strokeWidth: limitedBgGridStrokeWidth(stage.scaleX()),
				dash: [0, gridSize],
				lineJoin: 'round',
				lineCap: 'round'
			});
			bgGridGroup.add(line);
		}
	}
	return bgGridGroup;
};

export const limitedBgGridStrokeWidth = (scale: number) => {
	return Math.min(
		Math.max(bgGridStrokeWidth / scale, bgGridStrokeWidth / 1.25),
		bgGridStrokeWidth * 2
	);
};
