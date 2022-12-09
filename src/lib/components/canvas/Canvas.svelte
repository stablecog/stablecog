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

	onMount(async () => {
		konva = (await import('konva')).default;
		stage = new konva.Stage({
			container: 'canvas-container',
			width: clientWidth,
			height: clientHeight,
			draggable: true
		});

		bgLayer = new konva.Layer({});
		bgGridGroup = makeBgGridGroup(stage, konva);
		bgLayer.add(bgGridGroup);
		stage.add(bgLayer);

		imageLayer = new konva.Layer({});
		stage.add(imageLayer);

		mainLayer = new konva.Layer({});
		selectionRect = new konva.Rect(selectionRectStartConfig(stage));
		makeDraggableWithSnap(selectionRect, stage);
		addSelectionRectDragStyles(selectionRect, konva);
		mainLayer.add(selectionRect);
		stage.add(mainLayer);

		makeStageInteractive(stage, selectionRect, bgGridGroup);
		stage.batchDraw();
	});
</script>

<div bind:clientWidth bind:clientHeight class="w-full flex flex-1 relative">
	<div id="canvas-container" class="w-full flex-1 bg-c-bg ring-2 ring-c-bg-secondary z-10" />
</div>
