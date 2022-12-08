import { gridSize, stageScaleMax } from '$components/canvas/constants';
import { makeMultipleOfGrid, stageCenteredPos } from '$components/canvas/utils';
import type Konva from 'konva';

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
	for (let i = 0; i < bgGridGroupDimensions.w; i += gridSize) {
		const line = new konva.Line({
			points: [i, 0, i, bgGridGroupDimensions.h],
			stroke: 'rgba(255, 255, 255, 0.04)',
			strokeWidth: 4,
			dash: [0, gridSize],
			lineJoin: 'round',
			lineCap: 'round'
		});
		bgGridGroup.add(line);
	}
	return bgGridGroup;
};
