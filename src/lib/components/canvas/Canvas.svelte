<script lang="ts">
	import { makeBgGridGroup } from '$components/canvas/bgGrid';
	import { makeDraggableWithSnap } from '$components/canvas/drag';
	import {
		addSelectionRectDragStyles,
		selectionRectStartConfig,
		selectionRectStartHeight,
		selectionRectStartWidth
	} from '$components/canvas/selectionRect';
	import { makeStageInteractive } from '$components/canvas/stage';
	import { stageCenteredPos } from '$components/canvas/utils';
	import type Konva from 'konva';
	import { onMount } from 'svelte';

	let clientWidth: number;
	let clientHeight: number;
	let konva: typeof Konva;
	let stage: Konva.Stage;
	let selectionRect: Konva.Rect;
	let selectionRectWidth = selectionRectStartWidth;
	let selectionRectHeight = selectionRectStartHeight;
	let bgLayer: Konva.Layer;
	let bgGridGroup: Konva.Group;
	let imageLayer: Konva.Layer;
	let mainLayer: Konva.Layer;
	let imageObj: HTMLImageElement;

	onMount(async () => {
		konva = (await import('konva')).default;
		bgLayer = new konva.Layer({});
		imageLayer = new konva.Layer({});
		mainLayer = new konva.Layer({});
		stage = new konva.Stage({
			container: 'canvas-container',
			width: clientWidth,
			height: clientHeight
		});
		bgGridGroup = makeBgGridGroup(stage, konva);
		bgLayer.add(bgGridGroup);
		stage.add(bgLayer);
		imageObj = new Image();
		imageObj.onload = () => {
			const pos = stageCenteredPos({ w: imageObj.width, h: imageObj.height }, stage);
			let img = new konva.Image({
				x: pos.x,
				y: pos.y,
				image: imageObj,
				width: imageObj.width,
				height: imageObj.height
			});
			imageLayer.add(img);
		};
		imageObj.src = '/example-generation.jpeg';
		stage.add(imageLayer);
		selectionRect = new konva.Rect(selectionRectStartConfig(stage));
		makeDraggableWithSnap(selectionRect, stage);
		addSelectionRectDragStyles(selectionRect);
		mainLayer.add(selectionRect);
		stage.add(mainLayer);
		stage.batchDraw();
		makeStageInteractive(stage);
	});
</script>

<div
	bind:clientWidth
	bind:clientHeight
	id="canvas-container"
	class="w-full flex-1 bg-c-bg ring-2 ring-c-bg-secondary"
/>
