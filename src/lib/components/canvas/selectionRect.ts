import { transitionDuration } from '$components/canvas/constants';
import { stageCenteredPos } from '$components/canvas/utils';
import type Konva from 'konva';

export const selectionRectStrokeWidth = 3;
export const selectionRectColor = 'rgba(174, 133, 235, 0.5)';
export const selectionRectHoverColor = 'rgba(174, 133, 235, 1)';
export const selectionRectGrabbedColor = 'rgba(255, 174, 116, 1)';
export const selectionRectStartWidth = 512;
export const selectionRectStartHeight = 512;

export const selectionRectStartConfig = (stage: Konva.Stage) => {
	const rectPos = stageCenteredPos(
		{ w: selectionRectStartWidth, h: selectionRectStartHeight },
		stage
	);
	const config: Konva.RectConfig | undefined = {
		x: rectPos.x,
		y: rectPos.y,
		width: selectionRectStartWidth,
		height: selectionRectStartHeight,
		stroke: selectionRectColor,
		strokeWidth: selectionRectStrokeWidth,
		lineCap: 'round',
		lineJoin: 'round',
		dashOffset: 4,
		dash: [8, 8],
		draggable: true
	};
	return config;
};

export function addSelectionRectDragStyles(shape: Konva.Shape) {
	shape.on('mouseover', () => {
		document.body.style.cursor = 'grab';
		shape.to({
			duration: transitionDuration,
			stroke: selectionRectHoverColor
		});
	});
	shape.on('mouseout', () => {
		document.body.style.cursor = 'default';
		shape.to({
			duration: transitionDuration,
			stroke: selectionRectColor
		});
	});
	shape.on('mousedown', () => {
		document.body.style.cursor = 'grabbing';
		shape.to({
			duration: transitionDuration,
			stroke: selectionRectGrabbedColor
		});
	});
	shape.on('mouseup', () => {
		document.body.style.cursor = 'grab';
		shape.to({
			duration: transitionDuration,
			stroke: selectionRectHoverColor
		});
	});
}
