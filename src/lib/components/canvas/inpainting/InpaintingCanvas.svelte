<script lang="ts">
	import Toolbar from '$components/canvas/toolbar/Toolbar.svelte';
	import type { TInpaintingState, TTool } from '$components/canvas/toolbar/types';
	import Konva from 'konva';
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { copy } from 'copy-anything';
	import { createHistoryStore } from '$components/canvas/history/historyStore';

	let stage: Konva.Stage;
	let mainLayer: Konva.Layer;
	let brushCircleLayer: Konva.Layer;
	let brushCircle: Konva.Circle;

	let stageWidth: number;
	let stageHeight: number;

	let canvasWidth: number;
	let canvasHeight: number;

	let lastLine: Konva.Line;
	let selectedTool: Writable<TTool> = writable('brush');
	let isPainting = false;

	$: brushSize = canvasWidth && canvasHeight ? Math.min(canvasWidth, canvasHeight) / 20 : 8;
	$: brushSize, onBrushSizeChanged(brushSize);

	let {
		history,
		hasUndo,
		hasRedo,
		currentState: historyCurrentState
	} = createHistoryStore<TInpaintingState>();

	onMount(() => {
		stage = new Konva.Stage({
			container: 'konva-stage',
			width: stageWidth,
			height: stageHeight
		});
		mainLayer = new Konva.Layer();
		brushCircleLayer = new Konva.Layer();
		stage.add(mainLayer);
		stage.add(brushCircleLayer);

		history.addEntry({ mainLayerChildren: [] });

		brushCircle = new Konva.Circle({
			x: stage.width() / 2,
			y: stage.height() / 2,
			radius: brushSize / 2, // Initial brush size
			stroke: 'green',
			visible: false // Initially hidden
		});

		brushCircleLayer.add(brushCircle);

		stage.on('mousedown touchstart', function (e) {
			isPainting = true;
			const pos = stage.getPointerPosition();
			if (!pos) return;
			lastLine = new Konva.Line({
				stroke: '#df4b26',
				strokeWidth: brushSize,
				globalCompositeOperation: $selectedTool === 'brush' ? 'source-over' : 'destination-out',
				lineCap: 'round',
				lineJoin: 'round',
				points: [pos.x, pos.y, pos.x, pos.y]
			});
			mainLayer.add(lastLine);
		});

		stage.on('mouseup touchend', function () {
			isPainting = false;
			const mainLayerChildren = copy(mainLayer.getChildren());
			history.addEntry({ mainLayerChildren });
		});

		// and core function - drawing
		stage.on('mousemove touchmove', function (e) {
			const pos = stage.getPointerPosition();
			if (!pos) return;

			brushCircle.visible(true); // Make the circle visible
			brushCircle.position(pos); // Update position

			if (!isPainting) return;

			// prevent scrolling on touch devices
			e.evt.preventDefault();

			const newPoints = lastLine.points().concat([pos.x, pos.y]);
			lastLine.points(newPoints);
		});
	});

	function onUndo() {
		history.undo();
		if ($historyCurrentState) setInpaintingState($historyCurrentState);
	}

	function onRedo() {
		history.redo();
		if ($historyCurrentState) setInpaintingState($historyCurrentState);
	}

	function setInpaintingState(newState: TInpaintingState) {
		mainLayer.destroyChildren();

		const children = newState.mainLayerChildren;
		children.forEach((child) => {
			const node = Konva.Node.create(child);
			mainLayer.add(node);
		});

		// Redraw the layer to update the canvas
		mainLayer.draw();
	}

	function onBrushSizeChanged(size: number) {
		if (!brushCircle) return;
		resetBrushCirclePosition();
		setBrushCircleSize(size);
	}

	function setBrushCircleSize(size: number) {
		if (!brushCircle) return;
		brushCircle.radius(size / 2);
		brushCircleLayer.draw();
	}

	function resetBrushCirclePosition() {
		if (!brushCircle) return;
		brushCircle.position({ x: stage.width() / 2, y: stage.height() / 2 });
		brushCircleLayer.draw();
	}
</script>

<div
	bind:clientWidth={stageWidth}
	bind:clientHeight={stageHeight}
	class="w-full h-full absolute left-0 top-0 flex flex-col overflow-hidden"
>
	<div class="flex z-10 p-1.5">
		<Toolbar
			{selectedTool}
			{onUndo}
			{onRedo}
			undoDisabled={!$hasUndo}
			redoDisabled={!$hasRedo}
			bind:brushSize
			{canvasWidth}
			{canvasHeight}
		/>
	</div>
	<div
		bind:clientWidth={canvasWidth}
		bind:clientHeight={canvasHeight}
		class="w-full flex-1 overflow-hidden"
	>
		<div style="width: {canvasWidth}px; height: {canvasHeight}px" id="konva-stage" />
	</div>
</div>
