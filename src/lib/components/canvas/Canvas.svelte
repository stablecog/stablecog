<script lang="ts">
	import type Konva from 'konva';
	import { onMount } from 'svelte';

	let clientWidth: number;
	let clientHeight: number;
	let konva: typeof Konva;
	let stage: Konva.Stage;
	let rect: Konva.Rect;
	let rectColor = 'rgba(174, 133, 235, 1)';
	let rectWidth = 512;
	let rectHeight = 512;
	let mainLayer: Konva.Layer;
	const stateScaleMin = 0.3;
	const stateScaleMax = 2;
	const zoomSpeed = 0.6;
	const zoomSpeedMultiplier = 0.01;

	const limitedScale = (scale: number) => {
		if (scale < stateScaleMin) {
			return stateScaleMin;
		}
		if (scale > stateScaleMax) {
			return stateScaleMax;
		}
		return scale;
	};

	onMount(async () => {
		konva = (await import('konva')).default;
		stage = new konva.Stage({
			container: 'canvas-container',
			width: clientWidth,
			height: clientHeight
		});
		mainLayer = new konva.Layer({});
		rect = new konva.Rect({
			x: clientWidth / 2 - rectWidth / 2,
			y: clientHeight / 2 - rectHeight / 2,
			width: rectWidth,
			height: rectHeight,
			stroke: rectColor,
			strokeWidth: 3,
			dash: [8, 8],
			draggable: true
		});
		mainLayer.add(rect);
		stage.add(mainLayer);
		stage.batchDraw();
		stage.on('wheel', (e) => {
			e.evt.preventDefault();
			if (!stage) {
				return;
			}
			const ptPos = stage.getPointerPosition();
			if (ptPos === null) return;
			if (e.evt.ctrlKey) {
				// Pinch
				const oldScale = stage.scaleX();
				const deltaY = e.evt.deltaY;
				const newScale = limitedScale(oldScale - deltaY / (1 / (zoomSpeed * zoomSpeedMultiplier)));
				const newX =
					ptPos.x -
					((ptPos.x - stage.x()) / oldScale) *
						limitedScale(oldScale - deltaY / (1 / (zoomSpeed * zoomSpeedMultiplier)));
				const newY =
					ptPos.y -
					((ptPos.y - stage.y()) / oldScale) *
						limitedScale(oldScale - deltaY / (1 / (zoomSpeed * zoomSpeedMultiplier)));
				stage.position({
					x: newX,
					y: newY
				});
				stage.scale({
					x: newScale,
					y: newScale
				});
				stage.batchDraw();
			} else {
				// Pan
				const deltaY = e.evt.deltaY;
				const deltaX = e.evt.deltaX;
				const oldX = stage.x();
				const oldY = stage.y();
				const newX = oldX - deltaX;
				const newY = oldY - deltaY;
				stage.position({ x: newX, y: newY });
				stage.batchDraw();
			}
		});
	});
</script>

<div
	bind:clientWidth
	bind:clientHeight
	id="canvas-container"
	class="w-full flex-1 bg-c-bg ring-2 ring-c-bg-secondary"
/>
