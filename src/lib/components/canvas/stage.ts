import { limitedBgGridStrokeWidth } from '$components/canvas/bgGrid';
import { disableSelectionRect, enableSelectionRect } from '$components/canvas/selectionRect';
import { limitedScale } from '$components/canvas/utils';
import type Konva from 'konva';
import type { Vector2d } from 'konva/lib/types';

const zoomSpeed = 0.6;
const zoomSpeedMultiplier = 0.01;
export const stageScaleMin = 0.3;
export const stageScaleMax = 2;

export const makeStageInteractive = (
	stage: Konva.Stage,
	selectionRect: Konva.Rect,
	bgGridGroup: Konva.Group
) => {
	// Spacebar pan
	window.addEventListener('keydown', (e) => {
		if (e.key === ' ') {
			disableSelectionRect(selectionRect);
			document.body.style.cursor = 'grabbing';
		}
	});
	window.addEventListener('keyup', (e) => {
		if (e.key === ' ') {
			enableSelectionRect(selectionRect);
			document.body.style.cursor = 'default';
		}
	});
	// Middle click pan
	stage.on('mousedown', (e) => {
		document.body.style.cursor = 'grabbing';
		if (e.evt.button === 1) {
			disableSelectionRect(selectionRect);
		}
	});
	stage.on('mouseup', (e) => {
		document.body.style.cursor = 'default';
		if (e.evt.button === 1) {
			enableSelectionRect(selectionRect);
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
			bgGridGroup.children?.forEach((child) => {
				const l = child as Konva.Line;
				l.strokeWidth(limitedBgGridStrokeWidth(stage.scaleX()));
			});
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
): { position: Vector2d; scale: Vector2d } => {
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

export const getWheelPanResult = (e: WheelEvent, stage: Konva.Stage): Vector2d => {
	const deltaY = e.deltaY;
	const deltaX = e.deltaX;
	const oldX = stage.x();
	const oldY = stage.y();
	const newX = oldX - deltaX;
	const newY = oldY - deltaY;
	return { x: newX, y: newY };
};
