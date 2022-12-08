import { limitedScale, type IXY } from '$components/canvas/utils';
import type Konva from 'konva';

const zoomSpeed = 0.6;
const zoomSpeedMultiplier = 0.01;

export const makeStageInteractive = (stage: Konva.Stage) => {
	stage.on('wheel', (e) => {
		e.evt.preventDefault();
		console.log(stage.position());
		if (!stage) return;
		if (e.evt.ctrlKey) {
			// Pinch
			const { position, scale } = getPinchResult(e.evt, stage);
			stage.position(position);
			stage.scale(scale);
			stage.batchDraw();
		} else {
			// Pan
			const pos = getPanResult(e.evt, stage);
			stage.position(pos);
			stage.batchDraw();
		}
	});
};

export const getPinchResult = (
	e: WheelEvent,
	stage: Konva.Stage
): { position: IXY; scale: IXY } => {
	const pointerPosition = stage.getPointerPosition();
	if (!pointerPosition)
		return {
			position: { x: stage.x(), y: stage.y() },
			scale: { x: stage.scaleX(), y: stage.scaleY() }
		};

	const oldScale = stage.scaleX();
	const deltaY = e.deltaY;
	const newScale = limitedScale(oldScale - deltaY / (1 / (zoomSpeed * zoomSpeedMultiplier)));
	const newX =
		pointerPosition.x -
		((pointerPosition.x - stage.x()) / oldScale) *
			limitedScale(oldScale - deltaY / (1 / (zoomSpeed * zoomSpeedMultiplier)));
	const newY =
		pointerPosition.y -
		((pointerPosition.y - stage.y()) / oldScale) *
			limitedScale(oldScale - deltaY / (1 / (zoomSpeed * zoomSpeedMultiplier)));

	return { position: { x: newX, y: newY }, scale: { x: newScale, y: newScale } };
};

export const getPanResult = (e: WheelEvent, stage: Konva.Stage): IXY => {
	const deltaY = e.deltaY;
	const deltaX = e.deltaX;
	const oldX = stage.x();
	const oldY = stage.y();
	const newX = oldX - deltaX;
	const newY = oldY - deltaY;
	return { x: newX, y: newY };
};
