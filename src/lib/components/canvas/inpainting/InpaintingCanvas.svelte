<script lang="ts">
	import Toolbar from '$components/canvas/toolbar/Toolbar.svelte';
	import type { TInpaintingState, TTool } from '$components/canvas/toolbar/types';
	import Konva from 'konva';
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { copy } from 'copy-anything';
	import { createHistoryStore } from '$components/canvas/history/historyStore';
	import { theme } from '$ts/stores/theme';
	import {
		getBrushCircleFill,
		getBrushCircleRadius,
		getBrushCircleStroke,
		getBrushConfig,
		getBrushSize,
		getCanvasMinSize,
		getDrawingLineStroke,
		getPrimaryColor
	} from '$components/canvas/helpers/main';
	import { exportStage } from '$components/canvas/helpers/exportStage';

	const stageId = 'konva-stage';
	const stageForExportId = 'konva-stage-export';

	let stage: Konva.Stage;
	let imageLayer: Konva.Layer;
	let paintLayer: Konva.Layer;
	let brushIndicatorLayer: Konva.Layer;
	let brushCircle: Konva.Circle;

	const exampleImageUrl = 'https://b.stablecog.com/c7ec87bc-7908-45a5-879a-e7363f2c3df9.jpeg';

	let canvasWidth: number | undefined = undefined;
	let canvasHeight: number | undefined = undefined;

	let lastLine: Konva.Line;
	let selectedTool: Writable<TTool> = writable('brush');
	let isPainting = false;

	let canvasMinSize = getCanvasMinSize(canvasWidth, canvasHeight);
	let brushConfig = getBrushConfig(canvasMinSize);
	let brushSize = getBrushSize(brushConfig);

	let currentPrimary = getPrimaryColor($theme);

	$: {
		if (brushCircle) {
			brushCircle.stroke(getBrushCircleStroke(currentPrimary));
			brushCircle.fill(getBrushCircleFill(currentPrimary));
		}
	}

	$: {
		if (paintLayer) {
			paintLayer.children.forEach((c) => {
				if (c instanceof Konva.Line) c.stroke(getBrushCircleStroke(currentPrimary));
			});
		}
	}

	$: {
		if (canvasWidth && canvasHeight && canvasMinSize) {
			brushConfig = getBrushConfig(canvasMinSize);
		}
	}

	$: currentPrimary = getPrimaryColor($theme);
	$: canvasMinSize = getCanvasMinSize(canvasWidth, canvasHeight);
	$: brushConfig, onBrushConfigChanged();
	$: brushSize, onBrushSizeChanged();
	$: {
		if (brushCircle) {
			if ($selectedTool === 'eraser') {
				brushCircle.dashEnabled(true);
				brushCircle.fillEnabled(false);
			} else {
				brushCircle.dashEnabled(false);
				brushCircle.fillEnabled(true);
			}
		}
	}

	let {
		history,
		hasUndo,
		hasRedo,
		currentState: historyCurrentState
	} = createHistoryStore<TInpaintingState>();

	onMount(() => {
		stage = new Konva.Stage({
			container: 'konva-stage',
			width: canvasWidth,
			height: canvasHeight
		});
		imageLayer = new Konva.Layer();
		paintLayer = new Konva.Layer();
		paintLayer.getCanvas()._canvas.style.opacity = '0.75';
		brushIndicatorLayer = new Konva.Layer();
		stage.add(imageLayer);
		stage.add(paintLayer);
		stage.add(brushIndicatorLayer);

		const imageObj = new Image();
		imageObj.onload = function () {
			const image = new Konva.Image({
				x: 0,
				y: 0,
				image: imageObj,
				width: stage.width(),
				height: stage.height()
			});
			imageLayer.add(image);
		};
		imageObj.src = exampleImageUrl;

		history.addEntry({ paintLayerChildren: [] });

		brushCircle = new Konva.Circle({
			x: stage.width() / 2,
			y: stage.height() / 2,
			radius: getBrushCircleRadius(brushSize),
			stroke: getBrushCircleStroke(currentPrimary),
			strokeWidth: 2,
			visible: false,
			fillEnabled: true,
			dashEnabled: false,
			fill: getBrushCircleFill(currentPrimary),
			dash: [4, 4],
			lineCap: 'round',
			lineJoin: 'round'
		});

		brushIndicatorLayer.add(brushCircle);

		stage.on('mousedown touchstart', function (e) {
			isPainting = true;
			const pos = stage.getPointerPosition();
			if (!pos) return;
			lastLine = new Konva.Line({
				stroke: getDrawingLineStroke(currentPrimary),
				strokeWidth: brushSize,
				globalCompositeOperation: $selectedTool === 'brush' ? 'source-over' : 'destination-out',
				lineCap: 'round',
				lineJoin: 'round',
				points: [pos.x, pos.y, pos.x, pos.y]
			});
			paintLayer.add(lastLine);
		});

		stage.on('mouseup touchend', function () {
			isPainting = false;
			const paintLayerChildren = copy(paintLayer.getChildren());
			history.addEntry({ paintLayerChildren });
		});

		stage.on('mousemove touchmove', function (e) {
			console.log('mousemove');
			const pos = stage.getPointerPosition();
			if (!pos) return;

			brushCircle.visible(true);
			brushCircle.position(pos);

			if (!isPainting) return;

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
		paintLayer.destroyChildren();

		const children = newState.paintLayerChildren;
		children.forEach((child) => {
			const node = Konva.Node.create(child);
			paintLayer.add(node);
		});

		paintLayer.draw();
	}

	function onBrushSizeChanged() {
		if (!brushCircle) return;
		resetBrushCirclePosition();
		setBrushCircleSize();
	}

	function resetBrushCirclePosition() {
		if (!brushCircle) return;
		brushCircle.position({ x: stage.width() / 2, y: stage.height() / 2 });
		brushIndicatorLayer.draw();
	}

	function setBrushCircleSize() {
		if (!brushCircle) return;
		brushCircle.radius(getBrushCircleRadius(brushSize));
		brushIndicatorLayer.draw();
	}

	function onBrushConfigChanged() {
		brushSize = (brushConfig.max - brushConfig.min) / 2 + brushConfig.min;
	}
</script>

<div class="w-full h-full absolute left-0 top-0 flex flex-col overflow-hidden">
	<div class="flex z-10">
		<Toolbar
			{selectedTool}
			{onUndo}
			{onRedo}
			undoDisabled={!$hasUndo}
			redoDisabled={!$hasRedo}
			bind:brushSize
			{brushConfig}
			onDownloadClicked={() => {
				exportStage({ layer: paintLayer, stage: stage, container: stageForExportId });
			}}
		/>
	</div>
	<div class="w-full h-4" />
	<div
		bind:clientWidth={canvasWidth}
		bind:clientHeight={canvasHeight}
		class="w-full flex-1 overflow-hidden"
	>
		<div style="width: {canvasWidth}px; height: {canvasHeight}px" id={stageId} />
	</div>
	<div class="w-0 h-0 overflow-hidden" id={stageForExportId} />
</div>
