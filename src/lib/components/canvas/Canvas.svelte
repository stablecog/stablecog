<script lang="ts">
	import { setUpBgGridGroup } from '$components/canvas/bgGrid';
	import { makeShapeSnapOnDrag } from '$components/canvas/drag';
	import {
		addSelectionRectDragStyles,
		selectionRectStartConfig,
		selectionRectStartHeight,
		selectionRectStartWidth
	} from '$components/canvas/selectionRect';
	import { makeStageInteractive } from '$components/canvas/stage';
	import { redrawEverything } from '$components/canvas/utils';
	import type Konva from 'konva';
	import { onMount } from 'svelte';

	export let clientWidth: number;
	export let clientHeight: number;

	let konva: typeof Konva;
	let stage: Konva.Stage;
	let selectionRect: Konva.Rect;
	let selectionRectWidth = selectionRectStartWidth;
	let selectionRectHeight = selectionRectStartHeight;
	let bgLayer: Konva.Layer;
	let bgGridGroup: Konva.Group;
	let imageLayer: Konva.Layer;
	let mainLayer: Konva.Layer;

	$: redrawEverything(konva, stage, selectionRect, bgGridGroup, clientWidth, clientHeight);

	onMount(async () => {
		konva = (await import('konva')).default;
		stage = new konva.Stage({
			container: 'canvas-container',
			width: clientWidth,
			height: clientHeight,
			draggable: true
		});

		bgLayer = new konva.Layer({});
		bgGridGroup = new konva.Group();
		setUpBgGridGroup(bgGridGroup, stage, konva);
		bgLayer.add(bgGridGroup);
		stage.add(bgLayer);

		imageLayer = new konva.Layer({});
		stage.add(imageLayer);

		mainLayer = new konva.Layer({});
		selectionRect = new konva.Rect(selectionRectStartConfig(stage));
		makeShapeSnapOnDrag(selectionRect, stage);
		addSelectionRectDragStyles(selectionRect);
		mainLayer.add(selectionRect);
		stage.add(mainLayer);

		makeStageInteractive(stage, selectionRect, bgGridGroup);
		stage.batchDraw();
	});
</script>

<div class="relative h-full w-full">
	<div id="canvas-container" class="z-10 h-full w-full bg-c-bg ring-2 ring-c-bg-secondary" />
</div>
