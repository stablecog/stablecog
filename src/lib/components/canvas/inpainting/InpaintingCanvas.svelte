<script lang="ts">
	import Toolbar from '$components/canvas/toolbar/Toolbar.svelte';
	import type { TInpaintingState, TTool } from '$components/canvas/toolbar/types';
	import Konva from 'konva';
	import { writable, type Writable } from 'svelte/store';
	import { copy } from 'copy-anything';
	import { createHistoryStore } from '$components/canvas/history/historyStore';
	import { theme } from '$ts/stores/theme';
	import {
		getBrushIndicatorCircleFill,
		getBrushIndicatorCircleRadius,
		getBrushIndicatorCircleStroke,
		getBrushConfig,
		getBrushSize,
		getCanvasMinSize,
		getColoredSvgPattern,
		getBrushStroke,
		getSvgPatternFg,
		getSvgPatternBg
	} from '$components/canvas/helpers/main';
	import { exportStage } from '$components/canvas/helpers/exportStage';

	export let generationOutput: {
		width: number;
		height: number;
		image_url: string;
	};

	const stageId = 'konva-stage';
	const stageForExportId = 'konva-stage-export';

	let stage: Konva.Stage;
	let imageLayer: Konva.Layer;
	let patternLayer: Konva.Layer;
	let paintLayer: Konva.Layer;
	let brushIndicatorLayer: Konva.Layer;
	let brushIndicatorCircle: Konva.Circle;
	let patternImageObj: HTMLImageElement;
	let patternRect: Konva.Rect;
	let patternAnim: Konva.Animation;

	let canvasContainerWidth: number | undefined = undefined;
	let canvasContainerHeight: number | undefined = undefined;
	let canvasWidth: number | undefined = undefined;
	let canvasHeight: number | undefined = undefined;

	let lastLine: Konva.Line;
	let selectedTool: Writable<TTool> = writable('brush');
	let isPainting = false;

	$: {
		if (canvasContainerWidth && canvasContainerHeight) {
			const aspectRatio = generationOutput.width / generationOutput.height;
			const widthRatio = canvasContainerWidth / generationOutput.width;
			const heightRatio = canvasContainerHeight / generationOutput.height;
			const boundByHeight = heightRatio < widthRatio;
			if (boundByHeight) {
				canvasHeight = canvasContainerHeight;
				canvasWidth = canvasHeight * aspectRatio;
			} else {
				canvasWidth = canvasContainerWidth;
				canvasHeight = canvasWidth / aspectRatio;
			}
		}
	}

	let canvasMinSize = getCanvasMinSize(canvasWidth, canvasHeight);
	let brushConfig = getBrushConfig(canvasMinSize);
	let brushSize = getBrushSize(brushConfig);

	$: {
		if (brushIndicatorCircle) {
			brushIndicatorCircle.stroke(getBrushIndicatorCircleStroke($theme));
			brushIndicatorCircle.fill(getBrushIndicatorCircleFill($theme));
		}
	}

	$: {
		if (paintLayer) {
			paintLayer.children.forEach((c) => {
				if (c instanceof Konva.Line) {
					c.stroke(getBrushStroke($theme));
				}
			});
		}
	}

	$: {
		if (canvasWidth && canvasHeight && canvasMinSize) {
			brushConfig = getBrushConfig(canvasMinSize);
		}
	}

	$: canvasMinSize = getCanvasMinSize(canvasWidth, canvasHeight);
	$: brushConfig, onBrushConfigChanged();
	$: brushSize, onBrushSizeChanged();
	$: {
		if (brushIndicatorCircle) {
			if ($selectedTool === 'eraser') {
				brushIndicatorCircle.dashEnabled(true);
			} else {
				brushIndicatorCircle.dashEnabled(false);
			}
		}
	}

	let {
		history,
		hasUndo,
		hasRedo,
		currentState: historyCurrentState
	} = createHistoryStore<TInpaintingState>();

	$: [canvasWidth, canvasHeight], onCanvasSizeChanged();

	function onCanvasSizeChanged() {
		if (!canvasWidth || !canvasHeight) return;
		if (stage) return;
		stage = new Konva.Stage({
			container: 'konva-stage',
			width: canvasWidth,
			height: canvasHeight
		});
		imageLayer = new Konva.Layer();
		paintLayer = new Konva.Layer();
		brushIndicatorLayer = new Konva.Layer();
		patternLayer = new Konva.Layer();
		stage.add(imageLayer);
		stage.add(paintLayer);
		stage.add(patternLayer);
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
		imageObj.src = generationOutput.image_url;

		history.addEntry({ paintLayerChildren: [] });

		patternImageObj = new Image();
		patternImageObj.onload = function () {
			resetPatternRect();
		};
		patternImageObj.src = getColoredSvgPattern(getSvgPatternFg($theme), getSvgPatternBg($theme));

		brushIndicatorCircle = new Konva.Circle({
			x: stage.width() / 2,
			y: stage.height() / 2,
			radius: getBrushIndicatorCircleRadius(brushSize),
			stroke: getBrushIndicatorCircleStroke($theme),
			strokeWidth: 2,
			visible: false,
			fillEnabled: true,
			dashEnabled: false,
			fill: getBrushIndicatorCircleFill($theme),
			dash: [1, 4],
			lineCap: 'round',
			lineJoin: 'round'
		});

		brushIndicatorLayer.add(brushIndicatorCircle);

		stage.on('mousedown touchstart', function (e) {
			isPainting = true;
			const pos = stage.getPointerPosition();
			if (!pos) return;
			lastLine = new Konva.Line({
				stroke: getBrushStroke($theme),
				strokeWidth: brushSize,
				globalCompositeOperation: $selectedTool === 'brush' ? 'source-over' : 'destination-out',
				lineCap: 'round',
				lineJoin: 'round',
				points: [pos.x, pos.y, pos.x, pos.y]
			});
			paintLayer.add(lastLine);
			patternRect?.moveToTop();
		});

		stage.on('mouseup touchend', function () {
			isPainting = false;
			const paintLayerChildren = copy(paintLayer.getChildren());
			const linesOnly = paintLayerChildren.filter((c) => c instanceof Konva.Line);
			history.addEntry({ paintLayerChildren: linesOnly });
		});

		stage.on('mousemove touchmove', function (e) {
			console.log('mousemove');
			const pos = stage.getPointerPosition();
			if (!pos) return;

			brushIndicatorCircle.visible(true);
			brushIndicatorCircle.position(pos);

			if (!isPainting) return;

			e.evt.preventDefault();

			const newPoints = lastLine.points().concat([pos.x, pos.y]);
			lastLine.points(newPoints);

			patternRect?.moveToTop();
		});
	}

	function onUndo() {
		history.undo();
		if ($historyCurrentState) {
			setInpaintingState($historyCurrentState);
			resetPatternRect();
		}
	}

	function onRedo() {
		history.redo();
		if ($historyCurrentState) {
			setInpaintingState($historyCurrentState);
			resetPatternRect();
		}
	}

	function setInpaintingState(newState: TInpaintingState) {
		paintLayer.destroyChildren();

		const children = newState.paintLayerChildren;
		children.forEach((child) => {
			const node = Konva.Node.create(child);
			paintLayer.add(node);
			if (node instanceof Konva.Rect) node.moveToTop();
		});

		paintLayer.draw();
	}

	function onBrushSizeChanged() {
		if (!brushIndicatorCircle) return;
		resetBrushCirclePosition();
		setBrushCircleSize();
	}

	function resetBrushCirclePosition() {
		if (!brushIndicatorCircle) return;
		brushIndicatorCircle.position({ x: stage.width() / 2, y: stage.height() / 2 });
		brushIndicatorLayer.draw();
	}

	function setBrushCircleSize() {
		if (!brushIndicatorCircle) return;
		brushIndicatorCircle.radius(getBrushIndicatorCircleRadius(brushSize));
		brushIndicatorLayer.draw();
	}

	function onBrushConfigChanged() {
		brushSize = (brushConfig.max - brushConfig.min) / 2 + brushConfig.min;
	}

	function resetPatternRect() {
		if (patternRect) patternRect.destroy();
		if (patternAnim) patternAnim.stop();
		patternRect = new Konva.Rect({
			x: 0,
			y: 0,
			width: stage.width(),
			height: stage.height(),
			fillPatternImage: patternImageObj,
			fillPatternRepeat: 'repeat',
			fillPatternScaleX: 0.5,
			fillPatternScaleY: 0.5,
			globalCompositeOperation: 'source-in'
		});
		paintLayer.add(patternRect);
		patternAnim = new Konva.Animation(function (frame) {
			var offset = patternRect.fillPatternOffset();
			offset.x += 0.1;
			patternRect.fillPatternOffset(offset);
		}, paintLayer);
		patternAnim.start();
	}
</script>

<div class="w-full flex-1 min-h-0 flex flex-col">
	<div class="w-full flex items-center justify-center z-10">
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
		bind:clientWidth={canvasContainerWidth}
		bind:clientHeight={canvasContainerHeight}
		class="w-full flex-1"
	>
		<div
			style="width: {canvasContainerWidth}px; height: {canvasHeight}"
			class="absolute left-0 top-0"
		>
			<div class="w-full full flex items-center justify-center">
				<div
					class="ring-2 ring-c-bg-secondary shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] rounded-lg overflow-hidden"
					style="width: {canvasWidth}px; height: {canvasHeight}px"
					id={stageId}
				/>
			</div>
		</div>
	</div>
	<div class="w-0 h-0 overflow-hidden" id={stageForExportId} />
</div>
