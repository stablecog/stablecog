import { snapToGrid } from '$components/canvas/utils';
import type Konva from 'konva';

export function makeDraggableWithSnap(shape: Konva.Shape, stage: Konva.Stage) {
	shape.on('dragmove', (e) => {
		const pos = e.target.position();
		const posSnapped = snapToGrid({ x: pos.x, y: pos.y }, stage);
		e.target.position(posSnapped);
	});
}
