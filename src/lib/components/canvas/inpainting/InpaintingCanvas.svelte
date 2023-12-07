<script lang="ts">
	import Toolbar from '$components/canvas/toolbar/Toolbar.svelte';
	import type { TInpaintingState, TTool } from '$components/canvas/toolbar/types';
	import Konva from 'konva';
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { copy } from 'copy-anything';

	let stage: Konva.Stage;
	let mainLayer: Konva.Layer;
	let stageWidth: number;
	let stageHeight: number;
	let lastLine: Konva.Line;
	let selectedTool: Writable<TTool> = writable('brush');
	let isPainting = false;

	let history: TInpaintingState[] = [];
	let historyStep = 0;

	onMount(() => {
		stage = new Konva.Stage({
			container: 'konva-stage',
			width: stageWidth,
			height: stageHeight
		});
		mainLayer = new Konva.Layer();
		stage.add(mainLayer);

		history = [
			{
				mainLayerChildren: copy(mainLayer.getChildren())
			}
		];

		stage.on('mousedown touchstart', function (e) {
			isPainting = true;
			const pos = stage.getPointerPosition();
			if (!pos) return;
			lastLine = new Konva.Line({
				stroke: '#df4b26',
				strokeWidth: 5,
				globalCompositeOperation: $selectedTool === 'brush' ? 'source-over' : 'destination-out',
				lineCap: 'round',
				lineJoin: 'round',
				points: [pos.x, pos.y, pos.x, pos.y]
			});
			mainLayer.add(lastLine);
		});

		stage.on('mouseup touchend', function () {
			isPainting = false;
			addToHistory();
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
		if (historyStep === 0) return;
		historyStep -= 1;
		const prev = history[historyStep];
		setInpaintingState(prev);
	}

	function onRedo() {
		if (historyStep === history.length - 1) return;
		historyStep += 1;
		const next = history[historyStep];
		setInpaintingState(next);
	}

	function addToHistory() {
		if (historyStep < history.length - 1) {
			history = history.slice(0, historyStep + 1);
		}
		const mainLayerChildren = copy(mainLayer.getChildren());
		history = [
			...history,
			{
				mainLayerChildren
			}
		];
		historyStep++;
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
		<Toolbar
			{selectedTool}
			{onUndo}
			{onRedo}
			undoDisabled={historyStep <= 0}
			redoDisabled={historyStep >= history.length - 1}
		/>
	</div>
	<div id="konva-stage" />
</div>
