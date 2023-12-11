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
	import { generations, type TGenerationFullOutput } from '$ts/stores/user/generation';
	import GenerationAnimation from '$components/generate/GenerationAnimation.svelte';
	import { fade, fly } from 'svelte/transition';
	import QueuePosition from '$components/QueuePosition.svelte';
	import { quadIn, quadOut } from 'svelte/easing';
	import QueuePositionProvider from '$components/generate/QueuePositionProvider.svelte';
	import ToolbarSectionWrapper from '$components/canvas/toolbar/ToolbarSectionWrapper.svelte';
	import ToolbarButton from '$components/canvas/toolbar/ToolbarButton.svelte';
	import IconChevronLeft from '$components/icons/IconChevronLeft.svelte';
	import IconChevronRight from '$components/icons/IconChevronRight.svelte';
	import { flyAndScale } from '$ts/animation/transitions';

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

	$: generation = $generations?.[0];
	$: animation = $generations?.[0].outputs?.[0]?.animation;
	$: isGenerating =
		generation &&
		(generation.status === 'to-be-submitted' ||
			generation.status === 'server-received' ||
			generation.status === 'server-processing');

	$: isGenerating, onIsGeneratingChanged();

	let allOutputs: TGenerationFullOutput[] | undefined = undefined;
	$: allOutputs =
		generation.status === 'succeeded'
			? [baseOutput, ...generation.outputs.map((o) => ({ generation: generation, ...o }))]
			: undefined;
	let selectedOutputIndex = 0;
	$: allOutputs, onAllOutputsChanged();

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
			allOutputs = undefined;
			selectedOutputIndex = 0;
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

		setImage(baseOutput.image_url);

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
		$paintLayer?.destroyChildren();

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

	function onIsGeneratingChanged() {
		if (!brushIndicatorLayer) return;
		brushIndicatorLayer.visible(!isGenerating);
	}

	function onAllOutputsChanged() {
		if (!allOutputs || allOutputs.length < 2) return;
		$paintLayer?.destroyChildren();
		history.addEntry({ paintLayerChildren: [] });
		selectedOutputIndex = 1;
		setImage(allOutputs[selectedOutputIndex].image_url);
	}

	function setImage(url: string) {
		imageLayer?.destroyChildren();
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
		image.src = url;
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

<QueuePositionProvider {generation} let:positionInQueue let:showQueuePosition>
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
							<div class="w-full h-full absolute left-0 top-0 flex items-center justify-center">
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
						{#if isGenerating && animation}
							<div
								out:fade={{ duration: 3000, easing: quadIn }}
								class="w-full h-full absolute left-0 top-0 flex items-center justify-center"
							>
								<GenerationAnimation {animation} />
								<QueuePosition hasBg position={positionInQueue} show={showQueuePosition} />
							</div>
						{:else if allOutputs !== undefined}
							{@const outputs = allOutputs}
							<div
								class="w-full h-full pointer-events-none absolute bottom-0 left-0 flex flex-col justify-between items-center p-2"
							>
								{#if selectedOutputIndex === 0}
									<div
										transition:flyAndScale={{
											duration: 100,
											easing: quadOut,
											opacity: 0,
											yPercent: -100
										}}
										class="bg-c-bg-secondary p-px rounded-md shadow-md shadow-c-shadow/[var(--o-shadow-normal)]"
									>
										<p class="px-1.75 py-0.5 font-medium text-sm text-c-primary">
											{$LL.Inpainting.OriginalImageTitle()}
										</p>
									</div>
								{:else}
									<div class="w-full" />
								{/if}
								<ToolbarSectionWrapper class="gap-2 pointer-events-auto">
									<ToolbarButton
										label="Go Left"
										onClick={() => {
											const index = (selectedOutputIndex - 1 + outputs.length) % outputs.length;
											selectedOutputIndex = index;
											setImage(outputs[index].image_url);
										}}
										icon={IconChevronLeft}
										iconClass="group-active:-translate-x-1"
										onClickClass="-translate-x-1"
										disabled={selectedOutputIndex === 0}
									/>
									<p class="font-medium text-c-on-bg/60 text-sm min-w-[2rem] text-center">
										<span
											class="font-semibold transition duration-100 {selectedOutputIndex === 0
												? 'text-c-primary'
												: 'text-c-on-bg'}">{selectedOutputIndex + 1}</span
										><span class="px-0.5ch">/</span><span>{outputs.length}</span>
									</p>
									<ToolbarButton
										label="Go Right"
										onClick={() => {
											const index = (selectedOutputIndex + 1 + outputs.length) % outputs.length;
											selectedOutputIndex = index;
											setImage(outputs[index].image_url);
										}}
										icon={IconChevronRight}
										iconClass="group-active:translate-x-1"
										onClickClass="translate-x-1"
										disabled={selectedOutputIndex === outputs.length - 1}
									/>
								</ToolbarSectionWrapper>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
		<div class="w-0 h-0 overflow-hidden" id={konvaContainerForExportId} />
	</div>
</QueuePositionProvider>
