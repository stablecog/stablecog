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
	let stageWidth: number;
	let stageHeight: number;
	let lastLine: Konva.Line;
	let selectedTool: Writable<TTool> = writable('brush');
	let isPainting = false;

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
		stage.add(mainLayer);

		history.addEntry({ mainLayerChildren: [] });

		console.log($history);

		stage.on('mousedown touchstart', function (e) {
			isPainting = true;
			const pos = stage.getPointerPosition();
			if (!pos) return;
			lastLine = new Konva.Line({
				stroke: '#df4b26',
				strokeWidth: 8,
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
			if (!isPainting) return;

			// prevent scrolling on touch devices
			e.evt.preventDefault();

			const pos = stage.getPointerPosition();
			if (!pos) return;
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
</script>

<div
	bind:clientWidth={stageWidth}
	bind:clientHeight={stageHeight}
	class="w-full h-full absolute left-0 top-0 flex flex-col overflow-hidden"
>
	<div class="absolute left-0 top-0 flex z-10 p-1.5">
		<Toolbar {selectedTool} {onUndo} {onRedo} undoDisabled={!$hasUndo} redoDisabled={!$hasRedo} />
	</div>
	<div id="konva-stage" />
</div>
