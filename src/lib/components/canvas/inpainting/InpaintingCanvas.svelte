<script lang="ts">
	import Toolbar from '$components/canvas/toolbar/Toolbar.svelte';
	import type { TInpaintingState, TTool } from '$components/canvas/toolbar/types';
	import type Konva from 'konva';
	import { writable, type Writable } from 'svelte/store';
	import { copy } from 'copy-anything';
	import { createHistoryStore } from '$components/canvas/history/historyStore';
	import { theme } from '$ts/stores/theme';
	import {
		getBrushIndicatorCircleFill,
		getBrushIndicatorCircleRadius,
		getBrushIndicatorCircleStroke,
		getBrushConfig,
		getDefaultBrushSize,
		getCanvasMinSize,
		getColoredSvgPattern,
		getBrushStroke,
		getSvgPatternFg,
		getSvgPatternBg
	} from '$components/canvas/helpers/main';
	import { generateMode } from '$ts/stores/generate/generateMode';
	import { baseOutputForInpainting } from '$components/canvas/stores/baseOutputForInpainting';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import { onMount } from 'svelte';
	import ErrorChip from '$components/error/ErrorChip.svelte';
	import LL from '$i18n/i18n-svelte';
	import { konvaContainerForExportId, konvaContainerId } from '$components/canvas/constants/main';
	import { KonvaInstance, paintLayer, stage } from '$components/canvas/stores/konva';
	import {
		generationHeight,
		generationInitImageUrl,
		generationModelId,
		generationWidth
	} from '$ts/stores/generationSettings';
	import type { TAvailableWidth } from '$ts/constants/generationSize';
	import type { TGenerationFullOutput } from '$ts/stores/user/generation';

	export let baseOutput: TGenerationFullOutput;

	let konvaErrored = false;
	let imageLayer: Konva.Layer;
	let patternLayer: Konva.Layer;
	let brushIndicatorLayer: Konva.Layer;
	let image: HTMLImageElement | undefined = undefined;
	let imageLoaded = false;
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
			const aspectRatio = baseOutput.generation.width / baseOutput.generation.height;
			const widthRatio = canvasContainerWidth / baseOutput.generation.width;
			const heightRatio = canvasContainerHeight / baseOutput.generation.height;
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
	let brushSize = getDefaultBrushSize(brushConfig);

	$: {
		if (brushIndicatorCircle) {
			brushIndicatorCircle.stroke(getBrushIndicatorCircleStroke($theme));
			brushIndicatorCircle.fill(getBrushIndicatorCircleFill($theme));
		}
	}

	$: {
		if ($paintLayer && $KonvaInstance) {
			$paintLayer.children.forEach((c) => {
				if (c instanceof $KonvaInstance.Line) {
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

	$: [baseOutput, canvasWidth, canvasHeight, $KonvaInstance], createCanvas({ reset: true });

	function createCanvas({ reset = false }: { reset: boolean }) {
		if (!$KonvaInstance) return;
		if (!canvasWidth || !canvasHeight) return;
		if (reset && $stage) {
			$stage.destroy();
			image = undefined;
			imageLoaded = false;
			history.clear();
			konvaErrored = false;
		}

		// set generation params
		generationWidth.set(baseOutput.generation.width.toString() as TAvailableWidth);
		generationHeight.set(baseOutput.generation.height.toString() as TAvailableWidth);
		generationInitImageUrl.set(baseOutput.image_url);
		generationModelId.set(baseOutput.generation.model_id);

		$stage = new $KonvaInstance.Stage({
			container: 'konva-stage',
			width: canvasWidth,
			height: canvasHeight
		});
		imageLayer = new $KonvaInstance.Layer();
		paintLayer.set(new $KonvaInstance.Layer());
		brushIndicatorLayer = new $KonvaInstance.Layer();
		patternLayer = new $KonvaInstance.Layer();
		$stage.add(imageLayer);
		$stage.add($paintLayer);
		$stage.add(patternLayer);
		$stage.add(brushIndicatorLayer);

		image = new Image();
		image.onload = function () {
			const img = new $KonvaInstance.Image({
				x: 0,
				y: 0,
				image,
				width: $stage.width(),
				height: $stage.height()
			});
			imageLayer.add(img);
			imageLoaded = true;
		};
		image.src = baseOutput.image_url;

		history.addEntry({ paintLayerChildren: [] });

		patternImageObj = new Image();
		patternImageObj.onload = function () {
			resetPatternRect();
		};
		patternImageObj.src = getColoredSvgPattern(getSvgPatternFg($theme), getSvgPatternBg($theme));

		brushIndicatorCircle = new $KonvaInstance.Circle({
			x: $stage.width() / 2,
			y: $stage.height() / 2,
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

		$stage.on('mousedown touchstart', function (e) {
			isPainting = true;
			const pos = $stage.getPointerPosition();
			if (!pos) return;
			lastLine = new $KonvaInstance.Line({
				stroke: getBrushStroke($theme),
				strokeWidth: brushSize,
				globalCompositeOperation: $selectedTool === 'brush' ? 'source-over' : 'destination-out',
				lineCap: 'round',
				lineJoin: 'round',
				points: [pos.x, pos.y, pos.x, pos.y]
			});
			$paintLayer.add(lastLine);
			patternRect?.moveToTop();
		});

		$stage.on('mouseup touchend', function () {
			isPainting = false;
			const paintLayerChildren = copy($paintLayer.getChildren());
			const linesOnly = paintLayerChildren.filter((c) => c instanceof $KonvaInstance.Line);
			history.addEntry({ paintLayerChildren: linesOnly });
		});

		$stage.on('mousemove touchmove', function (e) {
			console.log('mousemove');
			const pos = $stage.getPointerPosition();
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
		$paintLayer.destroyChildren();

		const children = newState.paintLayerChildren;
		children.forEach((child) => {
			const node = $KonvaInstance.Node.create(child);
			$paintLayer.add(node);
			if (node instanceof $KonvaInstance.Rect) node.moveToTop();
		});

		$paintLayer.draw();
	}

	function onBrushSizeChanged() {
		if (!brushIndicatorCircle) return;
		resetBrushCirclePosition();
		setBrushCircleSize();
	}

	function resetBrushCirclePosition() {
		if (!brushIndicatorCircle) return;
		brushIndicatorCircle.position({ x: $stage.width() / 2, y: $stage.height() / 2 });
		brushIndicatorLayer.draw();
	}

	function setBrushCircleSize() {
		if (!brushIndicatorCircle) return;
		brushIndicatorCircle.radius(getBrushIndicatorCircleRadius(brushSize));
		brushIndicatorLayer.draw();
	}

	function onBrushConfigChanged() {
		brushSize = getDefaultBrushSize(brushConfig);
	}

	function resetPatternRect() {
		if (patternRect) patternRect.destroy();
		if (patternAnim) patternAnim.stop();
		patternRect = new $KonvaInstance.Rect({
			x: 0,
			y: 0,
			width: $stage.width(),
			height: $stage.height(),
			fillPatternImage: patternImageObj,
			fillPatternRepeat: 'repeat',
			fillPatternScaleX: 0.5,
			fillPatternScaleY: 0.5,
			globalCompositeOperation: 'source-in'
		});
		$paintLayer.add(patternRect);
		patternAnim = new $KonvaInstance.Animation(function (frame) {
			var offset = patternRect.fillPatternOffset();
			offset.x += 0.1;
			patternRect.fillPatternOffset(offset);
		}, paintLayer);
		patternAnim.start();
	}

	function onCancelClicked() {
		generateMode.set('regular');
		baseOutputForInpainting.set(null);
	}

	onMount(async () => {
		try {
			const k = (await import('konva')).default;
			KonvaInstance.set(k);
		} catch (error) {
			console.log(error);
			konvaErrored = true;
		}
	});
</script>

<div class="w-full flex-1 min-h-0 flex flex-col items-center justify-center">
	<div class="w-full flex items-center justify-center z-10">
		<Toolbar
			{selectedTool}
			{onUndo}
			{onRedo}
			undoDisabled={!$hasUndo}
			redoDisabled={!$hasRedo}
			bind:brushSize
			{brushConfig}
			{onCancelClicked}
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
					style="width: {canvasWidth}px; height: {canvasHeight}px"
					class="relative rounded-lg overflow-hidden ring-2 bg-c-bg-secondary
					ring-c-bg-secondary shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]"
				>
					<div class="w-full h-full relative" id={konvaContainerId} />
					{#if !image || !imageLoaded}
						<div class="w-full h-full absolute left-0 top-0 flex items-center justify-center z-10">
							<IconAnimatedSpinner loading={true} class="w-8 h-8 text-c-on-bg/50" />
						</div>
					{/if}
					{#if !$KonvaInstance && konvaErrored}
						<div
							class="w-full h-full bg-c-bg-secondary absolute p-3 left-0 top-0 flex items-center justify-center"
						>
							<ErrorChip error={$LL.Error.SomethingWentWrong()} />
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
	<div class="w-0 h-0 overflow-hidden" id={konvaContainerForExportId} />
</div>
