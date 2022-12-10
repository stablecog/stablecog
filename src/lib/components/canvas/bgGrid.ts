import { stageScaleMax, stageScaleMin } from '$components/canvas/stage';
import { makeMultipleOfGrid, stageCenteredPosition } from '$components/canvas/utils';
import type Konva from 'konva';

const gridColor = 'rgba(219, 213, 231, 0.05)';
export const gridSize = 64;
export const bgGridStrokeWidth = 4;

export const setUpBgGridGroup = (
	bgGridGroup: Konva.Group,
	stage: Konva.Stage,
	konva: typeof Konva
) => {
	const biggerDimension = stage.width() > stage.height() ? stage.width() : stage.height();
	const dimensionScaled = makeMultipleOfGrid(biggerDimension * stageScaleMax * 3, true);

	const bgGridGroupDimensions = {
		x: dimensionScaled,
		y: dimensionScaled
	};

	bgGridGroup.position(stageCenteredPosition(bgGridGroupDimensions, stage));

	let w = bgGridGroupDimensions.x;

	for (let i = 0; i < w; i += gridSize) {
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
};

export const limitedBgGridStrokeWidth = (scale: number) => {
	const minWidth = bgGridStrokeWidth / 1.25;
	const maxWidth = bgGridStrokeWidth * 2;
	const progress = 1 - (scale - stageScaleMin) / (stageScaleMax - stageScaleMin);
	return minWidth + (maxWidth - minWidth) * progress;
};
