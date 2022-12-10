import { transitionDuration } from '$components/canvas/constants';
import { stageCenteredPosition } from '$components/canvas/utils';
import type Konva from 'konva';

export const selectionRectStrokeWidth = 3;
export const selectionRectStrokeWidthHovered = 5;
export const selectionRectStrokeWidthGrabbed = 3;
export const selectionRectColor = 'rgba(174, 133, 235, 0.75)';
export const selectionRectHoverColor = 'rgba(174, 133, 235, 1)';
export const selectionRectGrabbedColor = 'rgba(255, 174, 116, 1)';
export const selectionRectStartWidth = 512;
export const selectionRectStartHeight = 512;
export const selectionRectDashOffset = 4;
export const selectionRectDashSize = 8;
export const selectionRectDashAnimVelocity = 50;

export const selectionRectStartConfig = (stage: Konva.Stage) => {
	const rectPos = stageCenteredPosition(
		{ x: selectionRectStartWidth, y: selectionRectStartHeight },
		stage
	);
	const config: Konva.RectConfig | undefined = {
		x: rectPos.x,
		y: rectPos.y,
		width: selectionRectStartWidth,
		height: selectionRectStartHeight,
		stroke: selectionRectColor,
		strokeWidth: selectionRectStrokeWidth,
		strokeScaleEnabled: false,
		draggable: true
	};
	return config;
};

export function addSelectionRectDragStyles(shape: Konva.Shape) {
	shape.on('mouseover', () => {
		document.body.style.cursor = 'grab';
		shape.to({
			duration: transitionDuration,
			stroke: selectionRectHoverColor,
			strokeWidth: selectionRectStrokeWidthHovered
		});
	});
	shape.on('mouseout', () => {
		if (shape.listening() === false) return;
		document.body.style.cursor = 'default';
		shape.to({
			stroke: selectionRectColor,
			duration: transitionDuration,
			strokeWidth: selectionRectStrokeWidth
		});
	});
	shape.on('mousedown', (e) => {
		document.body.style.cursor = 'grabbing';
		shape.to({
			stroke: selectionRectGrabbedColor,
			duration: transitionDuration,
			strokeWidth: selectionRectStrokeWidthGrabbed
		});
	});
	shape.on('mouseup', () => {
		document.body.style.cursor = 'grab';
		shape.to({
			duration: transitionDuration,
			stroke: selectionRectHoverColor,
			strokeWidth: selectionRectStrokeWidthHovered
		});
	});
}

export const disableSelectionRect = (shape: Konva.Shape) => {
	shape.listening(false);
	shape.draggable(false);
	shape.to({
		duration: transitionDuration,
		stroke: selectionRectColor,
		strokeWidth: selectionRectStrokeWidth
	});
};

export const enableSelectionRect = (shape: Konva.Shape) => {
	shape.listening(true);
	shape.draggable(true);
};
