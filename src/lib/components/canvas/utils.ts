import { gridSize } from '$components/canvas/bgGrid';
import { stageScaleMax, stageScaleMin } from '$components/canvas/stage';
import type Konva from 'konva';
import type { Vector2d } from 'konva/lib/types';

export const limitedScale = (scale: number) => {
	if (scale < stageScaleMin) {
		return stageScaleMin;
	}
	if (scale > stageScaleMax) {
		return stageScaleMax;
	}
	return scale;
};

export const snapToGrid = (coordinate: Vector2d, stage: Konva.Stage) => {
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

export const stageCenteredPosition = (size: Vector2d, stage: Konva.Stage) => {
	return {
		x: stage.width() / 2 - size.x / 2,
		y: stage.height() / 2 - size.y / 2
	};
};

export const makeMultipleOfGrid = (n: number, even = false) => {
	const r = Math.ceil(n / gridSize);
	return (r + (even && r % 2 !== 0 ? 1 : 0)) * gridSize;
};
