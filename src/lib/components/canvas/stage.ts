import { disableSelectionRect, enableSelectionRect } from '$components/canvas/selectionRect';
import { limitedScale, type IXY } from '$components/canvas/utils';
import type Konva from 'konva';

const zoomSpeed = 0.6;
const zoomSpeedMultiplier = 0.01;

export const makeStageInteractive = (stage: Konva.Stage, selectionRect: Konva.Rect) => {
	// Spacebar pan
	window.addEventListener('keydown', (e) => {
		if (e.key === ' ' && !stage.draggable()) {
			disableSelectionRect(selectionRect);
			stage.draggable(true);
			document.body.style.cursor = 'grabbing';
		}
	});
	window.addEventListener('keyup', (e) => {
		if (e.key === ' ' && stage.draggable()) {
			enableSelectionRect(selectionRect);
			stage.draggable(false);
			document.body.style.cursor = 'default';
		}
	});
	// Middle click pan
	stage.on('mousedown', (e) => {
		if (e.evt.button === 1 && !stage.draggable()) {
			disableSelectionRect(selectionRect);
			stage.draggable(true);
			document.body.style.cursor = 'grabbing';
		}
	});
	stage.on('mouseup', (e) => {
		if (e.evt.button === 1 && stage.draggable()) {
			enableSelectionRect(selectionRect);
			stage.draggable(false);
			document.body.style.cursor = 'default';
		}
	});
	// Wheel pan and pitch (also for touchpads)
	stage.on('wheel', (e) => {
		e.evt.preventDefault();
		if (!stage) return;
		if (e.evt.ctrlKey || e.evt.metaKey) {
			// Pinch
			const { position, scale } = getWheelPinchResult(e.evt, stage);
			stage.position(position);
			stage.scale(scale);
			stage.batchDraw();
		} else {
			// Pan
			const pos = getWheelPanResult(e.evt, stage);
			stage.position(pos);
			stage.batchDraw();
		}
	});
};

export const getWheelPinchResult = (
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

export const getWheelPanResult = (e: WheelEvent, stage: Konva.Stage): IXY => {
	const deltaY = e.deltaY;
	const deltaX = e.deltaX;
	const oldX = stage.x();
	const oldY = stage.y();
	const newX = oldX - deltaX;
	const newY = oldY - deltaY;
	return { x: newX, y: newY };
};
