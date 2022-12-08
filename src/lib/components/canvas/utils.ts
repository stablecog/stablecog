import { gridSize } from '$components/canvas/bgGrid';
import { stageScaleMax, stageScaleMin } from '$components/canvas/constants';
import type Konva from 'konva/lib/Stage';

export const limitedScale = (scale: number) => {
	if (scale < stageScaleMin) {
		return stageScaleMin;
	}
	if (scale > stageScaleMax) {
		return stageScaleMax;
	}
	return scale;
};

export const snapToGrid = (coordinate: IXY, stage: Konva.Stage) => {
	const stageCenterRemainder = {
		x: (stage.width() / 2) % gridSize,
		y: (stage.height() / 2) % gridSize
	};
	return {
		x:
			Math.round((coordinate.x - stageCenterRemainder.x) / gridSize) * gridSize +
			stageCenterRemainder.x,
		y:
			Math.round((coordinate.y - stageCenterRemainder.y) / gridSize) * gridSize +
			stageCenterRemainder.y
	};
};

export const stageCenteredPos = (size: ISize, stage: Konva.Stage) => {
	return {
		x: stage.width() / 2 - size.w / 2,
		y: stage.height() / 2 - size.h / 2
	};
};

export interface IXY {
	x: number;
	y: number;
}

export interface ISize {
	w: number;
	h: number;
}

export const makeMultipleOfGrid = (n: number, even = false) => {
	const r = Math.ceil(n / gridSize);
	return (r + (even && r % 2 !== 0 ? 1 : 0)) * gridSize;
};
