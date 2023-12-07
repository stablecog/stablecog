import type { Group } from 'konva/lib/Group';
import type { Shape, ShapeConfig } from 'konva/lib/Shape';

export type TTool = 'brush' | 'eraser';

export interface TInpaintingState {
	mainLayerChildren: (Group | Shape<ShapeConfig>)[];
}
