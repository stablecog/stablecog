import { transitionDuration } from '$components/canvas/constants';
import { stageCenteredPos } from '$components/canvas/utils';
import type Konva from 'konva';

export const selectionRectStrokeWidth = 3;
export const selectionRectColor = 'rgba(174, 133, 235, 0.5)';
export const selectionRectHoverColor = 'rgba(174, 133, 235, 1)';
export const selectionRectGrabbedColor = 'rgba(255, 174, 116, 1)';
export const selectionRectStartWidth = 512;
export const selectionRectStartHeight = 512;
export const selectionRectDashOffset = 4;
export const selectionRectDashSize = 8;
export const selectionRectDashAnimVelocity = 50;

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
		dashOffset: selectionRectDashOffset,
		dash: [selectionRectDashSize, selectionRectDashSize],
		draggable: true
	};
	return config;
};

let anim: Konva.Animation;

export function addSelectionRectDragStyles(shape: Konva.Shape, konva: typeof Konva) {
	anim = new konva.Animation(function (frame) {
		if (!frame) return;
		shape.dashOffset(shape.dashOffset() - (frame.timeDiff / 1000) * selectionRectDashAnimVelocity);
	});
	shape.on('mouseover', () => {
		anim.start();
		document.body.style.cursor = 'grab';
		shape.to({
			duration: transitionDuration,
			stroke: selectionRectHoverColor
		});
	});
	shape.on('mouseout', () => {
		if (shape.listening() === false) return;
		anim.stop();
		document.body.style.cursor = 'default';
		shape.to({
			stroke: selectionRectColor,
			duration: transitionDuration,
			dashOffset: nearestRoundDashOffset(shape.dashOffset())
		});
	});
	shape.on('mousedown', (e) => {
		anim.stop();
		document.body.style.cursor = 'grabbing';
		shape.to({
			stroke: selectionRectGrabbedColor,
			duration: transitionDuration,
			dashOffset: nearestRoundDashOffset(shape.dashOffset())
		});
	});
	shape.on('mouseup', () => {
		anim.start();
		document.body.style.cursor = 'grab';
		shape.to({
			duration: transitionDuration,
			stroke: selectionRectHoverColor
		});
	});
}

export const disableSelectionRect = (shape: Konva.Shape) => {
	shape.listening(false);
	shape.draggable(false);
	anim.stop();
	shape.to({
		duration: transitionDuration,
		stroke: selectionRectColor,
		dashOffset: nearestRoundDashOffset(shape.dashOffset())
	});
};

export const enableSelectionRect = (shape: Konva.Shape) => {
	shape.listening(true);
	shape.draggable(true);
};

export const nearestRoundDashOffset = (offset: number) => {
	const offsetMod = offset % (selectionRectDashSize * 2);
	const wantedResult = selectionRectDashOffset - selectionRectDashSize * 2;
	let addition = wantedResult - offsetMod;
	if (addition > 0) addition -= selectionRectDashSize * 2;
	return offset + addition;
};
