import type { TAvailableSchedulerId } from '$ts/constants/schedulers';
import { getImageFileNameFromGeneration } from '$ts/helpers/getImageFileNameFromGeneration';
import Dexie, { type Table } from 'dexie';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';

export class MySubClassedDexie extends Dexie {
	generations!: Table<TIndexedDBGeneration>;

	constructor() {
		super('stablecogDb');
		this.version(1.4).stores({
			generations:
				'++id, prompt, negative_prompt, model_id, scheduler_id, width, height, num_inference_steps, guidance_scale, seed, server_url, duration_ms'
		});
	}
}

export const indexedDb = new MySubClassedDexie();

export async function downloadLegacyGenerations() {
	const zip = new JSZip();
	const generations = await indexedDb.generations.toArray();
	const imagesFolder = zip.folder('generation_images');
	const generationsFolder = zip.folder('generation_metadatas');
	for (let i = 0; i < generations.length; i++) {
		const generation = generations[i];
		const imageName = getImageFileNameFromGeneration({
			guidanceScale: generation.guidance_scale,
			inferenceSteps: generation.num_inference_steps,
			isUpscaled: generation.upscaledImageDataB64 !== undefined,
			prompt: generation.prompt,
			seed: generation.seed,
			url: generation.imageDataB64
		});
		const fileName = imageName.split('.')[0];
		const dataUrl = generation.upscaledImageDataB64 ?? generation.imageDataB64;
		const base64Input = dataUrl.split(',')[1];
		imagesFolder?.file(imageName, base64Input, {
			base64: true
		});
		generationsFolder?.file(
			`${fileName}.txt`,
			`prompt: ${generation.prompt}\n${
				generation.negative_prompt ? `negative_prompt: ${generation.negative_prompt}\n` : ''
			}model_id: ${generation.model_id}\nscheduler_id: ${generation.scheduler_id}\nwidth: ${
				generation.width
			}\nheight: ${generation.height}\nnum_inference_steps: ${
				generation.num_inference_steps
			}\nguidance_scale: ${generation.guidance_scale}\nseed: ${generation.seed}`
		);
	}
	zip.generateAsync({ type: 'blob' }).then(function (content) {
		saveAs(content, 'generations.zip');
	});
}

export async function doesUserHaveLegacyGenerations() {
	const generations = await indexedDb.generations.toArray();
	return generations.length > 0;
}

export async function downloadGeneration(generation: TIndexedDBGeneration) {
	const link = document.createElement('a');
	link.download = link.href = generation.imageDataB64;
	link.click();
}

export interface TIndexedDBGeneration {
	id?: number;
	prompt: string;
	negative_prompt?: string;
	model_id?: TAvailableGenerationModelId;
	scheduler_id?: TAvailableSchedulerId;
	width: number;
	height: number;
	seed: number;
	num_inference_steps: number;
	guidance_scale: number;
	duration_ms?: number;
	server_url: string;
	imageDataB64: string;
	upscaledImageDataB64?: string;
}
