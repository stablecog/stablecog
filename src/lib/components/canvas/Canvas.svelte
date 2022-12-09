<script lang="ts">
	import SubtleButton from '$components/buttons/SubtleButton.svelte';
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
		stage.add(imageLayer);
		selectionRect = new konva.Rect(selectionRectStartConfig(stage));
		makeDraggableWithSnap(selectionRect, stage);
		addSelectionRectDragStyles(selectionRect, konva);
		mainLayer.add(selectionRect);
		stage.add(mainLayer);
		stage.batchDraw();
		makeStageInteractive(stage, selectionRect, bgGridGroup);
	});
</script>

<div bind:clientWidth bind:clientHeight class="w-full flex flex-1 relative">
	<div id="canvas-container" class="w-full flex-1 bg-c-bg ring-2 ring-c-bg-secondary z-10" />
</div>
