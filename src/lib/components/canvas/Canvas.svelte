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
	import { stageCenteredPos } from '$components/canvas/utils';
	import PromptBar from '$components/generateBar/PromptBar.svelte';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import IconTickOnly from '$components/icons/IconTickOnly.svelte';
	import { env } from '$env/dynamic/public';
	import { maxSeed } from '$ts/constants/main';
	import { generateImage } from '$ts/queries/generateImage';
	import { promptInputValue } from '$ts/stores/generationSettings';
	import { serverUrl } from '$ts/stores/serverUrl';
	import type { TStatus } from '$ts/types/main';
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
	let imageObj: HTMLImageElement;

	let now: number;
	let nowInterval: NodeJS.Timeout;
	let startTimestamp: number;

	let newKonvaImageToPutOnStage: Konva.Image;

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

	let loadingOrSubmitting = false;
	let status: TStatus = 'idle';
	async function generate() {
		loadingOrSubmitting = true;
		startTimestamp = Date.now();
		status = 'loading';
		if ($promptInputValue === '' || $promptInputValue === undefined || $promptInputValue === null) {
			$promptInputValue = 'Portrait of a cat by Van Gogh';
		}
		let oldStageScale = stage.scale();
		stage.scale({ x: 1, y: 1 });
		const relativeRect = selectionRect.getClientRect({
			relativeTo: imageLayer
		});
		let init_image = imageLayer.toDataURL({
			x: relativeRect.x,
			y: relativeRect.y,
			width: selectionRect.width(),
			height: selectionRect.height()
		});
		let canvas = imageLayer.toCanvas({
			x: relativeRect.x,
			y: relativeRect.y,
			width: selectionRect.width(),
			height: selectionRect.height()
		});
		let ctx = canvas.getContext('2d');
		if (!ctx) throw new Error('Could not get canvas context');
		let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		let data = imageData.data;
		let hasNonTransparentPixel = false;
		for (let i = 0; i < data.length; i += 4) {
			if (data[i + 3] === 0) {
				data[i] = 255;
				data[i + 1] = 255;
				data[i + 2] = 255;
				data[i + 3] = 255;
			} else {
				if (!hasNonTransparentPixel) hasNonTransparentPixel = true;
				data[i] = 0;
				data[i + 1] = 0;
				data[i + 2] = 0;
				data[i + 3] = 255;
			}
		}
		ctx.putImageData(imageData, 0, 0);
		let mask = canvas.toDataURL('image/png');
		stage.scale(oldStageScale);
		try {
			let res = await generateImage({
				server_url: $serverUrl || env.PUBLIC_DEFAULT_SERVER_URL,
				prompt: $promptInputValue,
				negative_prompt: undefined,
				model_id: '048b4aa3-5586-47ed-900f-f4341c96bdb2',
				scheduler_id: '162b6989-f635-4bfe-a2f5-24d4246df318',
				width: 512,
				height: 512,
				seed: Math.round(Math.random() * maxSeed),
				guidance_scale: 7,
				num_inference_steps: 50,
				should_submit_to_gallery: false,
				init_image: hasNonTransparentPixel ? init_image : undefined,
				mask: hasNonTransparentPixel ? mask : undefined,
				prompt_strength: 0.5,
				output_image_ext: 'png'
			});
			const b64 = res.data?.image_b64;
			if (!b64) throw new Error('No image returned from server');
			const i = new Image();
			console.log(b64);
			i.onload = () => {
				newKonvaImageToPutOnStage = new konva.Image({
					x: selectionRect.x(),
					y: selectionRect.y(),
					image: i,
					width: selectionRect.width(),
					height: selectionRect.height()
				});
				imageLayer.add(newKonvaImageToPutOnStage);
				stage.batchDraw();
			};
			i.src = b64;
			console.log(res);
			status = 'success';
		} catch (error) {
			status = 'error';
			console.log('Generation error', error);
		} finally {
			loadingOrSubmitting = false;
		}
	}

	$: sinceSec =
		now !== undefined && startTimestamp !== undefined
			? Math.max(now - startTimestamp, 0) / 1000
			: 0;

	$: [status], createOrDestroyInterval();

	async function createOrDestroyInterval() {
		if (nowInterval) clearInterval(nowInterval);
		if (status === 'loading') {
			nowInterval = setInterval(() => {
				now = Date.now();
			}, 100);
		}
	}

	function rejectGeneration() {
		status = 'idle';
		newKonvaImageToPutOnStage.remove();
		stage.batchDraw();
	}
	function acceptGeneration() {
		status = 'idle';
	}
</script>

<div bind:clientWidth bind:clientHeight class="w-full flex flex-1 relative">
	<div id="canvas-container" class="w-full flex-1 bg-c-bg ring-2 ring-c-bg-secondary z-10" />
	<div class="w-full absolute left-0 top-0 z-20 overflow-hidden h-24">
		<div
			class="w-full absolute z-10 left-0 top-0 px-6 py-4 flex items-center justify-center transition transform
			{status === 'idle' || status === 'loading' || status === 'error'
				? 'translate-y-0'
				: '-translate-y-24'}"
		>
			<div class="w-full max-w-6xl">
				<PromptBar onSubmit={generate} {loadingOrSubmitting} {status} {sinceSec} />
			</div>
		</div>
		<div
			class="w-full absolute z-20 left-0 top-0 px-6 py-4 flex items-center justify-center transition transform
			{status === 'success' ? 'translate-y-0' : '-translate-y-20'} gap-3"
		>
			<SubtleButton onClick={rejectGeneration}>
				<IconCancel class="text-c-danger" />
			</SubtleButton>
			<SubtleButton onClick={acceptGeneration}>
				<IconTickOnly class="text-c-success" />
			</SubtleButton>
		</div>
	</div>
</div>
